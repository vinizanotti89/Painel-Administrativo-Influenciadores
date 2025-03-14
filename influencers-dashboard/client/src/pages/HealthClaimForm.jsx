import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';

// Serviços de API
import instagramService from '@/services/instagram';
import youtubeService from '@/services/youtube';
import linkedinService from '@/services/linkedin';
import useTranslation from '@/hooks/useTranslation';

// Imagens para estados de erro e perfil padrão
import defaultProfileImage from '@/assets/default_profile.png';

import '@/styles/pages/HealthClaimForm.css';

const HealthClaimForm = React.forwardRef(({ className = '', ...props }, ref) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [influencer, setInfluencer] = useState(null);
  const [formData, setFormData] = useState({
    influencerId: id || '',
    platform: '',
    contentType: 'post',
    contentUrl: '',
    claimText: '',
    category: 'nutrition',
    verificationStatus: 'unverified',
    factCheck: '',
    explanation: '',
    evidenceLinks: [''],
    sourceDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchInfluencerData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch data from all platforms to find the influencer
        let instagramData = null;
        let youtubeData = null;
        let linkedinData = null;

        try {
          instagramData = await instagramService.getProfileByUsername(id);
        } catch (err) {
          console.log("Instagram search failed:", err.message);
        }

        try {
          youtubeData = await youtubeService.getChannelByIdentifier(id);
        } catch (err) {
          console.log("YouTube search failed:", err.message);
        }

        try {
          linkedinData = await linkedinService.getProfileByUsername(id);
        } catch (err) {
          console.log("LinkedIn search failed:", err.message);
        }

        // Process and determine which platform has data for this influencer
        const influencerData = processInfluencerData(instagramData, youtubeData, linkedinData);

        if (influencerData) {
          setInfluencer(influencerData);
          setFormData(prev => ({
            ...prev,
            platform: influencerData.platform
          }));
        }
      } catch (err) {
        const errorMessage = t('healthClaims.form.errors.influencerDataError');
        setError(`${errorMessage}: ${err.message || t('general.unknownError')}`);
        console.error('Error fetching influencer data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencerData();
  }, [id, t]);

  // Process influencer data from all platforms
  const processInfluencerData = (instagramData, youtubeData, linkedinData) => {
    try {
      if (instagramData) {
        return {
          id: instagramData.id,
          name: instagramData.username,
          platform: 'Instagram',
          profileUrl: instagramData.profilePictureUrl || defaultProfileImage,
          followers: instagramData.followersCount || 0
        };
      }

      if (youtubeData) {
        const channelData = youtubeData.rawData || youtubeData;
        return {
          id: channelData.id,
          name: channelData.snippet?.title || youtubeData.channelName || id,
          platform: 'YouTube',
          profileUrl: channelData.snippet?.thumbnails?.default?.url || youtubeData.thumbnailUrl || defaultProfileImage,
          followers: parseInt(channelData.statistics?.subscriberCount) || 0
        };
      }

      if (linkedinData) {
        return {
          id: linkedinData.id,
          name: `${linkedinData.localizedFirstName || ''} ${linkedinData.localizedLastName || ''}`.trim() || id,
          platform: 'LinkedIn',
          profileUrl: linkedinData.profilePicture?.displayImage || defaultProfileImage,
          followers: linkedinData.followersCount || 0
        };
      }

      return null;
    } catch (error) {
      console.error('Error processing influencer data:', error);
      return null;
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle evidence links changes
  const handleEvidenceLinkChange = (index, value) => {
    const updatedLinks = [...formData.evidenceLinks];
    updatedLinks[index] = value;
    setFormData(prev => ({
      ...prev,
      evidenceLinks: updatedLinks
    }));
  };

  // Add a new evidence link field
  const addEvidenceLink = () => {
    setFormData(prev => ({
      ...prev,
      evidenceLinks: [...prev.evidenceLinks, '']
    }));
  };

  // Remove an evidence link field
  const removeEvidenceLink = (index) => {
    const updatedLinks = [...formData.evidenceLinks];
    updatedLinks.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      evidenceLinks: updatedLinks
    }));
  };

  // Fetch content details for validation
  const fetchContentDetails = async () => {
    try {
      const { platform, contentUrl } = formData;
      let contentDetails = null;

      if (platform === 'Instagram') {
        // Extract post ID from Instagram URL
        const match = contentUrl.match(/\/p\/([^\/]+)/);
        if (match && match[1]) {
          const postId = match[1];
          // This would be a real API call in production
          contentDetails = await instagramService.getRecentMedia(postId);
        }
      } else if (platform === 'YouTube') {
        // Extract video ID from YouTube URL
        const match = contentUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\?]+)/);
        if (match && match[1]) {
          const videoId = match[1];
          // This would be a real API call in production
          contentDetails = await youtubeService.getVideosStats([videoId]);
        }
      } else if (platform === 'LinkedIn') {
        // Extract post ID from LinkedIn URL
        const match = contentUrl.match(/\/posts\/([^\/]+)/);
        if (match && match[1]) {
          const postId = match[1];
          // This would be a real API call in production
          contentDetails = await linkedinService.getUserPosts();
        }
      }

      return contentDetails;
    } catch (error) {
      console.error('Error fetching content details:', error);
      return null;
    }
  };

  // Validate form before submission
  const validateForm = () => {
    if (!formData.influencerId) {
      setError(t('healthClaims.form.errors.influencerIdRequired'));
      return false;
    }

    if (!formData.platform) {
      setError(t('healthClaims.form.errors.platformRequired'));
      return false;
    }

    if (!formData.contentUrl) {
      setError(t('healthClaims.form.errors.contentUrlRequired'));
      return false;
    }

    if (!formData.claimText) {
      setError(t('healthClaims.form.errors.claimTextRequired'));
      return false;
    }

    if (!formData.category) {
      setError(t('healthClaims.form.errors.categoryRequired'));
      return false;
    }

    if (!formData.verificationStatus) {
      setError(t('healthClaims.form.errors.verificationStatusRequired'));
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Fetch content details for validation
      const contentDetails = await fetchContentDetails();

      if (!contentDetails) {
        setError(t('healthClaims.form.errors.contentValidationFailed'));
        setSubmitting(false);
        return;
      }

      // Process content details
      const processedData = {
        ...formData,
        contentId: contentDetails.id || '',
        contentTitle: contentDetails.title || contentDetails.caption || '',
        contentDate: contentDetails.timestamp || formData.sourceDate,
        evidenceLinks: formData.evidenceLinks.filter(link => link.trim() !== '')
      };

      // Submit the claim data to your backend/API
      // This is a placeholder - implement your actual API call here
      console.log('Submitting health claim:', processedData);

      // Simulate successful submission
      setTimeout(() => {
        // Redirect to health claims page on success
        navigate(`/health-claims/${formData.influencerId}`);
      }, 1000);
    } catch (err) {
      const errorMessage = t('healthClaims.form.errors.submissionError');
      setError(`${errorMessage}: ${err.message || t('general.unknownError')}`);
      console.error('Error submitting health claim:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="health-claim-form">
        <div className="loading-state">{t('general.loading')}</div>
      </div>
    );
  }

  return (
    <div className={`health-claim-form ${className}`} ref={ref} {...props}>
      {error && (
        <Alert className="error-alert" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="form-container">
          <CardHeader className="form-header">
            <CardTitle className="form-title">
              {influencer
                ? `${t('healthClaims.form.title')} - ${influencer.name}`
                : t('healthClaims.form.title')}
            </CardTitle>
          </CardHeader>

          <CardContent className="form-content">
            {!influencer && (
              <div className="form-field">
                <Label htmlFor="influencerId">{t('healthClaims.form.fields.influencerId')}</Label>
                <Input
                  id="influencerId"
                  name="influencerId"
                  value={formData.influencerId}
                  onChange={handleChange}
                  placeholder={t('healthClaims.form.placeholders.influencerId')}
                />
              </div>
            )}

            <div className="form-grid">
              <div className="form-field">
                <Label htmlFor="platform">{t('healthClaims.form.fields.platform')}</Label>
                <Select
                  value={formData.platform}
                  onValueChange={(value) => handleSelectChange('platform', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('healthClaims.form.placeholders.platform')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="YouTube">YouTube</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="form-field">
                <Label htmlFor="contentType">{t('healthClaims.form.fields.contentType')}</Label>
                <Select
                  value={formData.contentType}
                  onValueChange={(value) => handleSelectChange('contentType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('healthClaims.form.placeholders.contentType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="post">{t('healthClaims.form.contentTypes.post')}</SelectItem>
                    <SelectItem value="video">{t('healthClaims.form.contentTypes.video')}</SelectItem>
                    <SelectItem value="story">{t('healthClaims.form.contentTypes.story')}</SelectItem>
                    <SelectItem value="reel">{t('healthClaims.form.contentTypes.reel')}</SelectItem>
                    <SelectItem value="article">{t('healthClaims.form.contentTypes.article')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="form-field">
              <Label htmlFor="contentUrl">{t('healthClaims.form.fields.contentUrl')}</Label>
              <Input
                id="contentUrl"
                name="contentUrl"
                value={formData.contentUrl}
                onChange={handleChange}
                placeholder={t('healthClaims.form.placeholders.contentUrl')}
              />
            </div>

            <div className="form-field">
              <Label htmlFor="claimText">{t('healthClaims.form.fields.claimText')}</Label>
              <Textarea
                id="claimText"
                name="claimText"
                value={formData.claimText}
                onChange={handleChange}
                placeholder={t('healthClaims.form.placeholders.claimText')}
                rows={3}
              />
            </div>

            <div className="form-grid">
              <div className="form-field">
                <Label htmlFor="category">{t('healthClaims.form.fields.category')}</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('healthClaims.form.placeholders.category')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nutrition">{t('healthClaims.form.categories.nutrition')}</SelectItem>
                    <SelectItem value="fitness">{t('healthClaims.form.categories.fitness')}</SelectItem>
                    <SelectItem value="medical">{t('healthClaims.form.categories.medical')}</SelectItem>
                    <SelectItem value="supplement">{t('healthClaims.form.categories.supplement')}</SelectItem>
                    <SelectItem value="mental_health">{t('healthClaims.form.categories.mentalHealth')}</SelectItem>
                    <SelectItem value="skincare">{t('healthClaims.form.categories.skincare')}</SelectItem>
                    <SelectItem value="weight_loss">{t('healthClaims.form.categories.weightLoss')}</SelectItem>
                    <SelectItem value="other">{t('healthClaims.form.categories.other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="form-field">
                <Label htmlFor="verificationStatus">{t('healthClaims.form.fields.verificationStatus')}</Label>
                <Select
                  value={formData.verificationStatus}
                  onValueChange={(value) => handleSelectChange('verificationStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('healthClaims.form.placeholders.verificationStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unverified">{t('healthClaims.form.verificationStatuses.unverified')}</SelectItem>
                    <SelectItem value="verified_true">{t('healthClaims.form.verificationStatuses.verifiedTrue')}</SelectItem>
                    <SelectItem value="verified_false">{t('healthClaims.form.verificationStatuses.verifiedFalse')}</SelectItem>
                    <SelectItem value="verified_partially">{t('healthClaims.form.verificationStatuses.verifiedPartially')}</SelectItem>
                    <SelectItem value="verified_misleading">{t('healthClaims.form.verificationStatuses.verifiedMisleading')}</SelectItem>
                    <SelectItem value="verified_inconclusive">{t('healthClaims.form.verificationStatuses.verifiedInconclusive')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="form-field">
              <Label htmlFor="factCheck">{t('healthClaims.form.fields.factCheck')}</Label>
              <Input
                id="factCheck"
                name="factCheck"
                value={formData.factCheck}
                onChange={handleChange}
                placeholder={t('healthClaims.form.placeholders.factCheck')}
              />
            </div>

            <div className="form-field">
              <Label htmlFor="explanation">{t('healthClaims.form.fields.explanation')}</Label>
              <Textarea
                id="explanation"
                name="explanation"
                value={formData.explanation}
                onChange={handleChange}
                placeholder={t('healthClaims.form.placeholders.explanation')}
                rows={4}
              />
            </div>

            <div className="form-field">
              <Label>{t('healthClaims.form.fields.evidenceLinks')}</Label>
              {formData.evidenceLinks.map((link, index) => (
                <div key={index} className="evidence-link-row">
                  <Input
                    value={link}
                    onChange={(e) => handleEvidenceLinkChange(index, e.target.value)}
                    placeholder={t('healthClaims.form.placeholders.evidenceLink')}
                    className="evidence-link-input"
                  />
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeEvidenceLink(index)}
                      className="remove-link-btn"
                    >
                      {t('general.remove')}
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addEvidenceLink}
                className="add-link-btn"
              >
                {t('healthClaims.form.buttons.addEvidence')}
              </Button>
            </div>

            <div className="form-field">
              <Label htmlFor="sourceDate">{t('healthClaims.form.fields.sourceDate')}</Label>
              <Input
                id="sourceDate"
                name="sourceDate"
                type="date"
                value={formData.sourceDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={submitting}
              >
                {t('general.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={submitting}
              >
                {submitting ? t('general.submitting') : t('healthClaims.form.buttons.submit')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
});

HealthClaimForm.displayName = 'HealthClaimForm';

export default HealthClaimForm;

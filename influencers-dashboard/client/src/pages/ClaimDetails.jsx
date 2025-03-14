import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

// Serviços de API
import instagramService from '@/services/instagram';
import youtubeService from '@/services/youtube';
import linkedinService from '@/services/linkedin';
import useTranslation from '@/hooks/useTranslation';
import useApiCall from '@/hooks/useApiCall';

// Import images for error states and default profile
import { errorService } from '@/lib/errorMessages';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import ApiErrorAlert from '@/components/ui/ApiErrorAlert';

import '@/styles/pages/ClaimDetails.css';

const ClaimDetails = () => {
  const { id } = useParams();
  const { t, language } = useTranslation();
  const [relatedClaims, setRelatedClaims] = useState([]);

  // Usar o hook useApiCall para gerenciar a chamada de API
  const {
    data: claim,
    loading,
    error,
    execute: fetchClaimDetails
  } = useApiCall(async () => {
    try {
      // Extrair plataforma e ID real do parâmetro
      // Formato esperado: platform_id (ex: instagram_12345)
      const [platform, realId] = id.split('_');

      if (!platform || !realId) {
        throw new Error(t('errors.invalidClaimId'));
      }

      // Buscar dados da fonte apropriada com base na plataforma
      let sourceData;
      switch (platform.toLowerCase()) {
        case 'instagram':
          sourceData = await instagramService.getClaimDetails(realId);
          break;
        case 'youtube':
          sourceData = await youtubeService.getClaimDetails(realId);
          break;
        case 'linkedin':
          sourceData = await linkedinService.getClaimDetails(realId);
          break;
        default:
          throw new Error(t('errors.unsupportedPlatform'));
      }

      // Buscar alegações relacionadas
      const related = await fetchRelatedClaims(sourceData.id, platform);
      setRelatedClaims(related);

      return sourceData;
    } catch (error) {
      console.error('Error in fetchClaimDetails:', error);
      errorService.reportError('claim_details_error', error, {
        component: 'ClaimDetails',
        claimId: id
      });
      throw error;
    }
  }, {
    immediate: true,
    platform: id?.split('_')[0],
    showErrorToast: true
  });

  // Função para buscar alegações relacionadas
  const fetchRelatedClaims = async (claimId, platform) => {
    try {
      let relatedClaimsData;
      switch (platform.toLowerCase()) {
        case 'instagram':
          relatedClaimsData = await instagramService.getRelatedClaims(claimId);
          break;
        case 'youtube':
          relatedClaimsData = await youtubeService.getRelatedClaims(claimId);
          break;
        case 'linkedin':
          relatedClaimsData = await linkedinService.getRelatedClaims(claimId);
          break;
        default:
          return [];
      }
      return relatedClaimsData;
    } catch (error) {
      console.error('Error fetching related claims:', error);
      return [];
    }
  };

  // Componente para o badge de status
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      verified: {
        icon: <CheckCircle className="status-icon" />,
        text: t('claims.status.verified'),
        className: "status-badge verified"
      },
      refuted: {
        icon: <XCircle className="status-icon" />,
        text: t('claims.status.refuted'),
        className: "status-badge refuted"
      },
      pending: {
        icon: <AlertTriangle className="status-icon" />,
        text: t('claims.status.pending'),
        className: "status-badge pending"
      }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <Badge className={config.className}>
        {config.icon}
        <span>{config.text}</span>
      </Badge>
    );
  };

  // Componente para o ícone da plataforma
  const PlatformIcon = ({ platform }) => {
    const platformClass = platform?.toLowerCase() || '';
    return <div className={`platform-icon ${platformClass}`}></div>;
  };

  // Função para formatar data
  const formatDate = (dateString) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Componente para exibir métricas de engajamento
  const EngagementMetrics = ({ metrics }) => {
    if (!metrics || Object.keys(metrics).length === 0) {
      return null;
    }

    return (
      <div className="engagement-metrics">
        <h3 className="section-title">{t('claims.sections.engagementMetrics')}</h3>
        <div className="metrics-grid">
          {metrics.views !== undefined && (
            <div className="metric-item">
              <span className="metric-label">{t('claims.metrics.views')}</span>
              <span className="metric-value">{metrics.views.toLocaleString()}</span>
            </div>
          )}
          {metrics.likes !== undefined && (
            <div className="metric-item">
              <span className="metric-label">{t('claims.metrics.likes')}</span>
              <span className="metric-value">{metrics.likes.toLocaleString()}</span>
            </div>
          )}
          {metrics.comments !== undefined && (
            <div className="metric-item">
              <span className="metric-label">{t('claims.metrics.comments')}</span>
              <span className="metric-value">{metrics.comments.toLocaleString()}</span>
            </div>
          )}
          {metrics.reactions !== undefined && (
            <div className="metric-item">
              <span className="metric-label">{t('claims.metrics.reactions')}</span>
              <span className="metric-value">{metrics.reactions.toLocaleString()}</span>
            </div>
          )}
          {metrics.shares !== undefined && (
            <div className="metric-item">
              <span className="metric-label">{t('claims.metrics.shares')}</span>
              <span className="metric-value">{metrics.shares.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Componente para exibir estudos relacionados
  const RelatedStudies = ({ studies }) => {
    if (!studies || studies.length === 0) {
      return (
        <div className="claim-section">
          <h3 className="section-title">{t('claims.sections.relatedStudies')}</h3>
          <div className="empty-state">{t('claims.sections.noStudies')}</div>
        </div>
      );
    }

    return (
      <div className="claim-section">
        <h3 className="section-title">{t('claims.sections.relatedStudies')}</h3>
        <ul className="studies-list">
          {studies.map((study, index) => (
            <li key={index} className="study-item">
              <a href={study.url} target="_blank" rel="noopener noreferrer" className="study-link">
                {study.title}
              </a>
              <p className="study-conclusion">{study.conclusion}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Componente para exibir alegações relacionadas
  const RelatedClaims = ({ claims }) => {
    if (!claims || claims.length === 0) {
      return null;
    }

    return (
      <div className="claim-section">
        <h3 className="section-title">{t('claims.sections.relatedClaims')}</h3>
        <ul className="related-claims-list">
          {claims.map((relatedClaim) => (
            <li key={relatedClaim.id} className="related-claim-item">
              <div className="related-claim-header">
                <h4 className="related-claim-title">{relatedClaim.title}</h4>
                <StatusBadge status={relatedClaim.status} />
              </div>
              <p className="related-claim-content">{relatedClaim.content}</p>
              <div className="related-claim-meta">
                {relatedClaim.source} • {formatDate(relatedClaim.date)}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t('claims.loading')}</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <ApiErrorAlert
          error={error}
          platform={id?.split('_')[0]}
          autoClose={false}
          className="error-alert"
        />
        <Alert variant="destructive">
          <AlertTitle>{t('claims.error.title')}</AlertTitle>
          <AlertDescription>{t('claims.error.generic')}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Not found state
  if (!claim) {
    return (
      <Alert variant="warning" className="not-found-alert">
        <AlertTitle>{t('claims.notFound.title')}</AlertTitle>
        <AlertDescription>{t('claims.notFound.message')}</AlertDescription>
      </Alert>
    );
  }

  // Main render
  return (
    <div className="claim-details">
      <Card className="claim-card">
        <CardHeader className="claim-header">
          <div className="claim-header-content">
            <div className="claim-header-title">
              <PlatformIcon platform={claim.platform} />
              <CardTitle className="claim-title">{claim.title}</CardTitle>
            </div>
            <StatusBadge status={claim.status} />
          </div>
          <p className="claim-metadata">
            {claim.source} • {formatDate(claim.date)}
          </p>
        </CardHeader>
        <CardContent>
          {/* Conteúdo Original */}
          <div className="claim-section">
            <h3 className="section-title">{t('claims.sections.originalContent')}</h3>
            <div className="original-content">
              <p className="section-content">{claim.content}</p>
            </div>
            {claim.sourceUrl && (
              <a
                href={claim.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="source-link"
              >
                {t('claims.sections.viewOriginal')}
              </a>
            )}
          </div>

          {/* Análise */}
          <div className="claim-section">
            <h3 className="section-title">{t('claims.sections.analysis')}</h3>
            <div className="analysis-content">
              <p className="section-content">{claim.analysis}</p>
              <div className="confidence-meter">
                <span className="confidence-label">
                  {t('claims.sections.confidenceLevel')}
                </span>
                <div className="confidence-bar">
                  <div
                    className="confidence-fill"
                    style={{ width: `${claim.confidence * 100}%` }}
                  ></div>
                </div>
                <span className="confidence-value">
                  {Math.round(claim.confidence * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Estudos Relacionados */}
          <RelatedStudies studies={claim.studies} />

          {/* Alegações Relacionadas */}
          <RelatedClaims claims={relatedClaims} />

          {/* Métricas de Engajamento */}
          <EngagementMetrics metrics={claim.engagementMetrics} />
        </CardContent>
      </Card>
    </div>
  );
};

// Componente com Error Boundary
const ClaimDetailsWithErrorBoundary = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  return (
    <ErrorBoundary
      componentName="ClaimDetails"
      fallback={({ error, reset }) => (
        <Card className="claim-card">
          <CardHeader>
            <CardTitle>
              {t('claims.error.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ApiErrorAlert
              error={error}
              platform={id?.split('_')?.[0]}
              autoClose={false}
              className="error-boundary-alert"
            />
            <p className="error-message">{t('claims.error.message')}</p>
            <div className="error-actions">
              <Button onClick={reset}>
                {t('claims.error.retry')}
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                {t('claims.error.reload')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    >
      <ClaimDetails />
    </ErrorBoundary>
  );
};

export default ClaimDetailsWithErrorBoundary;
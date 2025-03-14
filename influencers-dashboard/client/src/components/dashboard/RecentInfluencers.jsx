import React from 'react';
import { Link } from 'react-router-dom';
import { useInfluencer } from '@/contexts/InfluencerContext';
import useAsyncState from '@/hooks/useAsyncState';
import useTranslation from '@/hooks/useTranslation';
import { useToast } from '@/components/ui/Toast';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SearchBar } from '@/components/ui/SearchBar';
import '@/styles/components/dashboard/recent-influencers.css';

export const RecentInfluencers = React.forwardRef((props, ref) => {
  const { className = '', ...otherProps } = props;
  const { influencers } = useInfluencer();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');

  const { data: state, loading, error } = useAsyncState(
    async () => {
      try {
        return { influencers: influencers || [] };
      } catch (err) {
        toast({
          title: t('errors.title'),
          description: t('errors.loadRecentInfluencers'),
          variant: 'destructive'
        });
        throw err;
      }
    },
    { influencers: [] },
    [influencers]
  );

  // Filtra os influenciadores com base no termo de pesquisa
  const filteredInfluencers = React.useMemo(() => {
    return (state?.influencers || []).filter(inf =>
      inf.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inf.platform?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inf.categories && Array.isArray(inf.categories) && inf.categories.some(cat =>
        cat.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    );
  }, [state?.influencers, searchTerm]);

  const getTrustScoreClass = (score) => {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  if (error) {
    return (
      <Card className={`recent-influencers-card ${className}`} ref={ref} {...otherProps}>
        <div className="recent-influencers-error">
          <p>{t('errors.loadRecentInfluencers')}</p>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className={`recent-influencers-card ${className}`} ref={ref} {...otherProps}>
        <div className="recent-influencers-loading">
          <div className="loading-spinner"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`recent-influencers-card ${className}`} ref={ref} {...otherProps}>
      <div className="recent-influencers-header">
        <h2 className="recent-influencers-title">{t('dashboard.recentInfluencers')}</h2>

        {/* Barra de pesquisa usando o componente reutilizável */}
        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={t('search.byNamePlatformCategory')}
          className="recent-influencers-search"
        />
      </div>

      {/* Container com rolagem para a tabela */}
      <div className="table-container">
        <Table className="influencers-table">
          <TableHeader>
            <TableRow>
              <TableHead>{t('influencer.title')}</TableHead>
              <TableHead>{t('influencer.platform')}</TableHead>
              <TableHead>{t('influencer.followers')}</TableHead>
              <TableHead>{t('influencer.trustScore')}</TableHead>
              <TableHead>{t('influencer.categories')}</TableHead>
              <TableHead>{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInfluencers.length > 0 ? (
              filteredInfluencers.slice(0, 5).map((influencer) => (
                <TableRow key={influencer.id} className="influencer-row">
                  <TableCell>
                    <div className="influencer-info">
                      {influencer.profileUrl && (
                        <img
                          src={influencer.profileUrl}
                          alt={influencer.name}
                          className="influencer-avatar"
                        />
                      )}
                      <div className="influencer-details">
                        <div className="influencer-name">{influencer.name}</div>
                        <div className="influencer-handle">{influencer.handle}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`platform-badge ${influencer.platform?.toLowerCase()}`}>
                      {influencer.platform}
                    </div>
                  </TableCell>
                  <TableCell className="followers-count">
                    {new Intl.NumberFormat('pt-BR').format(influencer.followers)}
                  </TableCell>
                  <TableCell>
                    <div className={`trust-score ${getTrustScoreClass(influencer.trustScore)}`}>
                      {influencer.trustScore}%
                    </div>
                  </TableCell>
                  <TableCell className="cell-wrap">
                    <div className="categories-container">
                      {influencer.categories && influencer.categories.length > 0 ? (
                        influencer.categories.map((category, index) => (
                          <Badge key={index} variant="outline" className="category-badge">
                            {category}
                          </Badge>
                        ))
                      ) : (
                        <span className="no-categories">-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="actions-column">
                      <Link
                        to={`/influencers/${influencer.id}`}
                        className="action-button view"
                      >
                        {t('common.view')}
                      </Link>
                      <Link
                        to={`/influencers/edit/${influencer.id}`}
                        className="action-button edit"
                      >
                        {t('common.edit')}
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="empty-state">
                  {t('influencer.noInfluencersFound')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {filteredInfluencers.length > 5 && (
        <div className="view-all-container">
          <Link to="/influencers" className="view-all-link">
            {t('influencer.viewAll')}
          </Link>
        </div>
      )}
    </Card>
  );
});

RecentInfluencers.displayName = 'RecentInfluencers';

export default RecentInfluencers;

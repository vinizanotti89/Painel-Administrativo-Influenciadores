import React from 'react';
import useTranslation from '@/hooks/useTranslation';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Edit } from 'lucide-react';
import '@/styles/components/influencer/influencerTableRow.css';

const InfluencerTableRow = React.forwardRef(({ influencer = {}, className = '', ...props }, ref) => {
  const { t } = useTranslation();

  // Tratamento robusto para propriedades indefinidas
  const {
    id = `inf-${Math.random().toString(36).substring(2, 11)}`,
    name = '',
    username = '',
    fullName = name || '',
    category = '',
    platform = '',
    followers = 0,
    followersFormatted = '',
    trustScore = null,
    pontuacao = null,
    jaPostouFakeNews = false,
    hasFakeNews = jaPostouFakeNews
  } = influencer;

  // Formatação de valores
  const displayName = fullName || username || name || '';
  const displayFollowers = followersFormatted || (typeof followers === 'number'
    ? new Intl.NumberFormat(t('language') === 'en' ? 'en-US' : 'pt-BR').format(followers)
    : followers.toString());

  // Cálculo de pontuação
  const score = trustScore !== null ? trustScore : (pontuacao !== null ? pontuacao : 0);

  // Determinação da classe para pontuação
  const getScoreClass = (score) => {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  };

  return (
    <TableRow
      className={`influencer-table-row ${className}`}
      ref={ref}
      {...props}
    >
      <TableCell className="influencer-doctor-info">
        <div className="influencer-doctor-name">
          {displayName}
        </div>
      </TableCell>
      <TableCell className="influencer-category-cell">{category}</TableCell>
      <TableCell className="influencer-platform-cell">{platform}</TableCell>
      <TableCell className="influencer-followers-cell">{displayFollowers}</TableCell>
      <TableCell className="influencer-score-cell">
        <Badge
          variant="outline"
          className={`influencer-score-badge trust-score ${getScoreClass(score)}`}
        >
          {score}/100
        </Badge>
      </TableCell>
      <TableCell className="influencer-history-cell">
        <Badge
          variant="outline"
          className={`influencer-history-badge ${hasFakeNews ? 'has-fake-news' : 'no-fake-news'}`}
        >
          {hasFakeNews ? t('influencerList.fakeNewsDetected') : t('influencerList.noFakeNews')}
        </Badge>
      </TableCell>
      <TableCell className="influencer-actions-cell">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(`/influencer/${id}`, '_blank')}
          className="influencer-view-details-button"
        >
          <ExternalLink className="mr-1 h-4 w-4" />
          {t('influencerList.viewDetails')}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(`/influencer/${id}/edit`, '_blank')}
          className="influencer-edit-button"
        >
          <Edit className="mr-1 h-4 w-4" />
          {t('influencerList.edit')}
        </Button>
      </TableCell>
    </TableRow>
  );
});

InfluencerTableRow.displayName = 'InfluencerTableRow';

export { InfluencerTableRow };
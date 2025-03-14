import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import InfluencerTableRow from './InfluencerTableRow';
import '@/styles/components/influencer/influencerTable.css';

// Implementando o componente Skeleton diretamente já que não existe uma importação
const Skeleton = ({ className = '' }) => {
  return (
    <div className={`skeleton ${className}`} style={{
      backgroundColor: 'var(--hover-background)',
      borderRadius: '0.25rem',
      animation: 'pulse 1.5s ease-in-out infinite',
      opacity: 0.7
    }}></div>
  );
};

const InfluencerTable = React.forwardRef(({ influencers = [], isLoading = false, className = '', ...props }, ref) => {
  const { language } = useLanguage();
  const [asyncInfluencers, setAsyncInfluencers] = useState([]);
  const [loading, setLoading] = useState(isLoading);

  // Gerencia o estado assíncrono dos influenciadores
  useEffect(() => {
    setAsyncInfluencers(influencers);
    setLoading(isLoading);
  }, [influencers, isLoading]);

  const translations = {
    en: {
      doctor: 'Doctor',
      specialty: 'Specialty',
      platform: 'Platform',
      followers: 'Followers',
      score: 'Score',
      history: 'History',
      actions: 'Actions',
      noData: 'No influencers found. Try adjusting your search criteria.'
    },
    pt: {
      doctor: 'Médico',
      specialty: 'Especialidade',
      platform: 'Plataforma',
      followers: 'Seguidores',
      score: 'Pontuação',
      history: 'Histórico',
      actions: 'Ações',
      noData: 'Nenhum influenciador encontrado. Tente ajustar seus critérios de busca.'
    }
  };

  const t = translations[language] || translations.pt;

  // Renderiza um estado de carregamento quando os dados estiverem sendo buscados
  if (loading) {
    return (
      <div className="influencer-table-container" ref={ref} {...props}>
        <Table className={`influencer-table ${className}`}>
          <TableHeader>
            <TableRow>
              <TableHead>{t.doctor}</TableHead>
              <TableHead>{t.specialty}</TableHead>
              <TableHead>{t.platform}</TableHead>
              <TableHead>{t.followers}</TableHead>
              <TableHead>{t.score}</TableHead>
              <TableHead>{t.history}</TableHead>
              <TableHead>{t.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5).fill(0).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                {Array(7).fill(0).map((_, cellIndex) => (
                  <TableCell key={`cell-${index}-${cellIndex}`}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Renderiza uma mensagem quando não há dados
  if (!asyncInfluencers || asyncInfluencers.length === 0) {
    return (
      <div className="influencer-table-empty" ref={ref} {...props}>
        <p className="influencer-table-no-data">{t.noData}</p>
      </div>
    );
  }

  // Renderiza a tabela com os dados
  return (
    <div className="influencer-table-container" ref={ref} {...props}>
      <Table className={`influencer-table ${className}`}>
        <TableHeader>
          <TableRow>
            <TableHead>{t.doctor}</TableHead>
            <TableHead>{t.specialty}</TableHead>
            <TableHead>{t.platform}</TableHead>
            <TableHead>{t.followers}</TableHead>
            <TableHead>{t.score}</TableHead>
            <TableHead>{t.history}</TableHead>
            <TableHead>{t.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asyncInfluencers.map((influencer) => (
            <InfluencerTableRow
              key={influencer.id || `inf-${Math.random().toString(36).substring(2, 11)}`}
              influencer={influencer}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

InfluencerTable.displayName = 'InfluencerTable';

export { InfluencerTable };
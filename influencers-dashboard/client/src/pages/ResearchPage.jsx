import React from 'react';
import InfluencerSearch from '@/components/influencer/InfluencerSearch';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import useTranslation from '@/hooks/useTranslation';
import '@/styles/pages/ResearchPage.css';

/**
 * Componente para página de pesquisa de influenciadores
 * Implementação completa da página de pesquisa com tratamento adequado de erros
 */
const ResearchPage = () => {
    const { t } = useTranslation();

    return (
        <div className="research-container p-4 md:p-6">
            <h1 className="research-title text-2xl md:text-3xl font-bold mb-6">
                {t('research.title')}
            </h1>

            <Card className="research-card mb-6">
                <CardHeader>
                    <CardTitle>{t('research.searchTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <InfluencerSearch />
                </CardContent>
            </Card>
        </div>
    );
};

export default ResearchPage;
import React, { useState } from 'react';

// Serviços de API
import InstagramAuthTest from '@/components/instagram/InstagramAuthTest';
import LinkedInAuthTest from '@/components/linkedin/LinkedinAuthTest';
import YouTubeAuthTest from '@/components/youtube/YouTubeAuthTest';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import useTranslation from '@/hooks/useTranslation';

import '@/styles/pages/APITestPage.css';

const APITestPage = React.forwardRef(({ className = '', ...props }, ref) => {
    const [activeTab, setActiveTab] = useState('instagram');
    const { t } = useTranslation();

    return (
        <div className={`api-test-container ${className}`} ref={ref} {...props}>
            <h1 className="api-test-title">
                {t('apiTest.title')}
            </h1>

            <Card className="api-test-card">
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="api-test-tabs"
                >
                    <TabsList className="api-test-tabs-list">
                        <TabsTrigger value="instagram">{t('apiTest.tabs.instagram')}</TabsTrigger>
                        <TabsTrigger value="linkedin">{t('apiTest.tabs.linkedin')}</TabsTrigger>
                        <TabsTrigger value="youtube">{t('apiTest.tabs.youtube')}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="instagram">
                        <InstagramAuthTest />
                    </TabsContent>

                    <TabsContent value="linkedin">
                        <LinkedInAuthTest />
                    </TabsContent>

                    <TabsContent value="youtube">
                        <YouTubeAuthTest />
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
});

APITestPage.displayName = 'APITestPage';

export default APITestPage;

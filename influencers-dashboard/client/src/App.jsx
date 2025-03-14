import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Componentes de layout
import { Layout } from '@/components/layout/Layout';

// Páginas
import Dashboard from '@/pages/Dashboard';
import InfluencerDetails from '@/pages/InfluencerDetails';
import InfluencerList from '@/pages/InfluencerList';
import InfluencerSearchComponent from '@/pages/InfluencerSearchComponent';
import Analytics from '@/pages/Analytics';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import APITestPage from '@/pages/APITestPage';
import ClaimDetailsWithErrorBoundary from '@/pages/ClaimDetails';
import HealthClaims from '@/pages/HealthClaims';
import HealthClaimForm from '@/pages/HealthClaimForm';
import ResearchPage from '@/pages/ResearchPage';
import TrustLeaderboard from '@/pages/TrustLeaderboard';

// Componente de autenticação
import AuthCallback from '@/components/auth/AuthCallback';

function App() {
  return (
      <ThemeProvider>
        <LanguageProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="influencers" element={<InfluencerList />} />
                <Route path="influencer-details/:id" element={<InfluencerDetails />} />
                <Route path="research" element={<ResearchPage />} />
                <Route path="search-component" element={<InfluencerSearchComponent />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
                <Route path="api-test" element={<APITestPage />} />
                <Route path="claim-details/:id" element={<ClaimDetailsWithErrorBoundary />} />
                <Route path="health-claims/:id" element={<HealthClaims />} />
                <Route path="health-claim-form/:id?" element={<HealthClaimForm />} />
                <Route path="trust-leaderboard" element={<TrustLeaderboard />} />
              </Route>
              <Route path="/auth/callback" element={<AuthCallback />} />
            </Routes>
          </Router>
        </LanguageProvider>
      </ThemeProvider>
  );
}

export default App;
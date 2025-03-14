import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, BarChart2, RefreshCw, ExternalLink } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import RecentInfluencers from '@/components/dashboard/RecentInfluencers';
import { useInfluencer } from '@/contexts/InfluencerContext';
import { SearchBar } from '@/components/ui/SearchBar';
import ApiErrorAlert from '@/components/ui/ApiErrorAlert';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

// Serviços de API
import useTranslation from '@/hooks/useTranslation';
import useApiCall from '@/hooks/useApiCall';
import { adaptPlatformData } from '@/services/adapters';
import { influencersApi } from '@/services/api';

// Import images for error states and default profile
import errorImage from '@/assets/error_404.png';
import notFoundImage from '@/assets/not_found.png';
import defaultProfileImage from '@/assets/default_profile.png';

import '@/styles/pages/Dashboard.css';

const Dashboard = React.forwardRef(({ className = '', ...props }, ref) => {
  const { t } = useTranslation();
  const {
    influencers,
    updateFilters,
    loading: influencerLoading,
    error: influencerError
  } = useInfluencer();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Using useApiCall hook for dashboard data fetching
  const {
    execute: fetchDashboardStats,
    loading: statsLoading,
    error: statsError,
    data: dashboardData,
    clearError
  } = useApiCall(async () => {
    try {
      // Fetch influencers data from API
      const response = await influencersApi.getAll({
        limit: 10,
        sort: 'trustScore:desc'
      });

      if (!response?.data) {
        throw new Error(t('errors.noDataReturned'));
      }

      // Process and return the dashboard data
      return processDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }, {
    initialData: {
      influencers: [],
      statistics: {
        totalInfluencers: 0,
        averageFollowers: 0,
        averageTrustScore: 0
      },
      trends: {
        monthlyGrowth: 0,
        followerGrowth: 0,
        trustScoreGrowth: 0
      }
    },
    showErrorToast: true,
    errorMessage: 'errors.failedToLoadDashboard',
    platform: 'api'
  });

  // Process dashboard data
  const processDashboardData = (influencersData) => {
    if (!influencersData || influencersData.length === 0) {
      return {
        influencers: [],
        statistics: {
          totalInfluencers: 0,
          averageFollowers: 0,
          averageTrustScore: 0
        },
        trends: {
          monthlyGrowth: 0,
          followerGrowth: 0,
          trustScoreGrowth: 0
        }
      };
    }

    // Normalizar dados de influenciadores usando o adaptador
    const normalizedInfluencers = influencersData.map(influencer => {
      // Se o dado já tiver a plataforma definida, adaptar para formato padrão
      if (influencer.platform) {
        return adaptPlatformData(influencer, influencer.platform);
      }
      return influencer;
    });

    // Calculate statistics
    const totalInfluencers = normalizedInfluencers.length;
    const totalFollowers = normalizedInfluencers.reduce((sum, inf) => sum + (inf.followers || 0), 0);
    const totalTrustScore = normalizedInfluencers.reduce((sum, inf) => sum + (inf.trustScore || 0), 0);

    const averageFollowers = totalInfluencers > 0 ? Math.round(totalFollowers / totalInfluencers) : 0;
    const averageTrustScore = totalInfluencers > 0 ? Math.round(totalTrustScore / totalInfluencers) : 0;

    // Get trends from API response metadata if available
    let trends = {
      monthlyGrowth: 0,
      followerGrowth: 0,
      trustScoreGrowth: 0
    };

    if (influencersData.meta && influencersData.meta.trends) {
      trends.monthlyGrowth = influencersData.meta.trends.monthlyGrowth || trends.monthlyGrowth;
      trends.followerGrowth = influencersData.meta.trends.followerGrowth || trends.followerGrowth;
      trends.trustScoreGrowth = influencersData.meta.trends.trustScoreGrowth || trends.trustScoreGrowth;
    }

    return {
      // Order influencers by trustScore 
      influencers: normalizedInfluencers.sort((a, b) => b.trustScore - a.trustScore),
      statistics: {
        totalInfluencers,
        averageFollowers,
        averageTrustScore
      },
      trends
    };
  };

  // Function to handle search
  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      // Use the context to search for influencers
      updateFilters({ search: term, page: 1 });
    } catch (error) {
      console.error('Error searching influencers:', error);
    }
  };

  // Load dashboard data on component mount
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Update search results when influencers context changes
  useEffect(() => {
    if (searchTerm.trim() && influencers && influencers.length > 0) {
      setSearchResults(influencers);
    } else {
      setSearchResults([]);
    }
  }, [influencers, searchTerm]);

  // Prepare stats for StatsCard components
  const stats = [
    {
      title: t('dashboard.stats.totalInfluencers'),
      value: dashboardData.statistics.totalInfluencers.toString(),
      icon: Users,
      trend: dashboardData.trends.monthlyGrowth > 0 ? `+${dashboardData.trends.monthlyGrowth}%` : `${dashboardData.trends.monthlyGrowth}%`,
      description: t('dashboard.stats.comparedToLastMonth'),
      trendType: dashboardData.trends.monthlyGrowth >= 0 ? 'positive' : 'negative'
    },
    {
      title: t('dashboard.stats.averageFollowers'),
      value: dashboardData.statistics.averageFollowers.toLocaleString(),
      icon: BarChart2,
      trend: dashboardData.trends.followerGrowth > 0 ? `+${dashboardData.trends.followerGrowth}%` : `${dashboardData.trends.followerGrowth}%`,
      description: t('dashboard.stats.perInfluencer'),
      trendType: dashboardData.trends.followerGrowth >= 0 ? 'positive' : 'negative'
    },
    {
      title: t('dashboard.stats.averageTrustScore'),
      value: `${dashboardData.statistics.averageTrustScore}%`,
      icon: TrendingUp,
      trend: dashboardData.trends.trustScoreGrowth > 0 ? `+${dashboardData.trends.trustScoreGrowth}%` : `${dashboardData.trends.trustScoreGrowth}%`,
      description: t('dashboard.stats.last30Days'),
      trendType: dashboardData.trends.trustScoreGrowth >= 0 ? 'positive' : 'negative'
    }
  ];

  // If API returns error
  if (statsError) {
    return (
      <div className="dashboard-container error-view">
        <div className="error-container">
          <img src={errorImage} alt="Error" className="error-image" />
          <h2 className="error-title">{t('dashboard.errorTitle')}</h2>
          <p className="error-message">
            {statsError.message || t('errors.failedToLoadDashboard')}
          </p>
          <button
            className="retry-button"
            onClick={() => {
              clearError();
              fetchDashboardStats();
            }}
          >
            <RefreshCw size={16} />
            {t('dashboard.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="dashboard-container error-view">
          <div className="error-container">
            <img src={errorImage} alt="Error" className="error-image" />
            <h2 className="error-title">{t('common.unexpectedError')}</h2>
            <p className="error-message">{t('errors.dashboardRenderError')}</p>
            <button
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={16} />
              {t('common.reload')}
            </button>
          </div>
        </div>
      }
    >
      <div className={`dashboard-container ${className}`} ref={ref} {...props}>
        {/* Dashboard header with search bar */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">{t('dashboard.title')}</h1>
          <SearchBar
            onSearch={handleSearch}
            placeholder={t('dashboard.searchPlaceholder')}
            compact={true}
            maxWidth="250px"
            realtime={false}
          />
        </div>

        {/* Stats cards grid */}
        <div className="stats-grid">
          {statsLoading ? (
            [...Array(3)].map((_, index) => (
              <div key={index} className="stat-card skeleton-card">
                <div className="skeleton-header"></div>
                <div className="skeleton-value"></div>
                <div className="skeleton-desc"></div>
              </div>
            ))
          ) : (
            stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))
          )}
        </div>

        {/* Show error alert if there's an API error but not fatal */}
        {influencerError && (
          <ApiErrorAlert
            error={influencerError}
            platform="api"
            className="mb-6"
          />
        )}

        {/* Recent influencers section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">{t('dashboard.recentInfluencers')}</h2>
            <SearchBar
              onSearch={handleSearch}
              placeholder={t('dashboard.filterInfluencers')}
              maxWidth="300px"
              realtime={true}
              debounceTime={300}
            />
          </div>

          <RecentInfluencers
            influencers={searchResults.length > 0 ? searchResults : dashboardData.influencers}
            loading={statsLoading || influencerLoading}
            emptyStateMessage={t('dashboard.noInfluencersFound')}
            viewAllText={t('dashboard.viewAll')}
            viewAllUrl="/influencers"
            defaultProfileImage={defaultProfileImage}
            notFoundImage={notFoundImage}
          />

          {/* View all link for mobile */}
          <div className="view-all-mobile">
            <a href="/influencers" className="view-all-link">
              {t('dashboard.viewAll')}
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
const translations = {
  // Menu items
  menuItems: {
    pt: [
      { name: 'Dashboard', path: '/' },
      { name: 'Influenciadores', path: '/influencers' },
      { name: 'Alegações', path: '/claims' },
      { name: 'Analytics', path: '/analytics' },
      { name: 'Relatórios', path: '/reports' },
      { name: 'Configurações', path: '/settings' },
      { name: 'Pesquisa', path: '/research' },
      { name: 'Ranking de Confiança', path: '/leaderboard' },
    ],
    en: [
      { name: 'Dashboard', path: '/' },
      { name: 'Influencers', path: '/influencers' },
      { name: 'Claims', path: '/claims' },
      { name: 'Analytics', path: '/analytics' },
      { name: 'Reports', path: '/reports' },
      { name: 'Settings', path: '/settings' },
      { name: 'Research', path: '/research' },
      { name: 'Trust Leaderboard', path: '/leaderboard' },
    ]
  },

  // Header
  header: {
    title: {
      pt: 'Dashboard de Influenciadores',
      en: 'Influencers Dashboard'
    },
    theme: {
      darkLabel: {
        pt: 'Tema Escuro',
        en: 'Dark Theme'
      },
      lightLabel: {
        pt: 'Tema Claro',
        en: 'Light Theme'
      }
    }
  },

  // Common UI elements
  ui: {
    search: {
      placeholder: {
        pt: 'Pesquisar...',
        en: 'Search...'
      }
    },
    notifications: {
      pt: 'Notificações',
      en: 'Notifications'
    }
  }
};

// Traduções para o Trust Leaderboard
const leaderboardTranslations = {
  leaderboard: {
    title: {
      pt: 'Trust Leaderboard',
      en: 'Trust Leaderboard'
    },
    description: {
      pt: 'Ranking baseado em precisão científica, credibilidade e transparência',
      en: 'Ranking based on scientific accuracy, credibility and transparency'
    },
    loading: {
      pt: 'Carregando dados do leaderboard...',
      en: 'Loading leaderboard data...'
    },
    error: {
      pt: 'Erro ao carregar dados',
      en: 'Error loading data'
    },
    metrics: {
      activeInfluencers: {
        pt: 'Influenciadores Ativos',
        en: 'Active Influencers'
      },
      verifiedClaims: {
        pt: 'Alegações Verificadas',
        en: 'Verified Claims'
      },
      averageTrustScore: {
        pt: 'Trust Score Médio',
        en: 'Average Trust Score'
      }
    },
    table: {
      rank: {
        pt: 'Rank',
        en: 'Rank'
      },
      influencer: {
        pt: 'Influenciador',
        en: 'Influencer'
      },
      category: {
        pt: 'Categoria',
        en: 'Category'
      },
      trustScore: {
        pt: 'Trust Score',
        en: 'Trust Score'
      },
      trend: {
        pt: 'Tendência',
        en: 'Trend'
      },
      followers: {
        pt: 'Seguidores',
        en: 'Followers'
      },
      verifiedClaims: {
        pt: 'Alegações Verificadas',
        en: 'Verified Claims'
      }
    },
    trend: {
      up: {
        pt: 'Em alta',
        en: 'Trending up'
      },
      down: {
        pt: 'Em queda',
        en: 'Trending down'
      }
    }
  },
  categories: {
    health: {
      pt: 'Saúde',
      en: 'Health'
    },
    fitness: {
      pt: 'Fitness',
      en: 'Fitness'
    },
    nutrition: {
      pt: 'Nutrição',
      en: 'Nutrition'
    },
    beauty: {
      pt: 'Beleza',
      en: 'Beauty'
    },
    science: {
      pt: 'Ciência',
      en: 'Science'
    },
    technology: {
      pt: 'Tecnologia',
      en: 'Technology'
    },
    education: {
      pt: 'Educação',
      en: 'Education'
    },
    professional: {
      pt: 'Profissional',
      en: 'Professional'
    },
    general: {
      pt: 'Geral',
      en: 'General'
    }
  },
  general: {
    youtubeChannel: {
      pt: 'Canal do YouTube',
      en: 'YouTube Channel'
    }
  }
};

// Traduções para a página Analytics

const analyticsTranslations = {
  analytics: {
    title: {
      pt: 'Análise de Dados',
      en: 'Data Analysis'
    },
    timeRanges: {
      week: {
        pt: 'Última Semana',
        en: 'Last Week'
      },
      month: {
        pt: 'Último Mês',
        en: 'Last Month'
      },
      year: {
        pt: 'Último Ano',
        en: 'Last Year'
      },
      selectLabel: {
        pt: 'Selecione o período',
        en: 'Select time period'
      }
    },
    stats: {
      totalClaims: {
        pt: 'Total de Alegações',
        en: 'Total Claims'
      },
      verificationRate: {
        pt: 'Taxa de Verificação',
        en: 'Verification Rate'
      },
      activeInfluencers: {
        pt: 'Influenciadores Ativos',
        en: 'Active Influencers'
      },
      averageScore: {
        pt: 'Score Médio de Confiança',
        en: 'Average Trust Score'
      }
    },
    charts: {
      claimsTrend: {
        pt: 'Tendência de Alegações',
        en: 'Claims Trend'
      },
      categoryDistribution: {
        pt: 'Distribuição por Categoria',
        en: 'Category Distribution'
      },
      verified: {
        pt: 'Verificadas',
        en: 'Verified'
      },
      total: {
        pt: 'Total',
        en: 'Total'
      },
      mentions: {
        pt: 'menções',
        en: 'mentions'
      },
      amount: {
        pt: 'Quantidade',
        en: 'Amount'
      }
    },
    categories: {
      health: {
        pt: 'Saúde',
        en: 'Health'
      },
      fitness: {
        pt: 'Fitness',
        en: 'Fitness'
      },
      nutrition: {
        pt: 'Nutrição',
        en: 'Nutrition'
      },
      food: {
        pt: 'Alimentação',
        en: 'Food'
      },
      beauty: {
        pt: 'Beleza',
        en: 'Beauty'
      },
      fashion: {
        pt: 'Moda',
        en: 'Fashion'
      },
      technology: {
        pt: 'Tecnologia',
        en: 'Technology'
      },
      science: {
        pt: 'Ciência',
        en: 'Science'
      },
      business: {
        pt: 'Negócios',
        en: 'Business'
      },
      entrepreneurship: {
        pt: 'Empreendedorismo',
        en: 'Entrepreneurship'
      },
      career: {
        pt: 'Carreira',
        en: 'Career'
      },
      entertainment: {
        pt: 'Entretenimento',
        en: 'Entertainment'
      },
      games: {
        pt: 'Games',
        en: 'Games'
      },
      movies: {
        pt: 'Filmes',
        en: 'Movies'
      },
      music: {
        pt: 'Música',
        en: 'Music'
      }
    },
    loading: {
      pt: 'Carregando dados analíticos...',
      en: 'Loading analytics data...'
    },
    error: {
      pt: 'Falha ao carregar os dados analíticos. Por favor, tente novamente.',
      en: 'Failed to load analytics data. Please try again.'
    }
  }
};


// APITestPage translations
const apiTestTranslations = {
  apiTest: {
    title: {
      pt: 'Teste de Integração das APIs',
      en: 'API Integration Test'
    },
    tabs: {
      instagram: {
        pt: 'Instagram',
        en: 'Instagram'
      },
      linkedin: {
        pt: 'LinkedIn',
        en: 'LinkedIn'
      },
      youtube: {
        pt: 'YouTube',
        en: 'YouTube'
      }
    },
    description: {
      pt: 'Esta página permite testar as conexões com as diferentes APIs de redes sociais utilizadas pelo sistema.',
      en: 'This page allows you to test connections with the different social media APIs used by the system.'
    }
  }
};

// ClaimDetailsPage translations

const claimDetailsTranslations = {
  claims: {
    details: {
      title: {
        pt: 'Detalhes da Alegação',
        en: 'Claim Details'
      },
      loading: {
        pt: 'Carregando detalhes da alegação...',
        en: 'Loading claim details...'
      },
      error: {
        pt: 'Erro ao buscar detalhes da alegação',
        en: 'Error fetching claim details'
      },
      notFound: {
        pt: 'Alegação não encontrada',
        en: 'Claim not found'
      },
      originalContent: {
        pt: 'Conteúdo Original',
        en: 'Original Content'
      },
      viewOriginal: {
        pt: 'Ver publicação original',
        en: 'View original post'
      },
      analysis: {
        pt: 'Análise',
        en: 'Analysis'
      },
      confidenceLevel: {
        pt: 'Nível de confiança:',
        en: 'Confidence level:'
      },
      relatedStudies: {
        pt: 'Estudos Relacionados',
        en: 'Related Studies'
      },
      noStudies: {
        pt: 'Nenhum estudo relacionado encontrado.',
        en: 'No related studies found.'
      },
      relatedClaims: {
        pt: 'Alegações Relacionadas',
        en: 'Related Claims'
      },
      engagementMetrics: {
        pt: 'Métricas de Engajamento',
        en: 'Engagement Metrics'
      }
    },
    status: {
      verified: {
        pt: 'Verificado',
        en: 'Verified'
      },
      refuted: {
        pt: 'Refutado',
        en: 'Refuted'
      },
      pending: {
        pt: 'Pendente',
        en: 'Pending'
      }
    },
    metrics: {
      likes: {
        pt: 'Likes:',
        en: 'Likes:'
      },
      comments: {
        pt: 'Comentários:',
        en: 'Comments:'
      },
      views: {
        pt: 'Visualizações:',
        en: 'Views:'
      },
      reactions: {
        pt: 'Reações:',
        en: 'Reactions:'
      },
      shares: {
        pt: 'Compartilhamentos:',
        en: 'Shares:'
      }
    },
    platforms: {
      instagram: {
        pt: 'Instagram',
        en: 'Instagram'
      },
      youtube: {
        pt: 'YouTube',
        en: 'YouTube'
      },
      linkedin: {
        pt: 'LinkedIn',
        en: 'LinkedIn'
      }
    }
  }
};


// Dashboard translations
const dashboardTranslations = {
  dashboard: {
    title: {
      pt: 'Dashboard',
      en: 'Dashboard'
    },
    loading: {
      pt: 'Carregando dados do dashboard...',
      en: 'Loading dashboard data...'
    },
    errorTitle: {
      pt: 'Erro ao carregar os dados',
      en: 'Error loading data'
    },
    error: {
      pt: 'Ocorreu um erro ao buscar os dados do dashboard.',
      en: 'An error occurred while fetching dashboard data.'
    },
    retry: {
      pt: 'Tentar novamente',
      en: 'Try again'
    },
    stats: {
      totalInfluencers: {
        pt: 'Total de Influenciadores',
        en: 'Total Influencers'
      },
      averageFollowers: {
        pt: 'Média de Seguidores',
        en: 'Average Followers'
      },
      averageTrustScore: {
        pt: 'Trust Score Médio',
        en: 'Average Trust Score'
      },
      comparedToLastMonth: {
        pt: 'comparado ao mês anterior',
        en: 'compared to last month'
      },
      perInfluencer: {
        pt: 'por influenciador',
        en: 'per influencer'
      },
      last30Days: {
        pt: 'últimos 30 dias',
        en: 'last 30 days'
      }
    },
    recentInfluencers: {
      pt: 'Influenciadores Recentes',
      en: 'Recent Influencers'
    },
    viewAll: {
      pt: 'Ver todos',
      en: 'View all'
    },
    table: {
      influencer: {
        pt: 'Influenciador',
        en: 'Influencer'
      },
      followers: {
        pt: 'Seguidores',
        en: 'Followers'
      },
      categories: {
        pt: 'Categorias',
        en: 'Categories'
      },
      trustScore: {
        pt: 'Trust Score',
        en: 'Trust Score'
      },
      status: {
        pt: 'Status',
        en: 'Status'
      },
      actions: {
        pt: 'Ações',
        en: 'Actions'
      }
    },
    actions: {
      view: {
        pt: 'Visualizar',
        en: 'View'
      },
      analyze: {
        pt: 'Analisar',
        en: 'Analyze'
      },
      report: {
        pt: 'Relatório',
        en: 'Report'
      }
    },
    status: {
      active: {
        pt: 'Ativo',
        en: 'Active'
      },
      inactive: {
        pt: 'Inativo',
        en: 'Inactive'
      },
      pending: {
        pt: 'Pendente',
        en: 'Pending'
      }
    }
  },

  // Traduções complementares para categorias (já existentes no arquivo original, mas incluídas aqui por referência)
  categories: {
    health: {
      pt: 'Saúde',
      en: 'Health'
    },
    fitness: {
      pt: 'Fitness',
      en: 'Fitness'
    },
    nutrition: {
      pt: 'Nutrição',
      en: 'Nutrition'
    },
    beauty: {
      pt: 'Beleza',
      en: 'Beauty'
    },
    lifestyle: {
      pt: 'Lifestyle',
      en: 'Lifestyle'
    },
    fashion: {
      pt: 'Moda',
      en: 'Fashion'
    },
    sports: {
      pt: 'Esportes',
      en: 'Sports'
    },
    food: {
      pt: 'Alimentação',
      en: 'Food'
    },
    travel: {
      pt: 'Viagem',
      en: 'Travel'
    },
    technology: {
      pt: 'Tecnologia',
      en: 'Technology'
    },
    games: {
      pt: 'Games',
      en: 'Games'
    },
    movies: {
      pt: 'Filmes',
      en: 'Movies'
    },
    music: {
      pt: 'Música',
      en: 'Music'
    },
    education: {
      pt: 'Educação',
      en: 'Education'
    },
    professional: {
      pt: 'Profissional',
      en: 'Professional'
    },
    marketing: {
      pt: 'Marketing',
      en: 'Marketing'
    },
    sales: {
      pt: 'Vendas',
      en: 'Sales'
    },
    finance: {
      pt: 'Finanças',
      en: 'Finance'
    },
    management: {
      pt: 'Gestão',
      en: 'Management'
    },
    leadership: {
      pt: 'Liderança',
      en: 'Leadership'
    },
    hr: {
      pt: 'RH',
      en: 'HR'
    },
    consulting: {
      pt: 'Consultoria',
      en: 'Consulting'
    },
    career: {
      pt: 'Carreira',
      en: 'Career'
    },
    general: {
      pt: 'Geral',
      en: 'General'
    }
  }
};


// HealthClaimForm translations
const healthClaimsFormTranslations = {
  healthClaims: {
    form: {
      title: {
        pt: 'Formulário de Alegação de Saúde',
        en: 'Health Claim Form'
      },
      fields: {
        influencerId: {
          pt: 'ID do Influenciador',
          en: 'Influencer ID'
        },
        platform: {
          pt: 'Plataforma',
          en: 'Platform'
        },
        contentType: {
          pt: 'Tipo de Conteúdo',
          en: 'Content Type'
        },
        contentUrl: {
          pt: 'URL do Conteúdo',
          en: 'Content URL'
        },
        claimText: {
          pt: 'Texto da Alegação',
          en: 'Claim Text'
        },
        category: {
          pt: 'Categoria',
          en: 'Category'
        },
        verificationStatus: {
          pt: 'Status de Verificação',
          en: 'Verification Status'
        },
        factCheck: {
          pt: 'Verificação de Fatos',
          en: 'Fact Check'
        },
        explanation: {
          pt: 'Explicação',
          en: 'Explanation'
        },
        evidenceLinks: {
          pt: 'Links de Evidência',
          en: 'Evidence Links'
        },
        sourceDate: {
          pt: 'Data da Fonte',
          en: 'Source Date'
        }
      },
      placeholders: {
        influencerId: {
          pt: 'Digite o ID do influenciador',
          en: 'Enter the influencer ID'
        },
        platform: {
          pt: 'Selecione a plataforma',
          en: 'Select platform'
        },
        contentType: {
          pt: 'Selecione o tipo de conteúdo',
          en: 'Select content type'
        },
        contentUrl: {
          pt: 'URL do conteúdo (ex: https://instagram.com/p/123456)',
          en: 'Content URL (e.g., https://instagram.com/p/123456)'
        },
        claimText: {
          pt: 'Digite o texto exato da alegação a ser verificada',
          en: 'Enter the exact claim text to be verified'
        },
        category: {
          pt: 'Selecione a categoria',
          en: 'Select category'
        },
        verificationStatus: {
          pt: 'Selecione o status de verificação',
          en: 'Select verification status'
        },
        factCheck: {
          pt: 'Resumo da verificação (1-2 frases)',
          en: 'Fact check summary (1-2 sentences)'
        },
        explanation: {
          pt: 'Forneça uma explicação detalhada da verificação',
          en: 'Provide a detailed explanation of the verification'
        },
        evidenceLink: {
          pt: 'URL da fonte (ex: https://pubmed.ncbi.nlm.nih.gov/...)',
          en: 'Source URL (e.g., https://pubmed.ncbi.nlm.nih.gov/...)'
        }
      },
      contentTypes: {
        post: {
          pt: 'Post',
          en: 'Post'
        },
        video: {
          pt: 'Vídeo',
          en: 'Video'
        },
        story: {
          pt: 'Story',
          en: 'Story'
        },
        reel: {
          pt: 'Reels',
          en: 'Reels'
        },
        article: {
          pt: 'Artigo',
          en: 'Article'
        }
      },
      categories: {
        nutrition: {
          pt: 'Nutrição',
          en: 'Nutrition'
        },
        fitness: {
          pt: 'Fitness',
          en: 'Fitness'
        },
        medical: {
          pt: 'Médico',
          en: 'Medical'
        },
        supplement: {
          pt: 'Suplementos',
          en: 'Supplement'
        },
        mentalHealth: {
          pt: 'Saúde Mental',
          en: 'Mental Health'
        },
        skincare: {
          pt: 'Cuidados com a Pele',
          en: 'Skincare'
        },
        weightLoss: {
          pt: 'Perda de Peso',
          en: 'Weight Loss'
        },
        other: {
          pt: 'Outro',
          en: 'Other'
        }
      },
      verificationStatuses: {
        unverified: {
          pt: 'Não Verificado',
          en: 'Unverified'
        },
        verifiedTrue: {
          pt: 'Verificado - Verdadeiro',
          en: 'Verified - True'
        },
        verifiedFalse: {
          pt: 'Verificado - Falso',
          en: 'Verified - False'
        },
        verifiedPartially: {
          pt: 'Verificado - Parcialmente Verdadeiro',
          en: 'Verified - Partially True'
        },
        verifiedMisleading: {
          pt: 'Verificado - Enganoso',
          en: 'Verified - Misleading'
        },
        verifiedInconclusive: {
          pt: 'Verificado - Inconclusivo',
          en: 'Verified - Inconclusive'
        }
      },
      buttons: {
        submit: {
          pt: 'Enviar Alegação',
          en: 'Submit Claim'
        },
        addEvidence: {
          pt: 'Adicionar Evidência',
          en: 'Add Evidence'
        }
      },
      errors: {
        influencerIdRequired: {
          pt: 'ID do influenciador é obrigatório',
          en: 'Influencer ID is required'
        },
        platformRequired: {
          pt: 'Plataforma é obrigatória',
          en: 'Platform is required'
        },
        contentUrlRequired: {
          pt: 'URL do conteúdo é obrigatório',
          en: 'Content URL is required'
        },
        claimTextRequired: {
          pt: 'Texto da alegação é obrigatório',
          en: 'Claim text is required'
        },
        categoryRequired: {
          pt: 'Categoria é obrigatória',
          en: 'Category is required'
        },
        verificationStatusRequired: {
          pt: 'Status de verificação é obrigatório',
          en: 'Verification status is required'
        },
        contentValidationFailed: {
          pt: 'Falha na validação do conteúdo. Verifique a URL e tente novamente.',
          en: 'Content validation failed. Please check the URL and try again.'
        },
        submissionError: {
          pt: 'Erro ao enviar a alegação',
          en: 'Error submitting claim'
        },
        influencerDataError: {
          pt: 'Erro ao buscar dados do influenciador',
          en: 'Error fetching influencer data'
        }
      }
    }
  },
  general: {
    loading: {
      pt: 'Carregando...',
      en: 'Loading...'
    },
    submitting: {
      pt: 'Enviando...',
      en: 'Submitting...'
    },
    cancel: {
      pt: 'Cancelar',
      en: 'Cancel'
    },
    remove: {
      pt: 'Remover',
      en: 'Remove'
    },
    unknownError: {
      pt: 'Erro desconhecido',
      en: 'Unknown error'
    }
  }
};

// HealthClaims translations
const healthClaimsTranslations = {
  healthClaims: {
    title: {
      pt: 'Análise de Alegações de Saúde',
      en: 'Health Claims Analysis'
    },
    loading: {
      pt: 'Carregando análise de alegações...',
      en: 'Loading claims analysis...'
    },
    error: {
      pt: 'Ocorreu um erro:',
      en: 'An error occurred:'
    },
    notFound: {
      pt: 'Influenciador não encontrado',
      en: 'Influencer not found'
    },
    back: {
      pt: 'Voltar',
      en: 'Back'
    },
    stats: {
      title: {
        pt: 'Estatísticas de Conteúdo',
        en: 'Content Statistics'
      },
      totalContent: {
        pt: 'Total de Conteúdo Analisado',
        en: 'Total Content Analyzed'
      },
      healthContent: {
        pt: 'Conteúdo Sobre Saúde',
        en: 'Health-Related Content'
      },
      verifiedClaims: {
        pt: 'Alegações Verificadas',
        en: 'Verified Claims'
      },
      partiallyClaims: {
        pt: 'Parcialmente Verdadeiras',
        en: 'Partially True'
      },
      misleadingClaims: {
        pt: 'Enganosas ou Incorretas',
        en: 'Misleading or Incorrect'
      }
    },
    filter: {
      placeholder: {
        pt: 'Filtrar por status',
        en: 'Filter by status'
      },
      allClaims: {
        pt: 'Todas alegações',
        en: 'All claims'
      },
      verified: {
        pt: 'Verificadas',
        en: 'Verified'
      },
      partially: {
        pt: 'Parcialmente verdadeiras',
        en: 'Partially true'
      },
      misleading: {
        pt: 'Enganosas',
        en: 'Misleading'
      },
      incorrect: {
        pt: 'Incorretas',
        en: 'Incorrect'
      }
    },
    claim: {
      title: {
        pt: 'Alegação',
        en: 'Claim'
      },
      source: {
        pt: 'Fonte:',
        en: 'Source:'
      },
      analysis: {
        pt: 'Análise de Verificação',
        en: 'Verification Analysis'
      },
      studies: {
        pt: 'Estudos Científicos Relacionados',
        en: 'Related Scientific Studies'
      },
      conclusion: {
        pt: 'Conclusão:',
        en: 'Conclusion:'
      },
      noClaims: {
        pt: 'Nenhuma alegação de saúde',
        en: 'No health claims'
      },
      withStatus: {
        pt: 'com status',
        en: 'with status'
      },
      found: {
        pt: 'encontrada para este influenciador.',
        en: 'found for this influencer.'
      }
    },
    verification: {
      verified: {
        pt: 'Verificado',
        en: 'Verified'
      },
      partially: {
        pt: 'Parcialmente Verdadeiro',
        en: 'Partially True'
      },
      misleading: {
        pt: 'Enganoso',
        en: 'Misleading'
      },
      incorrect: {
        pt: 'Falso',
        en: 'False'
      },
      unverified: {
        pt: 'Não Verificado',
        en: 'Unverified'
      }
    }
  }
};

// InfluencerDetails translations
const influencerDetailsTranslations = {
  influencerDetails: {
    loading: {
      pt: 'Carregando dados do influenciador...',
      en: 'Loading influencer data...'
    },
    error: {
      pt: 'Ocorreu um erro ao carregar os dados.',
      en: 'An error occurred while loading the data.'
    },
    errorPrefix: {
      pt: 'Erro:',
      en: 'Error:'
    },
    notFound: {
      pt: 'Influenciador não encontrado',
      en: 'Influencer not found'
    },
    errorLog: {
      pt: 'Erro ao buscar dados do influenciador:',
      en: 'Error fetching influencer data:'
    },
    platformError: {
      pt: 'Erro ao identificar plataforma:',
      en: 'Error identifying platform:'
    },
    instagramError: {
      pt: 'Erro ao buscar dados do Instagram:',
      en: 'Error fetching Instagram data:'
    },
    youtubeError: {
      pt: 'Erro ao buscar dados do YouTube:',
      en: 'Error fetching YouTube data:'
    },
    linkedinError: {
      pt: 'Erro ao buscar dados do LinkedIn:',
      en: 'Error fetching LinkedIn data:'
    },
    processingError: {
      pt: 'Erro ao processar dados para',
      en: 'Error processing data for'
    },
    trustScoreError: {
      pt: 'Erro ao calcular Trust Score para',
      en: 'Error calculating Trust Score for'
    },
    engagementError: {
      pt: 'Erro ao calcular taxa de engagement:',
      en: 'Error calculating engagement rate:'
    },
    contentQualityError: {
      pt: 'Erro ao analisar qualidade de conteúdo:',
      en: 'Error analyzing content quality:'
    },
    consistencyError: {
      pt: 'Erro ao calcular consistência:',
      en: 'Error calculating consistency:'
    },
    captionQualityError: {
      pt: 'Erro ao avaliar qualidade de legendas:',
      en: 'Error evaluating caption quality:'
    },
    viewProfile: {
      pt: 'Ver perfil',
      en: 'View profile'
    },
    trustScore: {
      pt: 'Trust Score',
      en: 'Trust Score'
    },
    followers: {
      pt: 'Seguidores',
      en: 'Followers'
    },
    engagement: {
      pt: 'Engagement',
      en: 'Engagement'
    },
    trustScoreDescription: {
      pt: 'Baseado em consistência de conteúdo e engajamento da audiência',
      en: 'Based on content consistency and audience engagement'
    },
    followersDescription: {
      pt: 'Número total de seguidores na plataforma',
      en: 'Total number of followers on the platform'
    },
    engagementDescription: {
      pt: 'Taxa média de interação por publicação',
      en: 'Average interaction rate per post'
    },
    platformDetails: {
      pt: 'Detalhes da plataforma: {platform}',
      en: 'Platform details: {platform}'
    },
    posts: {
      pt: 'Publicações',
      en: 'Posts'
    },
    averageEngagement: {
      pt: 'Engagement médio',
      en: 'Average engagement'
    },
    totalViews: {
      pt: 'Total de visualizações',
      en: 'Total views'
    },
    videos: {
      pt: 'Vídeos',
      en: 'Videos'
    },
    connections: {
      pt: 'Conexões',
      en: 'Connections'
    },
    tabs: {
      overview: {
        pt: 'Visão Geral',
        en: 'Overview'
      },
      content: {
        pt: 'Conteúdo',
        en: 'Content'
      },
      metrics: {
        pt: 'Métricas',
        en: 'Metrics'
      },
      campaigns: {
        pt: 'Campanhas',
        en: 'Campaigns'
      }
    },
    overview: {
      trustAnalysis: {
        pt: 'Análise de Confiança',
        en: 'Trust Analysis'
      },
      trustHigh: {
        pt: 'Este influenciador demonstra alto nível de confiança com base em seu consistente engajamento e qualidade de conteúdo. Recomendado para parcerias e campanhas.',
        en: 'This influencer demonstrates a high level of trust based on their consistent engagement and content quality. Recommended for partnerships and campaigns.'
      },
      trustMedium: {
        pt: 'Este influenciador apresenta um nível médio de confiança. Seu conteúdo e engajamento são consistentes, mas há espaço para melhorias.',
        en: 'This influencer shows a medium level of trust. Their content and engagement are consistent, but there is room for improvement.'
      },
      trustLow: {
        pt: 'Este influenciador apresenta um nível baixo de confiança. Recomenda-se avaliar seu histórico e consistência antes de estabelecer parcerias.',
        en: 'This influencer shows a low level of trust. It is recommended to evaluate their history and consistency before establishing partnerships.'
      },
      audience: {
        pt: 'Audiência',
        en: 'Audience'
      },
      audienceDescription: {
        pt: 'O influenciador alcança {followers} seguidores em sua plataforma principal. A audiência mostra um bom nível de interação com o conteúdo publicado.',
        en: 'The influencer reaches {followers} followers on their main platform. The audience shows a good level of interaction with the published content.'
      },
      content: {
        pt: 'Conteúdo',
        en: 'Content'
      },
      contentDescription: {
        pt: 'O influenciador cria conteúdo para o {platform} com uma taxa de engajamento média de {engagement}%. Seu conteúdo é consistente e mantém a audiência engajada.',
        en: 'The influencer creates content for {platform} with an average engagement rate of {engagement}%. Their content is consistent and keeps the audience engaged.'
      }
    },
    content: {
      likes: {
        pt: 'curtidas',
        en: 'likes'
      },
      comments: {
        pt: 'comentários',
        en: 'comments'
      },
      shares: {
        pt: 'compartilhamentos',
        en: 'shares'
      },
      views: {
        pt: 'visualizações',
        en: 'views'
      },
      watchVideo: {
        pt: 'Assistir vídeo',
        en: 'Watch video'
      },
      viewPost: {
        pt: 'Ver publicação',
        en: 'View post'
      },
      instagramPost: {
        pt: 'Publicação do Instagram',
        en: 'Instagram post'
      },
      videoThumbnail: {
        pt: 'Miniatura do vídeo',
        en: 'Video thumbnail'
      },
      noContent: {
        pt: 'Nenhum conteúdo disponível para este influenciador.',
        en: 'No content available for this influencer.'
      }
    },
    metrics: {
      engagement: {
        pt: 'Engagement',
        en: 'Engagement'
      },
      averageEngagement: {
        pt: 'Engagement Médio',
        en: 'Average Engagement'
      },
      engagementNote: {
        pt: 'Baseado nas últimas publicações',
        en: 'Based on recent posts'
      },
      consistency: {
        pt: 'Consistência',
        en: 'Consistency'
      },
      contentQuality: {
        pt: 'Qualidade de Conteúdo',
        en: 'Content Quality'
      },
      high: {
        pt: 'Alta',
        en: 'High'
      },
      medium: {
        pt: 'Média',
        en: 'Medium'
      },
      low: {
        pt: 'Baixa',
        en: 'Low'
      },
      audience: {
        pt: 'Audiência',
        en: 'Audience'
      },
      followers: {
        pt: 'Seguidores',
        en: 'Followers'
      },
      views: {
        pt: 'Visualizações',
        en: 'Views'
      },
      connections: {
        pt: 'Conexões',
        en: 'Connections'
      },
      growthPotential: {
        pt: 'Potencial de Crescimento',
        en: 'Growth Potential'
      },
      trustScore: {
        pt: 'Trust Score',
        en: 'Trust Score'
      },
      potentialReach: {
        pt: 'Alcance Potencial',
        en: 'Potential Reach'
      },
      reachNote: {
        pt: 'Estimativa baseada em engajamento e audiência',
        en: 'Estimate based on engagement and audience'
      }
    },
    campaigns: {
      suggestedTitle: {
        pt: 'Campanhas Sugeridas',
        en: 'Suggested Campaigns'
      },
      suggestedDescription: {
        pt: 'Com base no perfil de {name}, recomendamos as seguintes opções de campanha que podem gerar os melhores resultados:',
        en: 'Based on {name}\'s profile, we recommend the following campaign options that can generate the best results:'
      },
      sponsored: {
        title: {
          pt: 'Conteúdo Patrocinado',
          en: 'Sponsored Content'
        },
        description: {
          pt: 'Publicação única destacando seu produto ou serviço de forma natural e autêntica.',
          en: 'Single post highlighting your product or service in a natural and authentic way.'
        }
      },
      contentSeries: {
        title: {
          pt: 'Série de Conteúdo',
          en: 'Content Series'
        },
        description: {
          pt: 'Série de 3-5 publicações ao longo de um mês para construir narrativa e engajamento contínuo.',
          en: 'Series of 3-5 posts over a month to build narrative and continuous engagement.'
        }
      },
      ambassador: {
        title: {
          pt: 'Programa de Embaixador',
          en: 'Ambassador Program'
        },
        description: {
          pt: 'Parceria de longo prazo com integração profunda da marca no conteúdo do influenciador.',
          en: 'Long-term partnership with deep integration of the brand in the influencer\'s content.'
        }
      },
      expectedReach: {
        pt: 'Alcance Esperado',
        en: 'Expected Reach'
      },
      engagementRate: {
        pt: 'Taxa de Engagement',
        en: 'Engagement Rate'
      },
      totalReach: {
        pt: 'Alcance Total',
        en: 'Total Reach'
      },
      conversion: {
        pt: 'Conversão',
        en: 'Conversion'
      },
      brandLift: {
        pt: 'Brand Lift',
        en: 'Brand Lift'
      },
      customerTrust: {
        pt: 'Confiança do Cliente',
        en: 'Customer Trust'
      },
      pricing: {
        pt: 'Estimativa de Preço',
        en: 'Price Estimate'
      },
      pricingDescription: {
        pt: 'Estimativa para uma publicação patrocinada padrão, baseada em métricas do setor.',
        en: 'Estimate for a standard sponsored post, based on industry metrics.'
      },
      pricingDisclaimer: {
        pt: 'Os valores podem variar com base em exclusividade, uso de imagem e outros fatores.',
        en: 'Values may vary based on exclusivity, image usage, and other factors.'
      }
    }
  },
  youtube: {
    categories: {
      film: {
        pt: 'Cinema e Animação',
        en: 'Film & Animation'
      },
      autos: {
        pt: 'Automóveis',
        en: 'Autos & Vehicles'
      },
      pets: {
        pt: 'Animais',
        en: 'Pets & Animals'
      },
      shortMovies: {
        pt: 'Curtas-metragens',
        en: 'Short Movies'
      },
      travel: {
        pt: 'Viagens',
        en: 'Travel & Events'
      },
      videoblogs: {
        pt: 'Vlogs',
        en: 'Videoblogs'
      },
      people: {
        pt: 'Pessoas',
        en: 'People & Blogs'
      },
      comedy: {
        pt: 'Comédia',
        en: 'Comedy'
      },
      entertainment: {
        pt: 'Entretenimento',
        en: 'Entertainment'
      },
      news: {
        pt: 'Notícias',
        en: 'News & Politics'
      },
      howto: {
        pt: 'Tutoriais',
        en: 'Howto & Style'
      },
      nonprofit: {
        pt: 'ONGs e Ativismo',
        en: 'Nonprofits & Activism'
      }
    }
  }
};

// Traduções para InfluencerList
const influencerListTranslations = {
  influencerList: {
    title: {
      pt: 'Lista de Influenciadores',
      en: 'Influencers List'
    },
    addButton: {
      pt: 'Adicionar Influenciador',
      en: 'Add Influencer'
    },
    searchPlaceholder: {
      pt: 'Buscar influenciador...',
      en: 'Search influencer...'
    },
    allCategories: {
      pt: 'Todas as categorias',
      en: 'All categories'
    },
    allPlatforms: {
      pt: 'Todas as plataformas',
      en: 'All platforms'
    },
    loading: {
      pt: 'Carregando influenciadores...',
      en: 'Loading influencers...'
    },
    errorMessage: {
      pt: 'Erro ao carregar dados. Tente novamente.',
      en: 'Error loading data. Please try again.'
    },
    fetchError: {
      pt: 'Falha ao buscar influenciadores',
      en: 'Failed to fetch influencers'
    },
    noResults: {
      pt: 'Nenhum influenciador encontrado com os filtros atuais.',
      en: 'No influencers found with current filters.'
    },
    yes: {
      pt: 'Sim',
      en: 'Yes'
    },
    no: {
      pt: 'Não',
      en: 'No'
    },
    viewDetails: {
      pt: 'Ver detalhes',
      en: 'View details'
    },
    generalContent: {
      pt: 'Conteúdo Geral',
      en: 'General Content'
    },
    table: {
      name: {
        pt: 'Nome',
        en: 'Name'
      },
      platform: {
        pt: 'Plataforma',
        en: 'Platform'
      },
      followers: {
        pt: 'Seguidores',
        en: 'Followers'
      },
      categories: {
        pt: 'Categorias',
        en: 'Categories'
      },
      trustScore: {
        pt: 'Trust Score',
        en: 'Trust Score'
      },
      fakeNews: {
        pt: 'Fake News',
        en: 'Fake News'
      },
      actions: {
        pt: 'Ações',
        en: 'Actions'
      }
    }
  }
};

// InfluencerSearch translations
const influencerSearchTranslations = {
  influencerSearch: {
    title: {
      pt: 'Busca de Influenciadores',
      en: 'Influencer Search'
    },
    searchPlaceholder: {
      pt: 'Digite o nome do influenciador ou usuário',
      en: 'Enter influencer name or username'
    },
    search: {
      pt: 'Buscar',
      en: 'Search'
    },
    searching: {
      pt: 'Buscando...',
      en: 'Searching...'
    },
    noResults: {
      pt: 'Nenhum influenciador encontrado com os critérios selecionados.',
      en: 'No influencers found with the selected criteria.'
    },
    viewDetails: {
      pt: 'Ver Detalhes',
      en: 'View Details'
    },
    generalContent: {
      pt: 'Conteúdo Geral',
      en: 'General Content'
    },
    filters: {
      category: {
        pt: 'Categoria',
        en: 'Category'
      },
      platform: {
        pt: 'Plataforma',
        en: 'Platform'
      },
      allCategories: {
        pt: 'Todas as Categorias',
        en: 'All Categories'
      },
      allPlatforms: {
        pt: 'Todas as Plataformas',
        en: 'All Platforms'
      }
    },
    stats: {
      followers: {
        pt: 'Seguidores',
        en: 'Followers'
      },
      trustScore: {
        pt: 'Trust Score',
        en: 'Trust Score'
      },
      posts: {
        pt: 'Posts',
        en: 'Posts'
      },
      views: {
        pt: 'Visualizações',
        en: 'Views'
      },
      videos: {
        pt: 'Vídeos',
        en: 'Videos'
      },
      connections: {
        pt: 'Conexões',
        en: 'Connections'
      }
    },
    errors: {
      fetchError: {
        pt: 'Erro ao buscar dados dos influenciadores. Tente novamente.',
        en: 'Error fetching influencer data. Please try again.'
      },
      networkError: {
        pt: 'Erro de conexão. Verifique sua internet e tente novamente.',
        en: 'Connection error. Check your internet and try again.'
      },
      apiLimitError: {
        pt: 'Limite de API excedido. Tente novamente mais tarde.',
        en: 'API limit exceeded. Please try again later.'
      }
    }
  }
};

// Traduções para Reports
const reportsTranslations = {
  reports: {
    title: {
      pt: 'Relatórios',
      en: 'Reports'
    },
    newReport: {
      pt: 'Novo Relatório',
      en: 'New Report'
    },
    recentReports: {
      pt: 'Relatórios Recentes',
      en: 'Recent Reports'
    },
    noReports: {
      pt: 'Nenhum relatório encontrado.',
      en: 'No reports found.'
    },
    loading: {
      recentReports: {
        pt: 'Carregando relatórios recentes...',
        en: 'Loading recent reports...'
      }
    },
    table: {
      name: {
        pt: 'Nome',
        en: 'Name'
      },
      type: {
        pt: 'Tipo',
        en: 'Type'
      },
      date: {
        pt: 'Data',
        en: 'Date'
      },
      platform: {
        pt: 'Plataforma',
        en: 'Platform'
      },
      status: {
        pt: 'Status',
        en: 'Status'
      },
      actions: {
        pt: 'Ações',
        en: 'Actions'
      }
    },
    platforms: {
      all: {
        pt: 'Todas',
        en: 'All'
      }
    },
    types: {
      influencer: {
        pt: 'Influenciador',
        en: 'Influencer'
      },
      category: {
        pt: 'Categoria',
        en: 'Category'
      },
      monthly: {
        pt: 'Mensal',
        en: 'Monthly'
      }
    },
    status: {
      completed: {
        pt: 'Concluído',
        en: 'Completed'
      },
      pending: {
        pt: 'Pendente',
        en: 'Pending'
      }
    },
    form: {
      reportType: {
        pt: 'Tipo de Relatório',
        en: 'Report Type'
      },
      influencerName: {
        pt: 'Nome do Influenciador',
        en: 'Influencer Name'
      },
      category: {
        pt: 'Categoria',
        en: 'Category'
      },
      period: {
        pt: 'Período',
        en: 'Period'
      },
      platform: {
        pt: 'Plataforma',
        en: 'Platform'
      },
      placeholders: {
        influencerName: {
          pt: 'Digite o nome do influenciador',
          en: 'Enter influencer name'
        },
        selectCategory: {
          pt: 'Selecione uma categoria',
          en: 'Select a category'
        },
        selectPeriod: {
          pt: 'Selecione um período',
          en: 'Select a period'
        },
        selectPlatform: {
          pt: 'Selecione uma plataforma',
          en: 'Select a platform'
        }
      }
    },
    periods: {
      week: {
        pt: 'Última Semana',
        en: 'Last Week'
      },
      month: {
        pt: 'Último Mês',
        en: 'Last Month'
      },
      quarter: {
        pt: 'Último Trimestre',
        en: 'Last Quarter'
      },
      year: {
        pt: 'Último Ano',
        en: 'Last Year'
      }
    },
    actions: {
      generate: {
        pt: 'Gerar Relatório',
        en: 'Generate Report'
      },
      generating: {
        pt: 'Gerando...',
        en: 'Generating...'
      },
      view: {
        pt: 'Visualizar',
        en: 'View'
      },
      download: {
        pt: 'Baixar',
        en: 'Download'
      },
      exportPDF: {
        pt: 'Exportar PDF',
        en: 'Export PDF'
      },
      exportCSV: {
        pt: 'Exportar CSV',
        en: 'Export CSV'
      },
      print: {
        pt: 'Imprimir',
        en: 'Print'
      }
    },
    preview: {
      title: {
        pt: 'Visualização do Relatório',
        en: 'Report Preview'
      },
      totalFollowers: {
        pt: 'Total de Seguidores',
        en: 'Total Followers'
      },
      averageTrustScore: {
        pt: 'Trust Score Médio',
        en: 'Average Trust Score'
      },
      mainPlatform: {
        pt: 'Plataforma Principal',
        en: 'Main Platform'
      },
      notAvailable: {
        pt: 'Não disponível',
        en: 'Not available'
      },
      platforms: {
        pt: 'Plataformas ({count})',
        en: 'Platforms ({count})'
      },
      posts: {
        pt: 'Publicações',
        en: 'Posts'
      },
      engagementRate: {
        pt: 'Taxa de Engajamento',
        en: 'Engagement Rate'
      },
      trustScore: {
        pt: 'Trust Score',
        en: 'Trust Score'
      },
      subscribers: {
        pt: 'Inscritos',
        en: 'Subscribers'
      },
      videos: {
        pt: 'Vídeos',
        en: 'Videos'
      },
      views: {
        pt: 'Visualizações',
        en: 'Views'
      },
      connections: {
        pt: 'Conexões',
        en: 'Connections'
      },
      category: {
        pt: 'Categoria',
        en: 'Category'
      },
      totalInfluencers: {
        pt: 'Total de Influenciadores',
        en: 'Total Influencers'
      },
      avgFollowers: {
        pt: 'Média de Seguidores',
        en: 'Average Followers'
      },
      avgEngagement: {
        pt: 'Engajamento Médio',
        en: 'Average Engagement'
      },
      topInfluencers: {
        pt: 'Principais Influenciadores',
        en: 'Top Influencers'
      },
      followers: {
        pt: 'seguidores',
        en: 'followers'
      },
      monthlyReport: {
        pt: 'Relatório {period}',
        en: '{period} Report'
      },
      newInfluencers: {
        pt: 'Novos Influenciadores',
        en: 'New Influencers'
      },
      growthRate: {
        pt: 'Taxa de Crescimento',
        en: 'Growth Rate'
      },
      topCategories: {
        pt: 'Principais Categorias',
        en: 'Top Categories'
      },
      mentions: {
        pt: 'menções',
        en: 'mentions'
      }
    },
    reportNames: {
      influencer: {
        pt: 'Relatório de Influenciador',
        en: 'Influencer Report'
      },
      category: {
        pt: 'Relatório de Categoria',
        en: 'Category Report'
      },
      monthly: {
        pt: 'Relatório Mensal',
        en: 'Monthly Report'
      },
      new: {
        pt: 'Novo Relatório',
        en: 'New Report'
      }
    },
    error: {
      recentReportsLoad: {
        pt: 'Erro ao carregar relatórios recentes.',
        en: 'Error loading recent reports.'
      },
      loadingRecentReports: {
        pt: 'Erro ao carregar relatórios recentes:',
        en: 'Error loading recent reports:'
      },
      requiredFields: {
        pt: 'Por favor, preencha todos os campos obrigatórios.',
        en: 'Please fill all required fields.'
      },
      reportGeneration: {
        pt: 'Erro ao gerar relatório:',
        en: 'Error generating report:'
      },
      reportGenerationFailed: {
        pt: 'Falha ao gerar relatório. Por favor, tente novamente.',
        en: 'Failed to generate report. Please try again.'
      },
      instagramAPI: {
        pt: 'Erro na API do Instagram:',
        en: 'Instagram API error:'
      },
      youtubeAPI: {
        pt: 'Erro na API do YouTube:',
        en: 'YouTube API error:'
      },
      linkedinAPI: {
        pt: 'Erro na API do LinkedIn:',
        en: 'LinkedIn API error:'
      },
      noInfluencerData: {
        pt: 'Nenhum dado encontrado para este influenciador.',
        en: 'No data found for this influencer.'
      },
      influencerReportGeneration: {
        pt: 'Erro ao gerar relatório de influenciador:',
        en: 'Error generating influencer report:'
      },
      instagramInfluencersByCategory: {
        pt: 'Erro ao buscar influenciadores do Instagram por categoria:',
        en: 'Error fetching Instagram influencers by category:'
      },
      youtubeInfluencersByCategory: {
        pt: 'Erro ao buscar influenciadores do YouTube por categoria:',
        en: 'Error fetching YouTube influencers by category:'
      },
      categoryReportGeneration: {
        pt: 'Erro ao gerar relatório de categoria:',
        en: 'Error generating category report:'
      },
      monthlyReportGeneration: {
        pt: 'Erro ao gerar relatório mensal:',
        en: 'Error generating monthly report:'
      },
      instagramMetrics: {
        pt: 'Erro ao buscar métricas do Instagram:',
        en: 'Error fetching Instagram metrics:'
      },
      youtubeMetrics: {
        pt: 'Erro ao buscar métricas do YouTube:',
        en: 'Error fetching YouTube metrics:'
      },
      linkedinMetrics: {
        pt: 'Erro ao buscar métricas do LinkedIn:',
        en: 'Error fetching LinkedIn metrics:'
      },
      trustScoreCalculation: {
        pt: 'Erro ao calcular Trust Score para {platform}:',
        en: 'Error calculating Trust Score for {platform}:'
      },
      engagementCalculation: {
        pt: 'Erro ao calcular engajamento:',
        en: 'Error calculating engagement:'
      },
      noReportToExport: {
        pt: 'Não há relatório para exportar. Gere um relatório primeiro.',
        en: 'No report to export. Generate a report first.'
      },
      noReportToPrint: {
        pt: 'Não há relatório para imprimir. Gere um relatório primeiro.',
        en: 'No report to print. Generate a report first.'
      }
    },
    alerts: {
      pdfExportSuccess: {
        pt: 'Relatório exportado como PDF com sucesso!',
        en: 'Report successfully exported as PDF!'
      },
      csvExportSuccess: {
        pt: 'Relatório exportado como CSV com sucesso!',
        en: 'Report successfully exported as CSV!'
      }
    },
    logs: {
      exportingPDF: {
        pt: 'Exportando relatório como PDF:',
        en: 'Exporting report as PDF:'
      },
      exportingCSV: {
        pt: 'Exportando relatório como CSV:',
        en: 'Exporting report as CSV:'
      }
    }
  }
};

// SearchInfluencer translations
const searchInfluencerTranslations = {
  searchInfluencer: {
    title: {
      pt: 'Busca de Influenciadores',
      en: 'Influencer Search'
    },
    searchPlaceholder: {
      pt: 'Digite o nome do influenciador ou usuário',
      en: 'Enter influencer name or username'
    },
    search: {
      pt: 'Buscar',
      en: 'Search'
    },
    searching: {
      pt: 'Buscando...',
      en: 'Searching...'
    },
    noResults: {
      pt: 'Nenhum influenciador encontrado com os critérios selecionados.',
      en: 'No influencers found with the selected criteria.'
    },
    viewDetails: {
      pt: 'Ver Detalhes',
      en: 'View Details'
    },
    filters: {
      category: {
        pt: 'Categoria',
        en: 'Category'
      },
      platform: {
        pt: 'Plataforma',
        en: 'Platform'
      },
      allCategories: {
        pt: 'Todas as Categorias',
        en: 'All Categories'
      },
      allPlatforms: {
        pt: 'Todas as Plataformas',
        en: 'All Platforms'
      }
    },
    stats: {
      followers: {
        pt: 'Seguidores',
        en: 'Followers'
      },
      trustScore: {
        pt: 'Trust Score',
        en: 'Trust Score'
      },
      posts: {
        pt: 'Posts',
        en: 'Posts'
      },
      views: {
        pt: 'Visualizações',
        en: 'Views'
      },
      videos: {
        pt: 'Vídeos',
        en: 'Videos'
      },
      connections: {
        pt: 'Conexões',
        en: 'Connections'
      }
    },
    errors: {
      fetchError: {
        pt: 'Erro ao buscar dados dos influenciadores. Tente novamente.',
        en: 'Error fetching influencer data. Please try again.'
      },
      networkError: {
        pt: 'Erro de conexão. Verifique sua internet e tente novamente.',
        en: 'Connection error. Check your internet and try again.'
      },
      apiLimitError: {
        pt: 'Limite de API excedido. Tente novamente mais tarde.',
        en: 'API limit exceeded. Please try again later.'
      }
    }
  }
};


// SearchPage translations
const searchPageTranslations = {
  searchPage: {
    title: {
      pt: 'Research Dashboard',
      en: 'Research Dashboard'
    },
    configButton: {
      showConfig: {
        pt: 'Configurar Pesquisa',
        en: 'Configure Search'
      },
      backToResults: {
        pt: 'Voltar aos Resultados',
        en: 'Back to Results'
      }
    },
    searchSection: {
      title: {
        pt: 'Pesquisar Influenciadores',
        en: 'Search Influencers'
      },
      inputPlaceholder: {
        pt: 'Digite o nome do influenciador...',
        en: 'Enter the influencer name...'
      },
      button: {
        pt: 'Pesquisar',
        en: 'Search'
      },
      searching: {
        pt: 'Buscando...',
        en: 'Searching...'
      }
    },
    results: {
      noResults: {
        pt: 'Nenhum resultado encontrado para "{term}".',
        en: 'No results found for "{term}".'
      },
      tryDifferent: {
        pt: 'Tente um nome diferente ou verifique suas configurações de pesquisa.',
        en: 'Try a different name or check your search settings.'
      },
      followers: {
        pt: 'seguidores',
        en: 'followers'
      },
      trustScore: {
        pt: 'Trust Score',
        en: 'Trust Score'
      },
      totalClaims: {
        pt: 'Total de Claims',
        en: 'Total Claims'
      },
      verifiedClaims: {
        pt: 'Claims Verificados',
        en: 'Verified Claims'
      }
    },
    errors: {
      generic: {
        pt: 'Erro ao buscar dados. Por favor, tente novamente.',
        en: 'Error fetching data. Please try again.'
      },
      instagram: {
        pt: 'Erro ao processar dados do Instagram:',
        en: 'Error processing Instagram data:'
      },
      youtube: {
        pt: 'Erro ao processar dados do YouTube:',
        en: 'Error processing YouTube data:'
      },
      linkedin: {
        pt: 'Erro ao processar dados do LinkedIn:',
        en: 'Error processing LinkedIn data:'
      }
    },
    configSection: {
      title: {
        pt: 'Configurações de Pesquisa',
        en: 'Search Configuration'
      },
      timeRange: {
        title: {
          pt: 'Período de Análise',
          en: 'Analysis Period'
        },
        lastWeek: {
          pt: 'Última Semana',
          en: 'Last Week'
        },
        lastMonth: {
          pt: 'Último Mês',
          en: 'Last Month'
        },
        allTime: {
          pt: 'Todo Histórico',
          en: 'All Time'
        }
      },
      claims: {
        title: {
          pt: 'Claims para Analisar',
          en: 'Claims to Analyze'
        },
        maxLimit: {
          pt: 'Máximo: 100',
          en: 'Maximum: 100'
        },
        description: {
          pt: 'Número de publicações recentes a serem analisadas para extração de claims.',
          en: 'Number of recent posts to be analyzed for claims extraction.'
        }
      },
      journals: {
        title: {
          pt: 'Journals Selecionados',
          en: 'Selected Journals'
        },
        description: {
          pt: 'Fontes científicas usadas para verificar as claims dos influenciadores.',
          en: 'Scientific sources used to verify influencers\' claims.'
        },
        add: {
          pt: 'Adicionar',
          en: 'Add'
        },
        filterPlaceholder: {
          pt: 'Filtrar journals...',
          en: 'Filter journals...'
        },
        noJournals: {
          pt: 'Nenhum journal disponível',
          en: 'No journals available'
        }
      }
    }
  }
};

// Settings translations

const settingsTranslations = {
  settings: {
    title: {
      pt: 'Configurações',
      en: 'Settings'
    },
    tabs: {
      accounts: {
        pt: 'Contas Conectadas',
        en: 'Connected Accounts'
      },
      preferences: {
        pt: 'Preferências',
        en: 'Preferences'
      },
      exports: {
        pt: 'Exportação',
        en: 'Exports'
      }
    },
    accounts: {
      title: {
        pt: 'Gerenciar Contas',
        en: 'Manage Accounts'
      },
      instagram: {
        profileAlt: {
          pt: 'Foto de perfil do Instagram',
          en: 'Instagram profile picture'
        },
        connectPrompt: {
          pt: 'Conecte sua conta do Instagram para analisar influenciadores na plataforma.',
          en: 'Connect your Instagram account to analyze influencers on the platform.'
        },
        connect: {
          pt: 'Conectar Instagram',
          en: 'Connect Instagram'
        },
        posts: {
          pt: 'publicações',
          en: 'posts'
        }
      },
      youtube: {
        profileAlt: {
          pt: 'Foto de perfil do YouTube',
          en: 'YouTube profile picture'
        },
        connectPrompt: {
          pt: 'Conecte sua conta do YouTube para analisar influenciadores na plataforma.',
          en: 'Connect your YouTube account to analyze influencers on the platform.'
        },
        connect: {
          pt: 'Conectar YouTube',
          en: 'Connect YouTube'
        },
        subscribers: {
          pt: 'inscritos',
          en: 'subscribers'
        },
        videos: {
          pt: 'vídeos',
          en: 'videos'
        }
      },
      linkedin: {
        profileAlt: {
          pt: 'Foto de perfil do LinkedIn',
          en: 'LinkedIn profile picture'
        },
        connectPrompt: {
          pt: 'Conecte sua conta do LinkedIn para analisar profissionais na plataforma.',
          en: 'Connect your LinkedIn account to analyze professionals on the platform.'
        },
        connect: {
          pt: 'Conectar LinkedIn',
          en: 'Connect LinkedIn'
        },
        connections: {
          pt: 'conexões',
          en: 'connections'
        }
      }
    },
    preferences: {
      appearance: {
        title: {
          pt: 'Aparência',
          en: 'Appearance'
        },
        darkMode: {
          pt: 'Modo Escuro',
          en: 'Dark Mode'
        },
        toggleTheme: {
          pt: 'Alternar tema claro/escuro',
          en: 'Toggle light/dark theme'
        }
      },
      notifications: {
        title: {
          pt: 'Notificações',
          en: 'Notifications'
        },
        email: {
          pt: 'Notificações por E-mail',
          en: 'Email Notifications'
        },
        emailPlaceholder: {
          pt: 'Digite seu e-mail',
          en: 'Enter your email'
        },
        push: {
          pt: 'Notificações Push',
          en: 'Push Notifications'
        },
        reportFrequency: {
          pt: 'Frequência de Relatórios',
          en: 'Report Frequency'
        },
        frequencies: {
          daily: {
            pt: 'Diário',
            en: 'Daily'
          },
          weekly: {
            pt: 'Semanal',
            en: 'Weekly'
          },
          monthly: {
            pt: 'Mensal',
            en: 'Monthly'
          }
        }
      },
      language: {
        title: {
          pt: 'Idioma',
          en: 'Language'
        },
        options: {
          portuguese: {
            pt: 'Português',
            en: 'Portuguese'
          },
          english: {
            pt: 'Inglês',
            en: 'English'
          },
          spanish: {
            pt: 'Espanhol',
            en: 'Spanish'
          }
        }
      },
      saveButton: {
        pt: 'Salvar Preferências',
        en: 'Save Preferences'
      }
    },
    exports: {
      title: {
        pt: 'Exportar Dados',
        en: 'Export Data'
      },
      description: {
        pt: 'Exporte seus dados e relatórios nos formatos abaixo.',
        en: 'Export your data and reports in the formats below.'
      },
      csv: {
        title: {
          pt: 'Exportar como CSV',
          en: 'Export as CSV'
        },
        description: {
          pt: 'Ideal para importar em Excel ou outras ferramentas de análise.',
          en: 'Ideal for importing into Excel or other analysis tools.'
        },
        button: {
          pt: 'Exportar CSV',
          en: 'Export CSV'
        }
      },
      pdf: {
        title: {
          pt: 'Exportar como PDF',
          en: 'Export as PDF'
        },
        description: {
          pt: 'Gere relatórios completos em formato PDF para compartilhar facilmente.',
          en: 'Generate complete reports in PDF format for easy sharing.'
        },
        button: {
          pt: 'Exportar PDF',
          en: 'Export PDF'
        }
      }
    },
    common: {
      connected: {
        pt: 'Conectado',
        en: 'Connected'
      },
      disconnected: {
        pt: 'Desconectado',
        en: 'Disconnected'
      },
      connect: {
        pt: 'Conectar',
        en: 'Connect'
      },
      disconnect: {
        pt: 'Desconectar',
        en: 'Disconnect'
      },
      connecting: {
        pt: 'Conectando...',
        en: 'Connecting...'
      },
      checkingConnection: {
        pt: 'Verificando conexão...',
        en: 'Checking connection...'
      }
    },
    alerts: {
      success: {
        instagramConnected: {
          pt: 'Conta do Instagram conectada com sucesso!',
          en: 'Instagram account successfully connected!'
        },
        youtubeConnected: {
          pt: 'Conta do YouTube conectada com sucesso!',
          en: 'YouTube account successfully connected!'
        },
        linkedinConnected: {
          pt: 'Conta do LinkedIn conectada com sucesso!',
          en: 'LinkedIn account successfully connected!'
        },
        instagramDisconnected: {
          pt: 'Conta do Instagram desconectada com sucesso!',
          en: 'Instagram account successfully disconnected!'
        },
        youtubeDisconnected: {
          pt: 'Conta do YouTube desconectada com sucesso!',
          en: 'YouTube account successfully disconnected!'
        },
        linkedinDisconnected: {
          pt: 'Conta do LinkedIn desconectada com sucesso!',
          en: 'LinkedIn account successfully disconnected!'
        },
        preferencesSaved: {
          pt: 'Preferências salvas com sucesso!',
          en: 'Preferences successfully saved!'
        },
        csvExport: {
          pt: 'Dados exportados como CSV com sucesso!',
          en: 'Data successfully exported as CSV!'
        },
        pdfExport: {
          pt: 'Dados exportados como PDF com sucesso!',
          en: 'Data successfully exported as PDF!'
        }
      },
      error: {
        accountsStatus: {
          pt: 'Erro ao carregar status das contas. Tente novamente.',
          en: 'Error loading account status. Please try again.'
        },
        instagramConnection: {
          pt: 'Erro ao conectar com o Instagram. Tente novamente.',
          en: 'Error connecting to Instagram. Please try again.'
        },
        youtubeConnection: {
          pt: 'Erro ao conectar com o YouTube. Tente novamente.',
          en: 'Error connecting to YouTube. Please try again.'
        },
        linkedinConnection: {
          pt: 'Erro ao conectar com o LinkedIn. Tente novamente.',
          en: 'Error connecting to LinkedIn. Please try again.'
        },
        instagramDisconnection: {
          pt: 'Erro ao desconectar do Instagram. Tente novamente.',
          en: 'Error disconnecting from Instagram. Please try again.'
        },
        youtubeDisconnection: {
          pt: 'Erro ao desconectar do YouTube. Tente novamente.',
          en: 'Error disconnecting from YouTube. Please try again.'
        },
        linkedinDisconnection: {
          pt: 'Erro ao desconectar do LinkedIn. Tente novamente.',
          en: 'Error disconnecting from LinkedIn. Please try again.'
        },
        savePreferences: {
          pt: 'Erro ao salvar preferências. Tente novamente.',
          en: 'Error saving preferences. Please try again.'
        },
        csvExport: {
          pt: 'Erro ao exportar dados como CSV. Tente novamente.',
          en: 'Error exporting data as CSV. Please try again.'
        },
        pdfExport: {
          pt: 'Erro ao exportar dados como PDF. Tente novamente.',
          en: 'Error exporting data as PDF. Please try again.'
        }
      }
    },
    errors: {
      accountsStatus: {
        pt: 'Erro ao buscar status das contas',
        en: 'Error fetching accounts status'
      },
      instagramConnection: {
        pt: 'Erro ao verificar conexão do Instagram',
        en: 'Error checking Instagram connection'
      },
      youtubeConnection: {
        pt: 'Erro ao verificar conexão do YouTube',
        en: 'Error checking YouTube connection'
      },
      linkedinConnection: {
        pt: 'Erro ao verificar conexão do LinkedIn',
        en: 'Error checking LinkedIn connection'
      },
      connectInstagram: {
        pt: 'Erro ao conectar Instagram',
        en: 'Error connecting Instagram'
      },
      connectYoutube: {
        pt: 'Erro ao conectar YouTube',
        en: 'Error connecting YouTube'
      },
      connectLinkedin: {
        pt: 'Erro ao conectar LinkedIn',
        en: 'Error connecting LinkedIn'
      },
      disconnectInstagram: {
        pt: 'Erro ao desconectar Instagram',
        en: 'Error disconnecting Instagram'
      },
      disconnectYoutube: {
        pt: 'Erro ao desconectar YouTube',
        en: 'Error disconnecting YouTube'
      },
      disconnectLinkedin: {
        pt: 'Erro ao desconectar LinkedIn',
        en: 'Error disconnecting LinkedIn'
      },
      savePreferences: {
        pt: 'Erro ao salvar preferências',
        en: 'Error saving preferences'
      },
      csvExport: {
        pt: 'Erro ao exportar CSV',
        en: 'Error exporting CSV'
      },
      pdfExport: {
        pt: 'Erro ao exportar PDF',
        en: 'Error exporting PDF'
      },
      instagramConnectionFailed: {
        pt: 'Falha na conexão com o Instagram',
        en: 'Instagram connection failed'
      },
      youtubeConnectionFailed: {
        pt: 'Falha na conexão com o YouTube',
        en: 'YouTube connection failed'
      },
      linkedinConnectionFailed: {
        pt: 'Falha na conexão com o LinkedIn',
        en: 'LinkedIn connection failed'
      }
    }
  }
};

const themeTranslations = {
  theme: {
    dark: {
      pt: "Tema escuro",
      en: "Dark theme"
    },
    light: {
      pt: "Tema claro",
      en: "Light theme"
    }
  }
};

export default {
  ...translations,
  ...leaderboardTranslations,
  ...analyticsTranslations,
  ...apiTestTranslations,
  ...claimDetailsTranslations,
  ...healthClaimsFormTranslations,
  ...healthClaimsTranslations,
  ...influencerDetailsTranslations,
  ...influencerListTranslations,
  ...influencerSearchTranslations,
  ...reportsTranslations,
  ...searchInfluencerTranslations,
  ...searchPageTranslations,
  ...settingsTranslations,
  ...themeTranslations
};
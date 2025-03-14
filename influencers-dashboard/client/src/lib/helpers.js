export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  export const calculateTrustScore = (claims) => {
    if (!claims || claims.length === 0) return 0;
    const total = claims.reduce((acc, claim) => acc + claim.trustScore, 0);
    return Math.round(total / claims.length);
  };
  
  export const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  
  export const getStatusColor = (status) => {
    const colors = {
      verified: 'status-verified',
      questionable: 'status-questionable',
      refuted: 'status-refuted'
    };
    return colors[status] || 'status-default';
  };
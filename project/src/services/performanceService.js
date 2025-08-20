import api from '../utils/api';

export const performanceService = {
  // Log performance data
  logPerformance: async (userId, performanceData) => {
    const response = await api.post(`/users/${userId}/performance`, performanceData);
    return response.data;
  },

  // Get user performance stats
  getPerformanceStats: async (userId, timeframe = '30d') => {
    const response = await api.get(`/users/${userId}/performance?timeframe=${timeframe}`);
    return response.data;
  },

  // Generate annual report
  generateAnnualReport: async (userId, year) => {
    const response = await api.get(`/users/${userId}/reports/${year}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Get performance trends
  getPerformanceTrends: async (userId) => {
    const response = await api.get(`/users/${userId}/performance/trends`);
    return response.data;
  }
};
import api from '../utils/api';

export const ballService = {
  // Get ball recommendations
  getRecommendations: async (bowlerSpecs, oilPattern) => {
    const response = await api.post('/balls/recommendations', {
      bowlerSpecs,
      oilPattern
    });
    return response.data;
  },

  // Get all balls
  getAllBalls: async () => {
    const response = await api.get('/balls');
    return response.data;
  },

  // Get user's arsenal
  getUserArsenal: async (userId) => {
    const response = await api.get(`/users/${userId}/arsenal`);
    return response.data;
  },

  // Add ball to arsenal
  addToArsenal: async (userId, ballData) => {
    const response = await api.post(`/users/${userId}/arsenal`, ballData);
    return response.data;
  },

  // Update ball surface
  updateBallSurface: async (arsenalId, surfaceData) => {
    const response = await api.put(`/arsenal/${arsenalId}/surface`, surfaceData);
    return response.data;
  },

  // Log ball usage
  logUsage: async (arsenalId, usageData) => {
    const response = await api.post(`/arsenal/${arsenalId}/usage`, usageData);
    return response.data;
  }
};
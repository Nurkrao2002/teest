import api from '../utils/api';

export const patternService = {
  // Get all oil patterns
  getAllPatterns: async () => {
    const response = await api.get('/patterns');
    return response.data;
  },

  // Get pattern by ID
  getPattern: async (id) => {
    const response = await api.get(`/patterns/${id}`);
    return response.data;
  },

  // Create custom pattern
  createPattern: async (patternData) => {
    const response = await api.post('/patterns', patternData);
    return response.data;
  },

  // Get patterns by category
  getPatternsByCategory: async (category) => {
    const response = await api.get(`/patterns?category=${category}`);
    return response.data;
  }
};
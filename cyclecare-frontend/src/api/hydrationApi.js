import apiClient from './apiClient';

export const hydrationApi = {
  getTodayHydration: () => apiClient.get('/hydration'),
  updateHydration: (data) => apiClient.put('/hydration', data),
  resetHydration: () => apiClient.post('/hydration/reset'),
  getHydrationHistory: () => apiClient.get('/hydration/history'),
};

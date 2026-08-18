import apiClient from './apiClient';

export const predictionApi = {
  getPrediction: () => apiClient.get('/prediction'),
  getCycleStats: () => apiClient.get('/cycles'),
};

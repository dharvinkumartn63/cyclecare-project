import apiClient from './apiClient';

export const periodApi = {
  getPeriods: () => apiClient.get('/periods'),
  createPeriod: (data) => apiClient.post('/periods', data),
  updatePeriod: (id, data) => apiClient.put(`/periods/${id}`, data),
  deletePeriod: (id) => apiClient.delete(`/periods/${id}`),
};

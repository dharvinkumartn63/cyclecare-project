import apiClient from './apiClient';

export const userApi = {
  getProfile: () => apiClient.get('/user/profile'),
  updateProfile: (data) => apiClient.put('/user/profile', data),
  changePassword: (data) => apiClient.put('/user/password', data),
  updateNotifications: (data) => apiClient.put('/user/notifications', data),
};

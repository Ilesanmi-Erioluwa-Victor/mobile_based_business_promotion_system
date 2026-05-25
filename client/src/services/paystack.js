import api from './api';

export const initializePayment = async (type, businessId, promotionId) => {
  const { data } = await api.post('/payments/initialize', { type, businessId, promotionId });
  return data.data;
};

export const verifyPayment = async (reference) => {
  const { data } = await api.get(`/payments/verify/${reference}`);
  return data.data;
};

export const getPaymentHistory = async () => {
  const { data } = await api.get('/payments/history');
  return data.data;
};

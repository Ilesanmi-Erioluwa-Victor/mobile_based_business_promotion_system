import { useState } from 'react';
import { initializePayment as init, verifyPayment as verify } from '../services/paystack';
import { useAuth } from './useAuth';

export const usePaystack = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const verifyPayment = async (reference) => {
    setLoading(true);
    setError('');
    try {
      return await verify(reference);
    } catch (err) {
      const message = err.response?.data?.message || 'Payment verification failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const initializePayment = async ({ type, businessId, promotionId, amount, onSuccess, onCancel }) => {
    setLoading(true);
    setError('');
    try {
      const payment = await init(type, businessId, promotionId);
      if (!window.PaystackPop) throw new Error('Paystack popup script is not loaded');
      window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: payment.amount || amount * 100,
        ref: payment.reference,
        onSuccess: async (transaction) => {
          const reference = transaction.reference || transaction.trxref || payment.reference;
          const verified = await verifyPayment(reference);
          onSuccess?.(verified);
        },
        onCancel: () => {
          window.alert('Payment cancelled');
          onCancel?.();
        }
      }).openIframe();
      return payment;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Payment initialization failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { initializePayment, verifyPayment, loading, error };
};

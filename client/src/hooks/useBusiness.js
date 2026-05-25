import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';

export const useBusiness = () => {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMyBusiness = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/businesses/me');
      setBusiness(data.data);
      return data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load business');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyBusiness();
  }, [fetchMyBusiness]);

  return { business, loading, error, fetchMyBusiness };
};

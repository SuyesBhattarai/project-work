import { useState } from 'react';
import api from '../utils/api';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (method, url, data = null, config = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api({
        method,
        url,
        data,
        ...config,
      });
      setLoading(false);
      return { data: response.data, error: null };
    } catch (err) {
      const errorMessage = 
        err.response?.data?.message || 
        err.message || 
        'An error occurred';
      setError(errorMessage);
      setLoading(false);
      return { data: null, error: errorMessage };
    }
  };

  const get = (url, config) => request('GET', url, null, config);
  const post = (url, data, config) => request('POST', url, data, config);
  const put = (url, data, config) => request('PUT', url, data, config);
  const del = (url, config) => request('DELETE', url, null, config);

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del,
    request,
  };
};

export default useApi;
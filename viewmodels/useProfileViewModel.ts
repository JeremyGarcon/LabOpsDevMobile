import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getApiErrorMessage } from '../utils/apiError';

export function useProfileViewModel() {
  const { user, logout, refreshProfile, isLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setError(null);
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleRefresh = async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await refreshProfile();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    user,
    isLoading,
    isLoggingOut,
    isRefreshing,
    error,
    handleLogout,
    handleRefresh,
  };
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { LoginRequest, RegisterRequest } from '../types/authrequest.type';
import { User } from '../types/user.type';
import { authRepository } from '../repositories/authrepository';
import { setOnUnauthorized } from '../services/api';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<User | null>(null);

  const logout = useCallback(async () => {
    await authRepository.logout();
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  useEffect(() => {
    setOnUnauthorized(() => {
      setUser(null);
      setStatus('unauthenticated');
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      try {
        const restoredUser = await authRepository.restoreSession();
        if (cancelled) return;

        if (restoredUser) {
          setUser(restoredUser);
          setStatus('authenticated');
        } else {
          setStatus('unauthenticated');
        }
      } catch {
        if (!cancelled) {
          setStatus('unauthenticated');
        }
      }
    };

    restore();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const loggedInUser = await authRepository.login(credentials);
    setUser(loggedInUser);
    setStatus('authenticated');
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    const registeredUser = await authRepository.register(payload);
    setUser(registeredUser);
    setStatus('authenticated');
  }, []);

  const refreshProfile = useCallback(async () => {
    const profile = await authRepository.getProfile();
    setUser(profile);
    setStatus('authenticated');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      isAuthenticated: status === 'authenticated',
      isLoading: status === 'loading',
      login,
      register,
      logout,
      refreshProfile,
    }),
    [status, user, login, register, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}


import { createContext, ReactNode, useContext, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tokenStorage } from '../../lib/tokenStorage';
import { fetchCurrentUser, loginRequest, registerRequest } from './api';
import { LoginInput, RegisterInput, User } from './types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [hasToken, setHasToken] = useState(() => Boolean(tokenStorage.get()));

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: fetchCurrentUser,
    enabled: hasToken,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      tokenStorage.set(data.accessToken);
      setHasToken(true);
      queryClient.setQueryData(['auth', 'me'], data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: (data) => {
      tokenStorage.set(data.accessToken);
      setHasToken(true);
      queryClient.setQueryData(['auth', 'me'], data.user);
    },
  });

  function logout() {
    tokenStorage.clear();
    setHasToken(false);
    queryClient.setQueryData(['auth', 'me'], null);
    queryClient.clear();
  }

  const value: AuthContextValue = {
    user: user ?? null,
    isLoading: hasToken && isLoading,
    isAuthenticated: Boolean(hasToken && user),
    login: async (input) => {
      await loginMutation.mutateAsync(input);
    },
    register: async (input) => {
      await registerMutation.mutateAsync(input);
    },
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

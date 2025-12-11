import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../utils/api';

interface User {
  id: number;
  email: string;
  name: string;
  balance: number;
  role: string;
  totalBets: number;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  banned: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'f1bet-auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (token: string) => {
    try {
      const { user: userData } = await authApi.me(token);
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null);
    }
  };

  const refreshUser = async () => {
    if (accessToken) {
      await fetchUserData(accessToken);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { access } = JSON.parse(stored);
        if (access) {
          setAccessToken(access);
          fetchUserData(access).finally(() => setLoading(false));
          return;
        }
      } catch (error) {
        console.error('Erreur lors de la lecture du token', error);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { access, refresh, user: userData } = await authApi.login(email, password);
      setAccessToken(access);
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ access, refresh }));
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { access, refresh, user: userData } = await authApi.signup(email, password, name);
      setAccessToken(access);
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ access, refresh }));
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        signIn,
        signUp,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
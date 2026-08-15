import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import api from '../api/client';

interface AuthContextType {
  user: {
    id: string;
    email: string;
  } | null;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoadingLoggedUser: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loggedUser, setLoggedUser] = useState<{
    id: string;
    email: string;
  } | null>(null);
  const [isLoadingLoggedUser, setIsLoadingLoggedUser] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingLoggedUser(true);
        const response = await api.get('/me');
        const { id, email } = response.data;
        setLoggedUser({ id, email });
        setIsLoadingLoggedUser(false);
      } catch (err: any) {
        setLoggedUser(null);
        setIsLoadingLoggedUser(false);
      }
    };
    loadData();
  }, []);

  const login = async () => {
    try {
      setIsLoadingLoggedUser(true);
      const response = await api.get('/me');
      const { id, email } = response.data;
      setLoggedUser({ id, email });
      setIsLoadingLoggedUser(false);
    } catch (err: any) {
      setLoggedUser(null);
      setIsLoadingLoggedUser(false);
    }
  };

  const logout = async () => {
    setIsLoadingLoggedUser(true);
    await api.post('/logout');
    setLoggedUser(null);
    setIsLoadingLoggedUser(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user: loggedUser,
        login,
        logout,
        isAuthenticated: !!loggedUser,
        isLoadingLoggedUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

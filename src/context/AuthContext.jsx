import { useEffect, useState } from 'react';
import { AuthContext } from './auth-context';
import { api } from '../services/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')));
  const [sessionError, setSessionError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    api.get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          return;
        }
        setSessionError('No se pudo validar la sesión. Comprueba que el servidor esté disponible.');
      })
      .finally(() => setLoading(false));
  }, []);

  const authenticate = async (endpoint, credentials) => {
    const { data } = await api.post(`/auth/${endpoint}`, credentials);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    setSessionError('');
  };

  const login = (credentials) => authenticate('login', credentials);
  const register = (credentials) => authenticate('register', credentials);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setSessionError('');
  };

  const retrySession = () => {
    setSessionError('');
    setLoading(true);
    api.get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch((error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          setUser(null);
          return;
        }
        setSessionError('No se pudo validar la sesión. Comprueba que el servidor esté disponible.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, sessionError, retrySession }}>
      {children}
    </AuthContext.Provider>
  );
}

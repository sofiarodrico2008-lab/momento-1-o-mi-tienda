import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export const RutaProtegida = () => {
  const { user, loading, sessionError, retrySession } = useAuth();

  if (loading) {
    return <p role="status">Validando sesión...</p>;
  }

  if (sessionError) {
    return (
      <section role="alert">
        <p>{sessionError}</p>
        <button type="button" onClick={retrySession}>Reintentar</button>
      </section>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user, login, register } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/catalogo" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      if (isRegistering) {
        await register({ name, email, password });
      } else {
        await login({ email, password });
      }
      navigate('/catalogo', { replace: true });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'No se pudo conectar con el servidor. Inténtalo de nuevo.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <Link className="auth-brand" to="/login">Mi Tienda</Link>
        <p className="eyebrow">Catálogo deportivo</p>
        <h1 id="auth-title">{isRegistering ? 'Crear cuenta' : 'Bienvenido de nuevo'}</h1>
        <p className="auth-description">
          {isRegistering
            ? 'Regístrate para guardar favoritos y administrar el catálogo.'
            : 'Inicia sesión para continuar a tu catálogo.'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegistering && (
            <label>
              Nombre
              <input
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
          )}
          <label>
            Correo electrónico
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              autoComplete={isRegistering ? 'new-password' : 'current-password'}
              minLength={isRegistering ? 8 : undefined}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {isRegistering && <span className="field-hint">Usa al menos 8 caracteres.</span>}
          </label>

          {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}

          <button className="button button-primary auth-submit" type="submit" disabled={submitting}>
            {submitting ? 'Procesando...' : isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="auth-switch">
          {isRegistering ? '¿Ya tienes una cuenta?' : '¿Aún no tienes una cuenta?'}{' '}
          <button
            className="text-button"
            type="button"
            onClick={() => {
              setIsRegistering((current) => !current);
              setErrorMessage('');
            }}
          >
            {isRegistering ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </p>
      </section>
    </main>
  );
}

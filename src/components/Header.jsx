import { NavLink, useNavigate } from 'react-router-dom';
import { useFavoritos } from '../context/useFavoritos';
import { useAuth } from '../context/useAuth';

export default function Header() {
  const { favoritos } = useFavoritos();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirige al login al cerrar sesión
  };

  return (
    <header className="site-header">
      <NavLink className="site-brand" to="/">Mi Tienda</NavLink>

      <nav className="site-nav" aria-label="Navegación principal">
        <NavLink to="/" end>
          Inicio
        </NavLink>
        <NavLink to="/catalogo">
          Catálogo
        </NavLink>
        <NavLink to="/favoritos">
          Favoritos ({favoritos.length})
        </NavLink>

        {user && (
          <button className="button button-outline-danger" onClick={handleLogout} type="button">
            Cerrar Sesión
          </button>
        )}
      </nav>
    </header>
  );
}
import { useContext } from 'react';
import { ContextoFavoritos } from './favoritosContext';

export function useFavoritos() {
  const context = useContext(ContextoFavoritos);
  if (!context) {
    throw new Error('useFavoritos debe utilizarse dentro de ProveedorFavoritos');
  }
  return context;
}

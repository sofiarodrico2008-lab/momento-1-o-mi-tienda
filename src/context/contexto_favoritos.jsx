import { useState } from 'react';
import { ContextoFavoritos } from './favoritosContext';

export const ProveedorFavoritos = ({ children }) => {
  const [favoritos, setFavoritos] = useState([]);

  const alternarFavorito = (item) => {
    setFavoritos((prev) => {
      const existe = prev.find((fav) => fav.id === item.id);
      if (existe) {
        return prev.filter((fav) => fav.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  return (
    <ContextoFavoritos.Provider value={{ favoritos, alternarFavorito }}>
      {children}
    </ContextoFavoritos.Provider>
  );
}
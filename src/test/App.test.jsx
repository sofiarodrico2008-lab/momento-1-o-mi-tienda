import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { RutaProtegida } from '../components/RutaProtejida';
import Login from '../pages/Login';

describe('Autenticación y rutas', () => {
  it('muestra el formulario de inicio de sesión', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Bienvenido de nuevo' })).toBeTruthy();
    expect(screen.getByRole('textbox', { name: 'Correo electrónico' })).toBeTruthy();
    expect(screen.getByLabelText('Contraseña')).toBeTruthy();
  });

  it('ofrece el registro con los campos y validación mínima', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Regístrate' }));

    expect(screen.getByRole('heading', { name: 'Crear cuenta' })).toBeTruthy();
    expect(screen.getByLabelText('Nombre')).toBeTruthy();
    expect(screen.getByLabelText(/Contraseña/).getAttribute('minLength')).toBe('8');
  });

  it('redirige al login cuando alguien no autenticado intenta entrar al catálogo', () => {
    render(
      <MemoryRouter initialEntries={['/catalogo']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<h1>Formulario de acceso</h1>} />
            <Route element={<RutaProtegida />}>
              <Route path="/catalogo" element={<h1>Catálogo privado</h1>} />
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Formulario de acceso' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Catálogo privado' })).toBeNull();
  });
});

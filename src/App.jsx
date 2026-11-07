import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ProveedorFavoritos } from './context/contexto_favoritos';
import { AuthProvider } from './context/AuthContext';
import { RutaProtegida } from './components/RutaProtejida';

import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Inicio from './pages/inicio';
import Catalogo from './pages/catalogo';
import Favoritos from './pages/favoritos';
import './App.css';

function Layout() {
  return (
    <div className="app-container">
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProveedorFavoritos>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<RutaProtegida />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Inicio />} />
                <Route path="catalogo" element={<Catalogo />} />
                <Route path="favoritos" element={<Favoritos />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </ProveedorFavoritos>
    </AuthProvider>
  );
}
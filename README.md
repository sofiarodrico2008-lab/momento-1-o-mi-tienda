# Mi Tienda - Proyecto integrador

Aplicación SPA con React, React Router y Axios, conectada a una API Express que persiste usuarios y productos en MongoDB.

## Requisitos

- Node.js 20.19+ y npm.
- MongoDB local o una instancia de MongoDB Atlas.

## Configuración

Desde la carpeta del proyecto:

```powershell
npm install
npm --prefix server install
Copy-Item server\.env.example server\.env
```

Edita `server/.env` y configura `MONGODB_URI` con la URL de tu base de datos, además de reemplazar `JWT_SECRET` por una clave aleatoria de al menos 32 caracteres. El archivo `.env` está excluido de Git.

## Ejecutar

Abre dos terminales en la carpeta del proyecto:

```powershell
npm run server
```

```powershell
npm run dev
```

La API estará disponible en `http://localhost:5000/api` y la aplicación en `http://localhost:5173`. Vite reenvía las peticiones `/api` al servidor local. Para otra URL, define `VITE_API_URL` antes de iniciar Vite.

La aplicación inicia en la pantalla de acceso. Crea una cuenta desde **Regístrate**; después podrás iniciar sesión, entrar al catálogo, guardar favoritos y cerrar sesión. La lista se obtiene con `GET /api/products`; agregar y eliminar productos usan `POST /api/products` y `DELETE /api/products/:id`. Estas rutas requieren un token JWT válido.

## Pruebas y calidad

```powershell
npm test -- --run
npm run lint
npm run build
```

Las pruebas cubren la pantalla de acceso, el formulario de registro y la redirección de rutas privadas para usuarios sin sesión.

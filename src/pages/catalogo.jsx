import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useFavoritos } from '../context/useFavoritos';

const mensajeError = (error) =>
  error.response?.data?.message || 'No se pudo completar la operación. Verifica la conexión con el servidor.';

const normalizarProducto = (producto) => ({
  ...producto,
  id: producto._id || producto.id,
});

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { favoritos, alternarFavorito } = useFavoritos();

  useEffect(() => {
    let active = true;

    api.get('/products')
      .then(({ data }) => {
        if (active) setProductos(data.products.map(normalizarProducto));
      })
      .catch((error) => {
        if (active) setErrorMessage(mensajeError(error));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleAgregar = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSaving(true);

    try {
      const { data } = await api.post('/products', {
        nombre: nuevoNombre.trim(),
        precio: Number(nuevoPrecio),
        categoria: 'Deportes',
      });
      setProductos((current) => [normalizarProducto(data.product), ...current]);
      setNuevoNombre('');
      setNuevoPrecio('');
    } catch (error) {
      setErrorMessage(mensajeError(error));
    } finally {
      setSaving(false);
    }
  };

  const handleEliminar = async (producto) => {
    setErrorMessage('');

    try {
      await api.delete(`/products/${producto.id}`);
      setProductos((current) => current.filter((item) => item.id !== producto.id));
      if (favoritos.some((item) => item.id === producto.id)) alternarFavorito(producto);
    } catch (error) {
      setErrorMessage(mensajeError(error));
    }
  };

  const productosFiltrados = productos.filter((item) =>
    `${item.nombre} ${item.categoria}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <section className="page-section">
      <div className="page-heading">
        <p className="eyebrow">Todo para tu próximo partido</p>
        <h1>Catálogo de productos</h1>
        <p>Administra los productos guardados en la base de datos.</p>
      </div>

      <form className="product-form" onSubmit={handleAgregar}>
        <label>
          Nombre del producto
          <input
            required
            maxLength={100}
            placeholder="Ej. Balón de fútbol"
            value={nuevoNombre}
            onChange={(event) => setNuevoNombre(event.target.value)}
          />
        </label>
        <label>
          Precio (COP)
          <input
            required
            type="number"
            min="1"
            step="1"
            placeholder="120000"
            value={nuevoPrecio}
            onChange={(event) => setNuevoPrecio(event.target.value)}
          />
        </label>
        <button className="button button-primary" type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Agregar producto'}
        </button>
      </form>

      <div className="catalog-toolbar">
        <label className="search-field">
          Buscar en el catálogo
          <input
            type="search"
            placeholder="Nombre o categoría..."
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
          />
        </label>
        <span>{productos.length} productos</span>
      </div>

      {errorMessage && <p className="notice notice-error" role="alert">{errorMessage}</p>}
      {loading && <p role="status">Cargando catálogo...</p>}
      {!loading && !errorMessage && productos.length === 0 && (
        <p className="empty-state">Aún no hay productos. Agrega el primero usando el formulario.</p>
      )}
      {!loading && !errorMessage && productos.length > 0 && productosFiltrados.length === 0 && (
        <p className="empty-state">No encontramos productos con esa búsqueda.</p>
      )}

      <div className="product-grid">
        {productosFiltrados.map((producto) => {
          const esFavorito = favoritos.some((favorito) => favorito.id === producto.id);
          return (
            <article className="product-card" key={producto.id}>
              <span className="product-category">{producto.categoria}</span>
              <h2>{producto.nombre}</h2>
              <p className="product-price">
                {new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  maximumFractionDigits: 0,
                }).format(producto.precio)}
              </p>
              <div className="product-actions">
                <button
                  className={`button ${esFavorito ? 'button-danger' : 'button-secondary'}`}
                  type="button"
                  onClick={() => alternarFavorito(producto)}
                >
                  {esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                </button>
                <button
                  className="button button-outline-danger"
                  type="button"
                  onClick={() => handleEliminar(producto)}
                >
                  Eliminar
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

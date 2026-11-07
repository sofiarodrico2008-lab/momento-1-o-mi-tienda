import { useFavoritos } from '../context/useFavoritos';

const formatearPrecio = (precio) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(precio);

export default function Favoritos() {
  const { favoritos, alternarFavorito } = useFavoritos();

  return (
    <section className="page-section">
      <div className="page-heading">
        <p className="eyebrow">Tu selección personal</p>
        <h1>Productos favoritos</h1>
      </div>

      {favoritos.length === 0 ? (
        <p className="empty-state">Todavía no tienes productos guardados en favoritos.</p>
      ) : (
        <div className="product-grid">
          {favoritos.map((producto) => (
            <article className="product-card" key={producto.id}>
              <span className="product-category">{producto.categoria}</span>
              <h2>{producto.nombre}</h2>
              <p className="product-price">{formatearPrecio(producto.precio)}</p>
              <button
                className="button button-danger"
                type="button"
                onClick={() => alternarFavorito(producto)}
              >
                Quitar de favoritos
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

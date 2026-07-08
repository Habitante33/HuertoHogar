import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { useCart } from '../context/CartContext';

export function getEmojiPorCategoria(cat) {
    if (!cat) return "📦";
    const lower = cat.toLowerCase();
    if (lower.includes("fruta")) return "🍎";
    if (lower.includes("verdura")) return "🥬";
    if (lower.includes("orgán") || lower.includes("organ")) return "🍯";
    if (lower.includes("láct") || lower.includes("lact")) return "🥛";
    return "📦";
}

export function getShortLabel(cat) {
    if (!cat) return "";
    const lower = cat.toLowerCase();
    if (lower.includes("fruta")) return "Frutas";
    if (lower.includes("verdura")) return "Verduras";
    if (lower.includes("orgán") || lower.includes("organ")) return "Orgánicos";
    if (lower.includes("láct") || lower.includes("lact")) return "Lácteos";
    return cat;
}

export default function TarjetaProducto({ producto, isDestacado = false }) {
    const { carrito, agregarAlCarrito } = useCart();
    const { mostrarNotificacion } = useContext(AppContext);
    
    // Obtener cantidad de este producto ya agregada al carrito
    const itemEnCarrito = carrito.find(item => item.id === producto.id);
    const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;
    const stockDisponible = Math.max(0, producto.stock - cantidadEnCarrito);

    const handleAgregar = () => {
        const agregado = agregarAlCarrito(producto.id, 1);
        if (agregado) {
            mostrarNotificacion(`Producto agregado al carrito: ${producto.nombre}`, 'success');
            if (stockDisponible - 1 === 0) {
                mostrarNotificacion('Ya no queda stock de este producto.', 'warning');
            }
        } else {
            mostrarNotificacion('No se pudo agregar el producto. Verifica el stock disponible.', 'warning');
        }
    };

    return (
        <div className="card h-100 card-product position-relative shadow-sm border-0">
            {/* Badge de Oferta en Amarillo Mostaza */}
            {producto.esOferta && (
                <span 
                    className="position-absolute top-0 end-0 badge text-dark fw-bold m-2 shadow-sm" 
                    style={{ backgroundColor: 'var(--hh-accent-yellow)', zIndex: 2, fontSize: '0.75rem', borderRadius: '6px' }}
                >
                    ¡OFERTA!
                </span>
            )}
            
            <Link to={`/productos/${producto.id}`}>
                <div className="text-center bg-light rounded-top position-relative" style={{ overflow: 'hidden', height: '180px' }}>
                    {producto.imagen ? (
                        <img 
                            src={producto.imagen} 
                            alt={producto.nombre} 
                            className="w-100 h-100 img-zoom" 
                            style={{ objectFit: 'cover' }} 
                            onError={(e) => {
                                // En caso de error, ocultar imagen y mostrar emoji
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                            }}
                        />
                    ) : null}
                    <div 
                        style={{ height: '180px', display: producto.imagen ? 'none' : 'flex' }} 
                        className="align-items-center justify-content-center bg-light text-center w-100"
                    >
                        <span className="fs-1">{getEmojiPorCategoria(producto.categoria)}</span>
                    </div>
                </div>
            </Link>
            
            <div className={`card-body d-flex flex-column ${isDestacado ? 'text-center' : ''}`}>
                <span className={`badge bg-secondary mb-2 ${isDestacado ? 'align-self-center' : 'align-self-start'}`}>
                    {producto.categoria}
                </span>
                
                <Link to={`/productos/${producto.id}`} className="text-decoration-none text-dark hover-green">
                    <h5 className="card-title text-dark fw-bold mb-1">{producto.nombre}</h5>
                </Link>
                
                {isDestacado ? (
                    // Vista destacada (Home)
                    <div className="mt-auto">
                        <div className="mb-3">
                            <span className="fw-bold text-success fs-5">
                                ${producto.precio.toLocaleString("es-CL")} CLP
                            </span>
                            {producto.esOferta && (
                                <span className="text-xs text-decoration-line-through text-muted ms-2">
                                    ${producto.precioAnterior?.toLocaleString("es-CL")}
                                </span>
                            )}
                        </div>
                        <Link to={`/productos/${producto.id}`} className="btn btn-sm btn-outline-success w-100">
                            Ver Detalle
                        </Link>
                    </div>
                ) : (
                    // Vista catálogo completo
                    <>
                        <p className="card-text text-muted text-truncate">{producto.descripcion}</p>
                        <div className="mt-auto">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div>
                                    <span className="fw-bold fs-5 text-success">
                                        ${producto.precio.toLocaleString("es-CL")} CLP
                                    </span>
                                    {producto.esOferta && (
                                        <div className="text-xs text-decoration-line-through text-muted">
                                            ${producto.precioAnterior?.toLocaleString("es-CL")}
                                        </div>
                                    )}
                                </div>
                                <span className="text-xs text-muted">Stock: {stockDisponible}</span>
                            </div>
                            <div className="row g-2 mt-2">
                                <div className="col-6">
                                    <Link className="btn btn-sm btn-outline-secondary w-100" to={`/productos/${producto.id}`}>
                                        Ver Detalle
                                    </Link>
                                </div>
                                <div className="col-6">
                                    <button 
                                        className="btn btn-sm btn-primary-hh w-100" 
                                        onClick={handleAgregar}
                                        disabled={stockDisponible <= 0}
                                    >
                                        {stockDisponible <= 0 ? 'Sin Stock' : 'Añadir'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

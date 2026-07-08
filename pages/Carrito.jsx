import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function Carrito() {
    const { 
        carrito, 
        productos, 
        eliminarDelCarrito, 
        cambiarCantidadItem,
        actualizarCantidadItem,
        mostrarNotificacion
    } = useContext(AppContext);

    const navigate = useNavigate();
    const [tempValues, setTempValues] = useState({});

    // Enlazar los items del carrito con los detalles del catálogo
    const itemsCompletos = carrito.map(item => {
        const prod = productos.find(p => p.id === item.id);
        return {
            ...item,
            producto: prod
        };
    }).filter(item => item.producto !== undefined);

    // Calcular subtotal de compra
    const subtotal = itemsCompletos.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);

    const handleProcederPago = () => {
        if (carrito.length === 0) return;
        navigate('/checkout');
    };

    return (
        <div className="container py-5">
            {/* Breadcrumb */}
            <div className="row mb-3">
                <div className="col-12">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/" className="text-success text-decoration-none">Inicio</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Carrito de Compras</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Cabecera */}
            <div className="py-4 bg-light border rounded-3 mb-5 text-center">
                <h1 className="display-5 fw-bold" style={{ color: 'var(--hh-secondary)' }}>Tu Carrito de Compras</h1>
                <p className="text-muted">Revisa tus productos seleccionados y procede al pago del despacho.</p>
            </div>

            {/* Cuerpo del Carrito */}
            <div className="row g-4">
                {/* Tabla de Productos */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm p-3 bg-white border">
                        <h5 className="fw-bold mb-3" style={{ color: 'var(--hh-secondary)' }}>
                            <i className="fa-solid fa-basket-shopping text-success me-2"></i> Productos Seleccionados
                        </h5>
                        
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr className="table-light text-muted">
                                        <th scope="col">Producto</th>
                                        <th scope="col">Precio Unitario</th>
                                        <th scope="col">Cantidad</th>
                                        <th scope="col">Subtotal</th>
                                        <th scope="col" className="text-center">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsCompletos.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-5 text-muted">
                                                <i className="fa-solid fa-cart-flatbed fs-1 d-block mb-3"></i>
                                                No hay productos en tu carrito.{" "}
                                                <Link to="/productos" className="text-success fw-bold text-decoration-none">
                                                    Ir al catálogo de productos
                                                </Link>
                                            </td>
                                        </tr>
                                    ) : (
                                        itemsCompletos.map(item => {
                                            const itemSubtotal = item.producto.precio * item.cantidad;
                                            return (
                                                <tr key={item.id}>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <span className="fs-4">
                                                                {item.producto.imagen ? null : '🥬'}
                                                            </span>
                                                            <div>
                                                                <Link to={`/productos/${item.id}`} className="fw-bold text-dark text-decoration-none hover-green">
                                                                    {item.producto.nombre}
                                                                </Link>
                                                                <br />
                                                                <small className="text-muted">Cód: {item.id}</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>${item.producto.precio.toLocaleString("es-CL")} CLP</td>
                                                    <td>
                                                        <div className="input-group input-group-sm" style={{ width: '100px' }}>
                                                            <button 
                                                                className="btn btn-outline-secondary" 
                                                                type="button" 
                                                                onClick={() => cambiarCantidadItem(item.id, -1)}
                                                            >
                                                                -
                                                            </button>
                                                             <input 
                                                                 type="text" 
                                                                 className="form-control text-center" 
                                                                 value={tempValues[item.id] !== undefined ? tempValues[item.id] : item.cantidad}
                                                                 onChange={(e) => {
                                                                     const val = e.target.value;
                                                                     if (val === '' || /^\d+$/.test(val)) {
                                                                         setTempValues(prev => ({ ...prev, [item.id]: val }));
                                                                         const parsed = parseInt(val, 10);
                                                                         if (!isNaN(parsed) && parsed > 0) {
                                                                             const maxStock = item.producto.stock;
                                                                             if (parsed > maxStock) {
                                                                                 mostrarNotificacion(`Sólo quedan ${maxStock} unidades disponibles en el inventario.`, 'warning');
                                                                                 actualizarCantidadItem(item.id, maxStock);
                                                                                 setTempValues(prev => ({ ...prev, [item.id]: String(maxStock) }));
                                                                             } else {
                                                                                 actualizarCantidadItem(item.id, parsed);
                                                                             }
                                                                         }
                                                                     }
                                                                 }}
                                                                 onBlur={() => {
                                                                     const val = tempValues[item.id];
                                                                     if (val !== undefined) {
                                                                         const parsed = parseInt(val, 10);
                                                                         if (isNaN(parsed) || parsed <= 0) {
                                                                             actualizarCantidadItem(item.id, 1);
                                                                         }
                                                                         setTempValues(prev => {
                                                                             const copy = { ...prev };
                                                                             delete copy[item.id];
                                                                             return copy;
                                                                         });
                                                                     }
                                                                 }}
                                                                 onKeyDown={(e) => {
                                                                     if (e.key === 'Enter') {
                                                                         e.target.blur();
                                                                     }
                                                                 }}
                                                             />
                                                            <button 
                                                                className="btn btn-outline-secondary" 
                                                                type="button" 
                                                                onClick={() => {
                                                                    if (item.cantidad >= item.producto.stock) {
                                                                        mostrarNotificacion('Ya no queda stock de este producto.', 'warning');
                                                                    } else {
                                                                        cambiarCantidadItem(item.id, 1);
                                                                        if (item.cantidad + 1 === item.producto.stock) {
                                                                            mostrarNotificacion('Ya no queda stock de este producto.', 'warning');
                                                                        }
                                                                    }
                                                                }}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="fw-semibold">${itemSubtotal.toLocaleString("es-CL")} CLP</td>
                                                    <td className="text-center">
                                                        <button 
                                                            className="btn btn-sm btn-outline-danger" 
                                                            onClick={() => eliminarDelCarrito(item.id)}
                                                            title="Eliminar del carrito"
                                                        >
                                                            <i className="fa-solid fa-trash-can"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Resumen del Pedido */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm p-4 bg-light border rounded-4">
                        <h5 className="fw-bold border-bottom pb-2 mb-3" style={{ color: 'var(--hh-secondary)' }}>Resumen del Pedido</h5>
                        <div className="d-flex justify-content-between mb-2">
                            <span>Subtotal:</span>
                            <span className="fw-semibold">${subtotal.toLocaleString("es-CL")} CLP</span>
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                            <span>Despacho:</span>
                            <span className="text-success fw-semibold">¡GRATIS!</span>
                        </div>
                        <div className="d-flex justify-content-between fs-5 fw-bold border-top pt-2 mb-4">
                            <span>Total:</span>
                            <span className="text-success">${subtotal.toLocaleString("es-CL")} CLP</span>
                        </div>
                        
                        <button 
                            className="btn btn-primary-hh btn-lg w-100 py-3 shadow-sm"
                            disabled={carrito.length === 0}
                            onClick={handleProcederPago}
                        >
                            <i className="fa-solid fa-credit-card me-2"></i> Proceder al Pago
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

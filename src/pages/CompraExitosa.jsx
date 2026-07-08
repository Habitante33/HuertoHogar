import React, { useContext, useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function CompraExitosa() {
    const location = useLocation();
    const { ordenes } = useContext(AppContext);
    const [orden, setOrden] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const orderId = params.get('orderId');
        if (orderId) {
            const found = ordenes.find(o => o.id === orderId);
            if (found) {
                setOrden(found);
            }
        }
    }, [location.search, ordenes]);

    return (
        <div className="container py-5 text-center" style={{ maxWidth: '650px' }}>
            <div className="card shadow border-0 rounded-4 p-5 bg-white border">
                <div className="text-success fs-1 mb-3">
                    <i className="fa-solid fa-circle-check fa-bounce"></i>
                </div>
                <h2 className="fw-bold mb-2" style={{ color: 'var(--hh-secondary)' }}>¡Compra Realizada con Éxito!</h2>
                <p className="text-muted small mb-4">
                    Tu transacción simulada ha finalizado de forma correcta. Hemos registrado tu pedido y vaciado tu carrito de compras.
                </p>

                {orden ? (
                    <div className="p-4 border rounded-3 bg-light text-start mb-4">
                        <h5 className="fw-bold text-success border-bottom pb-2 mb-3">Detalle del Pedido</h5>
                        <div className="mb-2">
                            <span className="fw-bold text-muted small d-block">ID de Transacción</span>
                            <span className="fw-bold text-dark">{orden.id}</span>
                        </div>
                        <div className="row mb-2">
                            <div className="col-6">
                                <span className="fw-bold text-muted small d-block">Fecha</span>
                                <span>{orden.fecha}</span>
                            </div>
                            <div className="col-6">
                                <span className="fw-bold text-muted small d-block">Destinatario</span>
                                <span>{orden.cliente.nombre}</span>
                            </div>
                        </div>
                        <div className="mb-3">
                            <span className="fw-bold text-muted small d-block">Dirección de Despacho</span>
                            <span>{orden.cliente.direccion}, {orden.cliente.comuna}, {orden.cliente.region}</span>
                        </div>

                        <span className="fw-bold text-muted small d-block mb-2">Productos</span>
                        <ul className="list-unstyled border-top pt-2">
                            {orden.items.map(item => (
                                <li key={item.id} className="d-flex justify-content-between align-items-center py-1">
                                    <span>🍏 {item.nombre} <small className="text-muted">({item.cantidad} unidades)</small></span>
                                    <span className="fw-semibold">${(item.precio * item.cantidad).toLocaleString("es-CL")} CLP</span>
                                </li>
                            ))}
                        </ul>
                        <div className="d-flex justify-content-between fw-bold fs-5 border-top pt-2 mt-3 text-success">
                            <span>Total Pagado:</span>
                            <span>${orden.total.toLocaleString("es-CL")} CLP</span>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 border rounded-3 bg-light text-start mb-4">
                        Cargando información del comprobante...
                    </div>
                )}

                <div className="d-flex flex-column gap-2">
                    <Link to="/" className="btn btn-primary-hh btn-lg fs-6 shadow-sm">
                        Volver al Inicio
                    </Link>
                    <Link to="/productos" className="btn btn-outline-success">
                        Seguir Comprando
                    </Link>
                </div>
            </div>
        </div>
    );
}

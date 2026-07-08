import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import storageService from '../../services/storageService';

export default function AdminOrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orden, setOrden] = useState(null);

    useEffect(() => {
        const found = storageService.orders.getById(id);
        setOrden(found);
    }, [id]);

    if (!orden) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning">No se encontró la orden solicitada.</div>
                <button className="btn btn-outline-success" onClick={() => navigate('/admin')}>
                    Volver al panel
                </button>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark mb-1">Boleta de compra</h2>
                    <p className="text-muted small mb-0">Detalle completo de la orden {orden.id}</p>
                </div>
                <button className="btn btn-outline-success" onClick={() => navigate('/admin')}>
                    Volver al listado
                </button>
            </div>

            <div className="card shadow-sm border-0 rounded-4 p-4">
                <div className="row mb-3">
                    <div className="col-md-6">
                        <p className="mb-1 text-muted small">Código</p>
                        <h5 className="fw-bold text-success">{orden.id}</h5>
                    </div>
                    <div className="col-md-6 text-md-end">
                        <p className="mb-1 text-muted small">Fecha</p>
                        <h5 className="fw-bold">{orden.fecha}</h5>
                    </div>
                </div>

                <div className="border rounded-3 p-3 mb-4 bg-light">
                    <h6 className="fw-bold mb-3">Datos del cliente</h6>
                    <p className="mb-1"><strong>Nombre:</strong> {orden.cliente?.nombre}</p>
                    <p className="mb-1"><strong>RUN:</strong> {orden.clienteRun || 'N/A'}</p>
                    <p className="mb-1"><strong>Dirección:</strong> {orden.cliente?.direccion}</p>
                    <p className="mb-0"><strong>Comuna / Región:</strong> {orden.cliente?.comuna}, {orden.cliente?.region}</p>
                </div>

                <div className="table-responsive">
                    <table className="table table-bordered align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio unitario</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orden.items?.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.nombre}</td>
                                    <td>{item.cantidad}</td>
                                    <td>${item.precio?.toLocaleString('es-CL')} CLP</td>
                                    <td>${(item.precio * item.cantidad).toLocaleString('es-CL')} CLP</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3 border-top pt-3">
                    <span className="fw-bold">Total pagado</span>
                    <span className="fw-bold text-success fs-5">${orden.total?.toLocaleString('es-CL')} CLP</span>
                </div>
            </div>

            <div className="mt-3">
                <Link to="/admin" className="btn btn-outline-secondary btn-sm">
                    Ir al panel administrativo
                </Link>
            </div>
        </div>
    );
}

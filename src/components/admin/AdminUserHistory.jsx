import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import storageService from '../../services/storageService';

export default function AdminUserHistory() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [ordenes, setOrdenes] = useState([]);

    useEffect(() => {
        const foundUser = storageService.users.getById(id);
        setUsuario(foundUser);

        const allOrders = storageService.orders.getAll();
        const filtered = allOrders.filter((order) => String(order.clienteRun) === String(id));
        setOrdenes(filtered);
    }, [id]);

    const historialOrdenado = useMemo(() => {
        return [...ordenes].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    }, [ordenes]);

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark mb-1">Historial de compras</h2>
                    <p className="text-muted small mb-0">
                        {usuario ? `Compras registradas para ${usuario.nombre} ${usuario.apellidos}` : 'Cargando usuario...'}
                    </p>
                </div>
                <button className="btn btn-outline-success" onClick={() => navigate('/admin')}>
                    Volver al panel
                </button>
            </div>

            <div className="card shadow-sm border-0 rounded-4 p-3">
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Orden</th>
                                <th>Fecha</th>
                                <th>Productos</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historialOrdenado.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-4 text-muted">
                                        No hay compras registradas para este usuario.
                                    </td>
                                </tr>
                            ) : (
                                historialOrdenado.map((orden) => (
                                    <tr key={orden.id}>
                                        <td className="fw-bold text-success">{orden.id}</td>
                                        <td>{orden.fecha}</td>
                                        <td>
                                            <ul className="mb-0 ps-3">
                                                {orden.items?.map((item) => (
                                                    <li key={`${orden.id}-${item.id}`}>
                                                        {item.nombre} ({item.cantidad}x)
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="fw-bold">${orden.total?.toLocaleString('es-CL')} CLP</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
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

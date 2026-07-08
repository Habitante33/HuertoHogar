import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminOrders({ ordenes, boletaOrden, setBoletaOrden, mostrarNotificacion }) {
    const navigate = useNavigate();
    return (
        <div>
            <div className="mb-4">
                <h2 className="fw-bold text-dark mb-1">Registro de Pedidos</h2>
                <p className="text-muted small">Gestión y visualización de boletas de compra.</p>
            </div>

            <div className="card border-0 shadow-sm p-3 bg-white border rounded-3">
                <div className="table-responsive">
                    <table className="table align-middle table-hover">
                        <thead>
                            <tr className="table-light text-muted small">
                                <th>Código</th>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th>Dirección de Despacho</th>
                                <th>Total</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordenes.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-muted">No hay órdenes registradas.</td>
                                </tr>
                            ) : (
                                [...ordenes].reverse().map(orden => (
                                    <tr key={orden.id}>
                                        <td className="fw-bold text-success">{orden.id}</td>
                                        <td>{orden.fecha}</td>
                                        <td>
                                            <span className="fw-bold d-block">{orden.cliente.nombre}</span>
                                            {orden.clienteRun && <span className="small text-muted">{orden.clienteRun}</span>}
                                        </td>
                                        <td className="small text-muted">
                                            {orden.cliente.direccion}, {orden.cliente.comuna}, {orden.cliente.region}
                                        </td>
                                        <td className="fw-bold text-success">${orden.total.toLocaleString("es-CL")} CLP</td>
                                        <td>
                                            <button 
                                                className="btn btn-xs btn-outline-success d-flex align-items-center gap-1"
                                                onClick={() => navigate(`/admin/orders/${orden.id}`)}
                                            >
                                                <i className="fa-solid fa-receipt"></i> Mostrar Boleta
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL DETALLE BOLETA */}
            {boletaOrden && (
                <>
                    <div className="modal-backdrop fade show" onClick={() => setBoletaOrden(null)}></div>
                    <div className="modal fade show" style={{ display: 'block', zIndex: 1060 }} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content shadow-lg border-0">
                                <div className="modal-header bg-dark text-white py-2">
                                    <h6 className="modal-title fw-bold">BOLETA ELECTRÓNICA DE COMPRA</h6>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setBoletaOrden(null)}></button>
                                </div>
                                <div className="modal-body p-4 bg-light font-monospace" style={{ fontSize: '0.85rem' }}>
                                    <div className="text-center mb-3">
                                        <h5 className="fw-bold mb-0">HUERTO HOGAR CHILE LTDA.</h5>
                                        <p className="mb-0 small text-muted">Directo del campo a tu hogar</p>
                                        <p className="mb-0 small text-muted">R.U.T.: 76.543.210-K</p>
                                    </div>
                                    
                                    <div className="border-top border-bottom py-2 my-2">
                                        <div><strong>BOLETA N°:</strong> {boletaOrden.id}</div>
                                        <div><strong>FECHA:</strong> {boletaOrden.fecha}</div>
                                        <div><strong>CLIENTE:</strong> {boletaOrden.cliente.nombre}</div>
                                        <div><strong>RUN:</strong> {boletaOrden.clienteRun || 'N/A'}</div>
                                        <div><strong>DESPACHO:</strong> {boletaOrden.cliente.direccion}, {boletaOrden.cliente.comuna}, {boletaOrden.cliente.region}</div>
                                    </div>

                                    <table className="table table-sm table-borderless my-3">
                                        <thead>
                                            <tr className="border-bottom text-uppercase small" style={{ fontSize: '0.75rem' }}>
                                                <th>Detalle</th>
                                                <th className="text-center">Cant.</th>
                                                <th className="text-end">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {boletaOrden.items.map(item => (
                                                <tr key={item.id}>
                                                    <td>{item.nombre}</td>
                                                    <td className="text-center">{item.cantidad}</td>
                                                    <td className="text-end">${(item.precio * item.cantidad).toLocaleString("es-CL")}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <div className="border-top pt-3 d-flex flex-column align-items-end" style={{ fontSize: '0.85rem' }}>
                                        <div>Monto Neto: <strong>${Math.round(boletaOrden.total / 1.19).toLocaleString("es-CL")}</strong></div>
                                        <div>I.V.A. (19%): <strong>${Math.round(boletaOrden.total - (boletaOrden.total / 1.19)).toLocaleString("es-CL")}</strong></div>
                                        <div className="fs-6 fw-bold text-success mt-1">TOTAL COMPRA: ${boletaOrden.total.toLocaleString("es-CL")} CLP</div>
                                    </div>

                                    <div className="text-center mt-4 pt-3 border-top text-muted small" style={{ fontSize: '0.7rem' }}>
                                        ¡Gracias por preferir a HuertoHogar!
                                        <br />
                                        Comprobante tributario simulado.
                                    </div>
                                </div>
                                <div className="modal-footer bg-light py-2">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary btn-sm" 
                                        onClick={() => setBoletaOrden(null)}
                                    >
                                        Cerrar
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-success btn-sm" 
                                        onClick={() => {
                                            mostrarNotificacion(`Simulando impresión de boleta ${boletaOrden.id}...`, "success");
                                            setBoletaOrden(null);
                                        }}
                                    >
                                        <i className="fa-solid fa-print"></i> Simular Impresión
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

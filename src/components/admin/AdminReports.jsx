import React from 'react';
import { getShortLabel } from '../TarjetaProducto';

export default function AdminReports({ ordenes, ventasPorCategoria, maxVentaCat, productos, usuarios }) {
    const totalVendido = ordenes.reduce((sum, o) => sum + o.total, 0);
    const totalCantidadVendida = ordenes.reduce((sum, o) => sum + o.items.reduce((s, it) => s + it.cantidad, 0), 0);
    const ticketPromedio = ordenes.length > 0 ? Math.round(totalVendido / ordenes.length) : 0;
    const stockCriticoSKUs = productos.filter(p => p.stock <= p.stockCritico).length;

    return (
        <div>
            <div className="mb-4">
                <h2 className="fw-bold text-dark mb-1">Reportes y Estadísticas</h2>
                <p className="text-muted small">Generación de informes detallados del sistema.</p>
            </div>

            <div className="row g-4">
                {/* Ventas por Categoría */}
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm p-4 bg-white border h-100 rounded-3">
                        <h5 className="fw-bold mb-4 text-dark">
                            <i className="fa-solid fa-chart-bar text-success me-2"></i>Ventas por Categoría ($ CLP)
                        </h5>
                        <div className="d-flex flex-column gap-3">
                            {ventasPorCategoria.map(v => {
                                const porcentaje = (v.total / maxVentaCat) * 100;
                                return (
                                    <div key={v.categoria}>
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <span className="small fw-bold text-muted">{getShortLabel(v.categoria)}</span>
                                            <span className="small fw-bold text-success">${v.total.toLocaleString("es-CL")}</span>
                                        </div>
                                        <div className="progress" style={{ height: '10px', borderRadius: '5px' }}>
                                            <div 
                                                className="progress-bar bg-success" 
                                                role="progressbar" 
                                                style={{ width: `${porcentaje}%`, borderRadius: '5px' }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Resumen del Negocio */}
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm p-4 bg-white border h-100 rounded-3">
                        <h5 className="fw-bold mb-4 text-dark">
                            <i className="fa-solid fa-chart-pie text-success me-2"></i>Resumen General
                        </h5>
                        <div className="row g-3">
                            <div className="col-6">
                                <div className="p-3 border rounded text-center bg-light">
                                    <span className="text-muted small d-block mb-1">Ingresos Totales</span>
                                    <h4 className="fw-bold text-success">
                                        ${totalVendido.toLocaleString("es-CL")}
                                    </h4>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-3 border rounded text-center bg-light">
                                    <span className="text-muted small d-block mb-1">Productos Vendidos</span>
                                    <h4 className="fw-bold text-success">{totalCantidadVendida}</h4>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-3 border rounded text-center bg-light">
                                    <span className="text-muted small d-block mb-1">Ticket Promedio</span>
                                    <h4 className="fw-bold text-success">
                                        ${ticketPromedio.toLocaleString("es-CL")}
                                    </h4>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-3 border rounded text-center bg-light">
                                    <span className="text-muted small d-block mb-1">Tasa Crítica Stock</span>
                                    <h4 className="fw-bold text-danger">{stockCriticoSKUs} SKU</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

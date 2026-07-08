import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard({ 
    ordenes, 
    productos, 
    usuarios, 
    totalStockFisico, 
    rolSimulado, 
    setTabActiva, 
    mostrarNotificacion 
}) {
    const totalClientes = usuarios.filter(u => u.tipo === 'Cliente').length;

    return (
        <div>
            <div className="mb-4">
                <h1 className="fw-bold text-dark mb-1">Dashboard</h1>
                <p className="text-muted small">Resumen de las actividades diarias</p>
            </div>

            {/* 3 Tarjetas de Estadísticas */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 mb-4">
                {/* Compras Card (Blue) */}
                <div className="col">
                    <div className="card text-white border-0 shadow-sm p-3 h-100 rounded-3" style={{ background: 'linear-gradient(135deg, #1e90ff, #0052cc)' }}>
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <p className="mb-1 text-uppercase fw-bold small text-white-50">Compras</p>
                                <h2 className="fw-bold mb-0">{ordenes.length}</h2>
                            </div>
                            <span className="fs-1 text-white-50"><i className="fa-solid fa-cart-shopping"></i></span>
                        </div>
                        <p className="small mb-0 mt-3 pt-2 border-top border-white-10">Total de pedidos procesados</p>
                    </div>
                </div>

                {/* Productos Card (Green) */}
                <div className="col">
                    <div className="card text-white border-0 shadow-sm p-3 h-100 rounded-3" style={{ background: 'linear-gradient(135deg, #2e8b57, #195b37)' }}>
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <p className="mb-1 text-uppercase fw-bold small text-white-50">Productos</p>
                                <h2 className="fw-bold mb-0">{productos.length}</h2>
                            </div>
                            <span className="fs-1 text-white-50"><i className="fa-solid fa-box-open"></i></span>
                        </div>
                        <p className="small mb-0 mt-3 pt-2 border-top border-white-10">Inventario total actual: {totalStockFisico} unid.</p>
                    </div>
                </div>

                {/* Usuarios Card (Yellow) */}
                <div className="col">
                    <div className="card text-dark border-0 shadow-sm p-3 h-100 rounded-3" style={{ background: 'linear-gradient(135deg, #ffc107, #d39e00)' }}>
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <p className="mb-1 text-uppercase fw-bold small text-black-50">Usuarios</p>
                                <h2 className="fw-bold mb-0">{usuarios.length}</h2>
                            </div>
                            <span className="fs-1 text-black-50"><i className="fa-solid fa-users"></i></span>
                        </div>
                        <p className="small mb-0 mt-3 pt-2 border-top border-black-10 text-dark-50">Clientes registrados: {totalClientes}</p>
                    </div>
                </div>
            </div>

            {/* Grilla de 8 Atajos Directos */}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
                {/* Atajo Dashboard */}
                <div className="col">
                    <div className="card border-0 shadow-sm p-3 h-100 hover-shadow cursor-pointer rounded-3 text-center bg-white border" onClick={() => setTabActiva('dashboard')}>
                        <div className="fs-2 text-info mb-2"><i className="fa-solid fa-gauge-high"></i></div>
                        <h6 className="fw-bold mb-1">Dashboard</h6>
                        <p className="text-muted small mb-0">Vista general de todas las métricas y estadísticas.</p>
                    </div>
                </div>
                {/* Atajo Ordenes */}
                <div className="col">
                    <div className="card border-0 shadow-sm p-3 h-100 hover-shadow cursor-pointer rounded-3 text-center bg-white border" onClick={() => setTabActiva('ordenes')}>
                        <div className="fs-2 text-primary mb-2"><i className="fa-solid fa-file-invoice-dollar"></i></div>
                        <h6 className="fw-bold mb-1">Órdenes</h6>
                        <p className="text-muted small mb-0">Gestión y seguimiento de todas las compras.</p>
                    </div>
                </div>
                {/* Atajo Productos */}
                <div className="col">
                    <div className="card border-0 shadow-sm p-3 h-100 hover-shadow cursor-pointer rounded-3 text-center bg-white border" onClick={() => setTabActiva('productos')}>
                        <div className="fs-2 text-success mb-2"><i className="fa-solid fa-apple-whole"></i></div>
                        <h6 className="fw-bold mb-1">Productos</h6>
                        <p className="text-muted small mb-0">Administrar catálogo e inventario físico.</p>
                    </div>
                </div>
                {/* Atajo Categorias */}
                <div className="col">
                    <div className="card border-0 shadow-sm p-3 h-100 hover-shadow cursor-pointer rounded-3 text-center bg-white border" onClick={() => setTabActiva('categorias')}>
                        <div className="fs-2 text-warning mb-2"><i className="fa-solid fa-tags"></i></div>
                        <h6 className="fw-bold mb-1">Categorías</h6>
                        <p className="text-muted small mb-0">Organizar productos en grupos de ventas.</p>
                    </div>
                </div>
                {/* Atajo Usuarios */}
                <div className="col">
                    <div className="card border-0 shadow-sm p-3 h-100 hover-shadow cursor-pointer rounded-3 text-center bg-white border" onClick={() => {
                        if (rolSimulado === 'Administrador') setTabActiva('usuarios');
                        else mostrarNotificacion("Acceso exclusivo para Administradores.", "warning");
                    }}>
                        <div className="fs-2 text-danger mb-2"><i className="fa-solid fa-users-gear"></i></div>
                        <h6 className="fw-bold mb-1">Usuarios</h6>
                        <p className="text-muted small mb-0">Gestión de cuentas y asignación de roles.</p>
                    </div>
                </div>
                {/* Atajo Reportes */}
                <div className="col">
                    <div className="card border-0 shadow-sm p-3 h-100 hover-shadow cursor-pointer rounded-3 text-center bg-white border" onClick={() => setTabActiva('reportes')}>
                        <div className="fs-2 text-secondary mb-2"><i className="fa-solid fa-square-poll-vertical"></i></div>
                        <h6 className="fw-bold mb-1">Reportes</h6>
                        <p className="text-muted small mb-0">Generar informes y estadísticas de ventas.</p>
                    </div>
                </div>
                {/* Atajo Perfil */}
                <div className="col">
                    <div className="card border-0 shadow-sm p-3 h-100 hover-shadow cursor-pointer rounded-3 text-center bg-white border" onClick={() => setTabActiva('perfil')}>
                        <div className="fs-2 text-dark mb-2"><i className="fa-solid fa-id-card-clip"></i></div>
                        <h6 className="fw-bold mb-1">Perfil</h6>
                        <p className="text-muted small mb-0">Administración de datos del personal.</p>
                    </div>
                </div>
                {/* Atajo Tienda */}
                <div className="col">
                    <Link to="/" className="card border-0 shadow-sm p-3 h-100 hover-shadow cursor-pointer rounded-3 text-center bg-white border text-decoration-none text-dark">
                        <div className="fs-2 text-success mb-2"><i className="fa-solid fa-store"></i></div>
                        <h6 className="fw-bold mb-1">Tienda</h6>
                        <p className="text-muted small mb-0">Visualiza la tienda en tiempo real.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}

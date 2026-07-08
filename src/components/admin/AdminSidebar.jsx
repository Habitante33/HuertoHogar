import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminSidebar({ tabActiva, setTabActiva, usuarioSesion, rolSimulado, logout, navigate }) {
    return (
        <div 
            className="bg-light border-end d-flex flex-column justify-content-between p-3 flex-shrink-0 shadow-sm"
            style={{ width: '250px', minHeight: '100vh' }}
        >
            <div>
                {/* Perfil del Staff */}
                <div className="text-center py-4 border-bottom mb-4">
                    <div 
                        className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center mx-auto mb-2 shadow"
                        style={{ width: '60px', height: '60px', fontSize: '1.6rem', fontWeight: 'bold' }}
                    >
                        {usuarioSesion ? usuarioSesion.nombre.charAt(0) : 'A'}
                    </div>
                    <h6 className="fw-bold mb-0 text-dark">
                        {usuarioSesion ? `${usuarioSesion.nombre} ${usuarioSesion.apellidos}` : 'Usuario Staff'}
                    </h6>
                    <span className="badge bg-success small mt-1">{rolSimulado}</span>
                </div>

                {/* Navegadores del Sidebar */}
                <ul className="nav nav-pills flex-column mb-auto gap-1">
                    <li className="nav-item">
                        <button 
                            className={`nav-link w-100 text-start fw-semibold py-2 px-3 border-0 d-flex align-items-center gap-2 ${tabActiva === 'dashboard' ? 'active bg-success text-white shadow-sm' : 'text-secondary bg-transparent'}`}
                            onClick={() => setTabActiva('dashboard')}
                        >
                            <i className="fa-solid fa-chart-line"></i> Dashboard
                        </button>
                    </li>
                    <li className="nav-item">
                        <button 
                            className={`nav-link w-100 text-start fw-semibold py-2 px-3 border-0 d-flex align-items-center gap-2 ${tabActiva === 'ordenes' ? 'active bg-success text-white shadow-sm' : 'text-secondary bg-transparent'}`}
                            onClick={() => setTabActiva('ordenes')}
                        >
                            <i className="fa-solid fa-file-invoice"></i> Órdenes
                        </button>
                    </li>
                    <li className="nav-item">
                        <button 
                            className={`nav-link w-100 text-start fw-semibold py-2 px-3 border-0 d-flex align-items-center gap-2 ${tabActiva === 'productos' ? 'active bg-success text-white shadow-sm' : 'text-secondary bg-transparent'}`}
                            onClick={() => setTabActiva('productos')}
                        >
                            <i className="fa-solid fa-cubes"></i> Productos
                        </button>
                    </li>
                    <li className="nav-item">
                        <button 
                            className={`nav-link w-100 text-start fw-semibold py-2 px-3 border-0 d-flex align-items-center gap-2 ${tabActiva === 'categorias' ? 'active bg-success text-white shadow-sm' : 'text-secondary bg-transparent'}`}
                            onClick={() => setTabActiva('categorias')}
                        >
                            <i className="fa-solid fa-list"></i> Categorías
                        </button>
                    </li>
                    {rolSimulado === 'Administrador' && (
                        <li className="nav-item">
                            <button 
                                className={`nav-link w-100 text-start fw-semibold py-2 px-3 border-0 d-flex align-items-center gap-2 ${tabActiva === 'usuarios' ? 'active bg-success text-white shadow-sm' : 'text-secondary bg-transparent'}`}
                                onClick={() => setTabActiva('usuarios')}
                            >
                                <i className="fa-solid fa-users"></i> Usuarios
                            </button>
                        </li>
                    )}
                    <li className="nav-item">
                        <button 
                            className={`nav-link w-100 text-start fw-semibold py-2 px-3 border-0 d-flex align-items-center gap-2 ${tabActiva === 'reportes' ? 'active bg-success text-white shadow-sm' : 'text-secondary bg-transparent'}`}
                            onClick={() => setTabActiva('reportes')}
                        >
                            <i className="fa-solid fa-chart-pie"></i> Reportes
                        </button>
                    </li>
                    <li className="nav-item border-top mt-2 pt-2">
                        <button 
                            className={`nav-link w-100 text-start fw-semibold py-2 px-3 border-0 d-flex align-items-center gap-2 ${tabActiva === 'perfil' ? 'active bg-success text-white shadow-sm' : 'text-secondary bg-transparent'}`}
                            onClick={() => setTabActiva('perfil')}
                        >
                            <i className="fa-solid fa-user-gear"></i> Perfil
                        </button>
                    </li>
                </ul>
            </div>

            {/* Botones inferiores del Sidebar */}
            <div className="d-flex flex-column gap-2 mt-4">
                <Link to="/" className="btn btn-dark w-100 py-2 d-flex align-items-center justify-content-center gap-2 text-decoration-none text-white small">
                    <i className="fa-solid fa-store"></i> Ver Tienda
                </Link>
                <button 
                    onClick={() => {
                        logout();
                        navigate('/');
                    }} 
                    className="btn btn-danger w-100 py-2 d-flex align-items-center justify-content-center gap-2 small"
                >
                    <i className="fa-solid fa-door-open"></i> Cerrar Sesión
                </button>
            </div>
        </div>
    );
}

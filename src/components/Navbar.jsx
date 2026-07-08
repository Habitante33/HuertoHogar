import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function Navbar() {
    const {
        carrito,
        usuarioSesion,
        rolSimulado,
        cambiarRolSimulado,
        logout
    } = useContext(AppContext);

    // Calcular cantidad total de ítems en el carrito
    const totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 0), 0);

    return (
        <nav className="navbar navbar-expand-lg navbar-hh sticky-top py-3">
            <div className="container">
                <Link className="navbar-brand navbar-brand-hh d-flex align-items-center gap-2" to="/">
                    <img 
                        src="/src/assets/imagenes/logoHuerto.jpeg" 
                        alt="Logo HuertoHogar" 
                        style={{ height: '40px', borderRadius: '6px', objectFit: 'cover' }} 
                    />
                    <span className="fs-4 fw-bold" style={{ color: 'var(--hh-secondary)' }}>HuertoHogar</span>
                </Link>
                
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link nav-link-hh" to="/" end>
                                Inicio
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link nav-link-hh" to="/productos">
                                Productos
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link nav-link-hh" to="/nosotros">
                                Nosotros
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link nav-link-hh" to="/blog">
                                Blog
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link nav-link-hh" to="/contacto">
                                Contacto
                            </NavLink>
                        </li>
                        
                        {/* Enlace al Panel Admin - Visible para Administradores y Vendedores */}
                        {rolSimulado !== 'Cliente' && (
                            <li className="nav-item">
                                <NavLink className="nav-link nav-link-hh fw-bold text-success" to="/admin">
                                    Admin Panel
                                </NavLink>
                            </li>
                        )}
                    </ul>
                    
                    <div className="d-flex align-items-center gap-3">
                        {/* Carrito Badge */}
                        <Link to="/carrito" className="btn btn-outline-success position-relative px-3 flex-shrink-0" id="nav-carrito-btn">
                            <i className="fa-solid fa-cart-shopping"></i>
                            {totalItems > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                        
                        {/* Botón Mi Cuenta / Mi Perfil */}
                        {usuarioSesion ? (
                            <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                <Link to="/perfil" className="btn btn-primary-hh text-nowrap flex-shrink-0">
                                    <i className="fa-solid fa-user-pen me-1"></i> Mi Perfil
                                </Link>
                                <button onClick={logout} className="btn btn-outline-danger flex-shrink-0">
                                    <i className="fa-solid fa-right-from-bracket"></i>
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-primary-hh text-nowrap flex-shrink-0" id="nav-login-btn">
                                <i className="fa-solid fa-user me-1"></i> Mi Cuenta
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ToastContainer from './ToastContainer';

export default function Layout() {
    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Barra de navegación global */}
            <Navbar />
            
            {/* Contenedor global de Notificaciones Toast */}
            <ToastContainer />
            
            {/* Contenido principal inyectado por las rutas */}
            <main className="flex-grow-1">
                <Outlet />
            </main>
            
            {/* Pie de página global */}
            <Footer />
        </div>
    );
}

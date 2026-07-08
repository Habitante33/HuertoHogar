import React from 'react';

export default function AdminHeader() {
    return (
        <header className="bg-dark text-white px-4 py-3 d-flex align-items-center justify-content-between shadow-sm" style={{ height: '55px' }}>
            <span className="fw-bold" style={{ letterSpacing: '0.5px' }}>HuertoHogar - Suite Administrativa</span>
            <span className="badge text-white" style={{ border: '1px solid rgba(255,255,255,0.3)', backgroundColor: 'transparent' }}>
                Entorno Seguro
            </span>
        </header>
    );
}

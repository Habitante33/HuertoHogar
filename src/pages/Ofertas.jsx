import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import TarjetaProducto from '../components/TarjetaProducto';

export default function Ofertas() {
    const { productos } = useContext(AppContext);

    // Filtrar productos que estén en oferta
    const ofertas = productos.filter(p => p.esOferta === true);

    return (
        <div className="container py-5">
            {/* Breadcrumb */}
            <div className="row mb-3">
                <div className="col-12">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/" className="text-success text-decoration-none">Inicio</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Ofertas Especiales</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Cabecera */}
            <div className="row mb-5 text-center text-md-start">
                <div className="col-12">
                    <span 
                        className="badge text-dark fw-bold px-3 py-2 mb-3 shadow-sm" 
                        style={{ backgroundColor: 'var(--hh-accent-yellow)', fontSize: '0.85rem' }}
                    >
                        ⚡ GRANDES DESCUENTOS
                    </span>
                    <h1 className="display-4 fw-bold" style={{ color: 'var(--hh-secondary)' }}>Ofertas de la Semana</h1>
                    <p className="text-muted">Aprovecha precios rebajados por tiempo limitado en nuestras frutas y verduras más frescas.</p>
                </div>
            </div>

            {/* Grid de Ofertas */}
            <div className="row">
                {ofertas.length === 0 ? (
                    <div className="col-12 text-center my-5">
                        <div className="fs-1 mb-3">🏷️</div>
                        <p className="fs-5 text-muted">En este momento no hay productos en oferta. ¡Vuelve pronto!</p>
                    </div>
                ) : (
                    ofertas.map(prod => (
                        <div className="col-md-4 mb-4" key={prod.id}>
                            <TarjetaProducto producto={prod} isDestacado={false} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

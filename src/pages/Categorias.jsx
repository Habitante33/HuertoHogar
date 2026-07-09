import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import TarjetaProducto, { getEmojiPorCategoria } from '../components/TarjetaProducto';

export default function Categorias() {
    const { productos, categorias } = useContext(AppContext);

    // Por defecto, mostrar todas agrupadas, o permitir filtrar por una sola pestaña
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");

    return (
        <div className="container py-5">
            {/* Breadcrumb */}
            <div className="row mb-3">
                <div className="col-12">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/" className="text-success text-decoration-none">Inicio</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Categorías</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Cabecera */}
            <div className="row mb-4">
                <div className="col-12 text-center text-md-start">
                    <h1 className="display-4 fw-bold" style={{ color: 'var(--hh-secondary)' }}>Nuestras Categorías</h1>
                    <p className="text-muted">Explora nuestra gran variedad de productos cultivados con prácticas ecológicas y sustentables.</p>
                </div>
            </div>

            {/* Selector de Pestañas (Tabs) */}
            <div className="row mb-5">
                <div className="col-12">
                    <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start border-bottom pb-3">
                        <button
                            type="button"
                            onClick={() => setCategoriaSeleccionada("Todas")}
                            className={`btn rounded-pill px-4 py-2 fw-semibold ${
                                categoriaSeleccionada === "Todas" ? 'btn-success text-white shadow-sm' : 'btn-light border text-dark'
                            }`}
                        >
                            🧺 Todas las Categorías
                        </button>
                        {categorias.map(cat => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setCategoriaSeleccionada(cat)}
                                className={`btn rounded-pill px-4 py-2 fw-semibold ${
                                    categoriaSeleccionada === cat ? 'btn-success text-white shadow-sm' : 'btn-light border text-dark'
                                }`}
                            >
                                {getEmojiPorCategoria(cat)} {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Listado de Productos por Categoría */}
            <div className="row">
                {categorias
                    .filter(cat => categoriaSeleccionada === "Todas" || categoriaSeleccionada === cat)
                    .map(cat => {
                        const productosCategoria = productos.filter(p => p.categoria === cat);
                        
                        if (productosCategoria.length === 0) return null;

                        return (
                            <div key={cat} className="col-12 mb-5">
                                <div className="d-flex align-items-center gap-2 mb-4 border-bottom pb-2">
                                    <span className="fs-2">{getEmojiPorCategoria(cat)}</span>
                                    <h2 className="fw-bold mb-0" style={{ color: 'var(--hh-secondary)' }}>{cat}</h2>
                                    <span className="badge bg-secondary ms-2">{productosCategoria.length} productos</span>
                                </div>
                                
                                <div className="row">
                                    {productosCategoria.map(prod => (
                                        <div className="col-md-4 mb-4" key={prod.id}>
                                            <TarjetaProducto producto={prod} isDestacado={false} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

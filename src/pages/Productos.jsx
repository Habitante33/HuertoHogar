import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import TarjetaProducto from '../components/TarjetaProducto';

export default function Productos() {
    const { productos, categorias } = useContext(AppContext);
    
    // Estados locales para filtros de búsqueda y categoría
    const [busqueda, setBusqueda] = useState('');
    const [categoriaActiva, setCategoriaActiva] = useState('Todos');

    const getEmoji = (cat) => {
        if (cat.includes("Fruta")) return "🍎";
        if (cat.includes("Verdura")) return "🥬";
        if (cat.includes("Orgánico") || cat.includes("Organico")) return "🍯";
        if (cat.includes("Lácteo") || cat.includes("Lacteo")) return "🥛";
        return "🥬"; // Por defecto
    };

    const formatCategoryLabel = (cat) => {
        if (cat === "Frutas Frescas") return "Frutas";
        if (cat === "Verduras Orgánicas") return "Verduras";
        if (cat === "Productos Orgánicos") return "Orgánicos";
        if (cat === "Productos Lácteos") return "Lácteos";
        return cat;
    };

    const categoriasDisponibles = [
        { id: "Todos", label: "Todos" },
        ...categorias.map(cat => ({
            id: cat,
            label: `${getEmoji(cat)} ${formatCategoryLabel(cat)}`
        })),
        { id: "Ofertas", label: "🏷️ Ofertas" }
    ];

    // Filtrar la lista de productos
    const productosFiltrados = productos.filter(p => {
        const coincideCategoria = 
            categoriaActiva === 'Todos' || 
            (categoriaActiva === 'Ofertas' ? p.esOferta : p.categoria === categoriaActiva);
        const coincideBusqueda = 
            p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.id.toLowerCase().includes(busqueda.toLowerCase());
        
        return coincideCategoria && coincideBusqueda;
    });

    return (
        <div className="container py-5">
            {/* Breadcrumbs */}
            <div className="row mb-3">
                <div className="col-12">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/" className="text-success text-decoration-none">Inicio</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Catálogo de Productos</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Fila de Filtros y Búsqueda (Fusión Horizontal Estética) */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-5">
                {/* Categorías (Izquierda) */}
                <div className="d-flex flex-wrap gap-2">
                    {categoriasDisponibles.map(cat => {
                        const estaActiva = categoriaActiva === cat.id;
                        return (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setCategoriaActiva(cat.id)}
                                className={`category-filter-btn ${estaActiva ? 'active' : ''}`}
                            >
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* Buscador (Derecha) */}
                <div className="input-group shadow-sm" style={{ maxWidth: '360px', width: '100%', borderRadius: '25px', overflow: 'hidden' }}>
                    <span className="input-group-text bg-white border-end-0 text-muted px-3" style={{ borderTopLeftRadius: '25px', borderBottomLeftRadius: '25px' }}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                    <input 
                        type="text" 
                        className="form-control border-start-0 ps-1 py-2" 
                        placeholder="Buscar producto o código..." 
                        style={{ borderTopRightRadius: '25px', borderBottomRightRadius: '25px', fontSize: '0.9rem', outline: 'none', boxShadow: 'none' }}
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid de Productos */}
            <div className="row" id="catalogo-grid">
                {productosFiltrados.length === 0 ? (
                    <div className="col-12 text-center my-5 py-4">
                        <div className="fs-1 mb-3">🔍</div>
                        <p className="fs-5 text-muted">No se encontraron productos que coincidan con la búsqueda.</p>
                    </div>
                ) : (
                    productosFiltrados.map(prod => (
                        <div className="col-md-4 mb-4" key={prod.id}>
                            <TarjetaProducto producto={prod} isDestacado={false} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

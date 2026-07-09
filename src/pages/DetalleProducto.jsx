import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import AlertaStock from '../components/AlertaStock';
import { getEmojiPorCategoria } from '../components/TarjetaProducto';

export default function DetalleProducto() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { productos, carrito, agregarAlCarrito } = useContext(AppContext);

    const [producto, setProducto] = useState(null);
    const [cantidad, setCantidad] = useState(1);
    const [activeAngleIndex, setActiveAngleIndex] = useState(0);

    // Cargar el producto y reiniciar estados al cambiar el id de la URL
    useEffect(() => {
        const p = productos.find(prod => prod.id === id);
        if (!p) {
            navigate('/productos');
            return;
        }
        setProducto(p);
        setCantidad(1);
        setActiveAngleIndex(0);
    }, [id, productos, navigate]);

    if (!producto) return null;

    // Calcular stock disponible restante para la compra
    const itemEnCarrito = carrito.find(item => item.id === producto.id);
    const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;
    const stockDisponible = Math.max(0, producto.stock - cantidadEnCarrito);

    // Configuración de ángulos interactivos para la imagen
    const angulos = [
        { nombre: "Vista Frontal", estilo: { objectFit: "contain", transform: "scale(1)", transition: "all 0.3s ease" } },
        { nombre: "Detalle Cerca", estilo: { objectFit: "cover", transform: "scale(1.4)", transition: "all 0.3s ease" } },
        { nombre: "Ángulo Alternativo", estilo: { objectFit: "contain", transform: "scale(1.1) rotate(6deg)", transition: "all 0.3s ease" } }
    ];

    // Cargar productos relacionados (mismo tipo, máx 5)
    let relacionados = productos.filter(pr => pr.id !== producto.id && pr.categoria === producto.categoria);
    if (relacionados.length < 5) {
        const otros = productos.filter(pr => pr.id !== producto.id && pr.categoria !== producto.categoria);
        relacionados = relacionados.concat(otros);
    }
    relacionados = relacionados.slice(0, 5);

    const handleAgregar = () => {
        if (cantidad > stockDisponible) {
            return; // Bloqueado por falta de stock
        }
        agregarAlCarrito(producto.id, cantidad);
    };

    return (
        <div className="container py-5">
            {/* Breadcrumb */}
            <div className="row mb-3">
                <div className="col-12">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/" className="text-success text-decoration-none">Inicio</Link></li>
                            <li className="breadcrumb-item"><Link to="/productos" className="text-success text-decoration-none">Catálogo</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">{producto.nombre}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Ficha de Detalle */}
            <div className="row bg-white p-4 rounded-3 shadow-sm border">
                {/* Columna Izquierda: Galería e Imagen Principal */}
                <div className="col-md-6 mb-4">
                    <div className="row">
                        {/* Miniaturas de ángulos */}
                        <div className="col-3 d-flex flex-column gap-2" id="det-miniaturas">
                            {angulos.map((angulo, idx) => (
                                <div
                                    key={idx}
                                    className={`border rounded p-1 text-center img-thumbnail-hh ${
                                        activeAngleIndex === idx ? 'active border-success border-2 shadow-sm' : ''
                                    }`}
                                    style={{ cursor: 'pointer' }}
                                    title={angulo.nombre}
                                    onClick={() => setActiveAngleIndex(idx)}
                                >
                                    {producto.imagen ? (
                                        <img 
                                            src={producto.imagen} 
                                            alt={angulo.nombre} 
                                            className="w-100" 
                                            style={{ height: '70px', objectFit: 'cover', borderRadius: '4px' }} 
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextElementSibling.style.display = 'block';
                                            }}
                                        />
                                    ) : null}
                                    <div 
                                        style={{ display: producto.imagen ? 'none' : 'block', fontSize: '1.2rem', padding: '10px 0' }}
                                        className="text-center w-100"
                                    >
                                        {getEmojiPorCategoria(producto.categoria)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Imagen Principal */}
                        <div className="col-9">
                            <div 
                                className="text-center bg-light rounded-3 border p-3 position-relative" 
                                style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
                            >
                                {producto.imagen ? (
                                    <img 
                                        id="det-img-principal" 
                                        src={producto.imagen} 
                                        alt={producto.nombre} 
                                        className="detail-main-img w-100 h-100"
                                        style={angulos[activeAngleIndex].estilo}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            document.getElementById('det-emoji-principal').style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div 
                                    id="det-emoji-principal" 
                                    style={{ display: producto.imagen ? 'none' : 'flex', fontSize: '6rem' }} 
                                    className="align-items-center justify-content-center w-100 h-100"
                                >
                                    <span>{getEmojiPorCategoria(producto.categoria)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Información de Compra */}
                <div className="col-md-6">
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                        <h2 className="fw-bold mb-0" style={{ color: 'var(--hh-secondary)' }}>{producto.nombre}</h2>
                        <div className="text-end">
                            <span className="fs-3 fw-bold text-success d-block">
                                ${producto.precio.toLocaleString("es-CL")} CLP
                            </span>
                            {producto.esOferta && (
                                <span className="text-xs text-decoration-line-through text-muted">
                                    Antes: ${producto.precioAnterior?.toLocaleString("es-CL")}
                                </span>
                            )}
                        </div>
                    </div>

                    <hr />

                    {/* Alerta de Stock Crítico */}
                    <AlertaStock stock={stockDisponible} stockCritico={producto.stockCritico} />

                    <p className="text-muted fs-6 mb-4">{producto.descripcion}</p>

                    <hr />

                    {/* Especificaciones */}
                    <div className="mb-4">
                        <div className="row mb-2">
                            <div className="col-6">
                                <small className="text-muted d-block">Código</small>
                                <span className="fw-bold">{producto.id}</span>
                            </div>
                            <div className="col-6">
                                <small className="text-muted d-block">Categoría</small>
                                <span className="fw-bold">{producto.categoria}</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <small className="text-muted d-block">Origen</small>
                                <span className="fw-bold">{producto.origen || "Valle Central, Chile"}</span>
                            </div>
                            <div className="col-6">
                                <small className="text-muted d-block">Stock Disponible</small>
                                <span className="fw-bold text-success">{stockDisponible} unidades</span>
                            </div>
                        </div>
                    </div>

                    {/* Control de Cantidad y Acción */}
                    <div className="d-flex align-items-center gap-3 mb-4">
                        <label className="fw-bold" htmlFor="det-cantidad">Cantidad:</label>
                        <select 
                            id="det-cantidad" 
                            className="form-select border-success" 
                            style={{ width: '100px', borderRadius: '8px' }}
                            value={cantidad}
                            onChange={(e) => setCantidad(parseInt(e.target.value))}
                            disabled={stockDisponible <= 0}
                        >
                            {[...Array(Math.min(10, stockDisponible)).keys()].map(n => (
                                <option key={n + 1} value={n + 1}>{n + 1}</option>
                            ))}
                            {stockDisponible === 0 && (
                                <option value="0">0</option>
                            )}
                        </select>
                    </div>

                    <button 
                        className="btn btn-primary-hh btn-lg w-100 py-3 mb-4 shadow-sm"
                        onClick={handleAgregar}
                        disabled={stockDisponible <= 0}
                    >
                        <i className="fa-solid fa-cart-plus me-2"></i> 
                        {stockDisponible <= 0 ? 'Sin Stock Disponible' : 'Agregar al Carrito'}
                    </button>

                    <hr />

                    {/* Sello de Calidad */}
                    <div className="d-flex align-items-start gap-3 p-3 bg-light rounded-3 border">
                        <i className="fa-solid fa-leaf text-success fs-3 mt-1"></i>
                        <div>
                            <h6 className="fw-bold mb-0">Cultivado con Amor</h6>
                            <small className="text-muted">Directo del huerto local, fresco y cosechado a mano en Chile.</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Productos Relacionados */}
            <div className="mt-5 mb-4">
                <h4 className="fw-bold mb-3">
                    <i className="fa-solid fa-shuffle text-success me-2"></i>Productos Relacionados
                </h4>
                <div className="row row-cols-2 row-cols-md-5 g-3">
                    {relacionados.map(rel => (
                        <div className="col" key={rel.id}>
                            <div className="card h-100 card-product shadow-sm border-0">
                                <Link to={`/productos/${rel.id}`}>
                                    <div className="text-center bg-light rounded-top position-relative" style={{ overflow: 'hidden', height: '120px' }}>
                                        {rel.imagen ? (
                                            <img 
                                                src={rel.imagen} 
                                                alt={rel.nombre} 
                                                className="w-100 h-100 img-zoom" 
                                                style={{ objectFit: 'cover' }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextElementSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div 
                                            style={{ height: '120px', display: rel.imagen ? 'none' : 'flex' }} 
                                            className="align-items-center justify-content-center bg-light text-center w-100"
                                        >
                                            <span style={{ fontSize: '2.5rem' }}>{getEmojiPorCategoria(rel.categoria)}</span>
                                        </div>
                                    </div>
                                </Link>
                                <div className="card-body p-2 d-flex flex-column text-center">
                                    <Link to={`/productos/${rel.id}`} className="text-decoration-none text-dark hover-green">
                                        <h6 className="card-title text-dark mb-1 text-truncate fw-bold" style={{ fontSize: '0.9rem' }}>
                                            {rel.nombre}
                                        </h6>
                                    </Link>
                                    <p className="fw-bold text-success mb-2" style={{ fontSize: '0.85rem' }}>
                                        ${rel.precio.toLocaleString("es-CL")} CLP
                                    </p>
                                    <Link to={`/productos/${rel.id}`} className="btn btn-xs btn-outline-success py-1 w-100 mt-auto" style={{ fontSize: '0.75rem' }}>
                                        Ver Producto
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

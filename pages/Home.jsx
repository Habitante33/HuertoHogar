import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import TarjetaProducto from '../components/TarjetaProducto';
import MapaHuerto from '../components/MapaHuerto';

export default function Home() {
    const { productos } = useContext(AppContext);

    // Obtener los primeros 3 productos destacados para la página de inicio
    const destacados = productos.slice(0, 3);

    return (
        <div>
            {/* HERO SECTION */}
            <header 
                className="py-5 text-center text-md-start" 
                style={{ 
                    background: `linear-gradient(135deg, rgba(46, 139, 87, 0.1), rgba(247, 247, 247, 0.9)), url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200') no-repeat center/cover`, 
                    minHeight: '450px', 
                    display: 'flex', 
                    alignItems: 'center' 
                }}
            >
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-7">
                            <span className="badge bg-success px-3 py-2 mb-3 fs-7">Frescura 100% Garantizada</span>
                            <h1 className="display-3 fw-bold mb-3" style={{ color: 'var(--hh-secondary)' }}>Llevamos el Campo a tu Mesa</h1>
                            <p className="fs-5 text-muted mb-4">HuertoHogar conecta a los agricultores de Chile directamente con tu hogar. Frutas y verduras frescas, orgánicas y cultivadas de forma sostenible.</p>
                            <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start">
                                <Link to="/productos" className="btn btn-lg btn-primary-hh px-4 py-3 fs-6">Ver Productos en Venta</Link>
                                <Link to="/nosotros" className="btn btn-lg btn-outline-dark px-4 py-3 fs-6">Conócenos</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* VENTAJAS / FEATURES */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="row text-center">
                        <div className="col-md-4 mb-4">
                            <div className="p-4 border rounded-3 bg-light h-100 shadow-sm">
                                <div className="fs-1 text-success mb-3">🚜</div>
                                <h4 className="fw-bold">Directo del Productor</h4>
                                <p className="text-muted">Apoyamos a pequeños agricultores locales a lo largo del país, garantizando un comercio justo.</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="p-4 border rounded-3 bg-light h-100 shadow-sm">
                                <div className="fs-1 text-success mb-3">🍃</div>
                                <h4 className="fw-bold">100% Orgánico</h4>
                                <p className="text-muted">Nuestros cultivos respetan la tierra, libres de químicos perjudiciales y pesticidas artificiales.</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="p-4 border rounded-3 bg-light h-100 shadow-sm">
                                <div className="fs-1 text-success mb-3">📦</div>
                                <h4 className="fw-bold">Despacho Rápido</h4>
                                <p className="text-muted">Logística premium para conservar la frescura y la cadena de frío desde el campo a tu puerta.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRODUCTOS DESTACADOS */}
            <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="container">
                    <div className="text-center mb-5">
                        <span className="text-uppercase text-success fw-bold">Nuestros Favoritos</span>
                        <h2 className="display-5 fw-bold">Productos Destacados</h2>
                        <p className="text-muted">Una selección fresca de la estación directo a tu mesa.</p>
                    </div>
                    
                    <div className="row">
                        {destacados.map(prod => (
                            <div className="col-md-4 mb-4" key={prod.id}>
                                <TarjetaProducto producto={prod} isDestacado={true} />
                            </div>
                        ))}
                    </div>
                    
                    <div className="text-center mt-4">
                        <Link to="/productos" className="btn btn-primary-hh px-4 py-2">Ver Catálogo Completo</Link>
                    </div>
                </div>
            </section>

            {/* SECCIÓN PRESENCIA NACIONAL (MAPA) */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-5 mb-4 mb-lg-0">
                            <span className="text-uppercase text-success fw-bold">Nuestra Red</span>
                            <h2 className="display-5 mb-4 fw-bold">Presencia a Nivel Nacional</h2>
                            <p className="text-muted fs-5">Operamos en Santiago, Puerto Montt, Villarrica, Nacimiento, Viña del Mar, Valparaíso y Concepción. Acercamos el campo a tu mesa estés donde estés.</p>
                            <p className="small text-muted mb-4"><i className="fa-solid fa-map-location-dot text-success me-2"></i> Haz clic en los marcadores del mapa para ver detalles de cada sucursal.</p>
                            <Link to="/nosotros" className="btn btn-outline-success px-4 py-2">Conoce Más Sobre Nosotros</Link>
                        </div>
                        <div className="col-lg-7">
                            <MapaHuerto />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

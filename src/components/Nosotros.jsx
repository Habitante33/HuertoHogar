import React from 'react';

export default function Nosotros() {
    return (
        <div className="container py-5">
            {/* Breadcrumbs */}
            <div className="row mb-3">
                <div className="col-12">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/" className="text-success text-decoration-none">Inicio</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Nosotros</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* SECCIÓN NOSOTROS */}
            <section id="nosotros" className="py-4">
                <div className="row text-center mb-5">
                    <div className="col-lg-9 mx-auto">
                        <span className="text-uppercase fw-bold text-success" style={{ fontSize: '0.9rem', letterSpacing: '2px' }}>
                            SOBRE NOSOTROS
                        </span>
                        <h2 className="display-4 my-3 fw-bold" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--hh-secondary)' }}>
                            Conoce HuertoHogar
                        </h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '850px', fontSize: '1.05rem', fontWeight: 400, lineHeight: 1.7 }}>
                            HuertoHogar es una tienda online dedicada a llevar la frescura y calidad de los productos del campo directamente a la puerta de nuestros clientes en Chile. Con más de 6 años de experiencia, operamos en más de 9 puntos a lo largo del país, incluyendo ciudades clave como Santiago, Puerto Montt, Villarrica, Nacimiento, Viña del Mar, Valparaíso, y Concepción. Nuestra misión es conectar a las familias chilenas con el campo, promoviendo un estilo de vida saludable y sostenible.
                        </p>
                    </div>
                </div>
                
                <div className="row g-4 justify-content-center">
                    {/* Tarjeta Misión */}
                    <div className="col-md-6 col-lg-5">
                        <div className="card border-0 h-100 text-center p-4 p-md-5 rounded-4 shadow-sm bg-white">
                            <div className="card-body p-0 d-flex flex-column align-items-center">
                                <div className="d-flex align-items-center justify-content-center mb-4" style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'var(--hh-primary)', boxShadow: '0 8px 20px rgba(46, 139, 87, 0.3)' }}>
                                    <i className="fa-solid fa-bullseye text-white" style={{ fontSize: '1.7rem' }}></i>
                                </div>
                                <h3 className="h4 fw-bold mb-3" style={{ color: 'var(--hh-secondary)' }}>Misión</h3>
                                <p className="text-muted mb-0" style={{ fontSize: '0.95rem', lineHeight: '1.7' }}>
                                    Nuestra misión es proporcionar productos frescos y de calidad directamente desde el campo hasta la puerta de nuestros clientes, garantizando la frescura y el sabor en cada entrega. Nos comprometemos a fomentar una conexión más cercana entre los consumidores y los agricultores locales, apoyando prácticas agrícolas sostenibles y promoviendo una alimentación saludable en todos los hogares chilenos.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Tarjeta Visión */}
                    <div className="col-md-6 col-lg-5">
                        <div className="card border-0 h-100 text-center p-4 p-md-5 rounded-4 shadow-sm bg-white">
                            <div className="card-body p-0 d-flex flex-column align-items-center">
                                <div className="d-flex align-items-center justify-content-center mb-4" style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#f39c12', boxShadow: '0 8px 20px rgba(243, 156, 18, 0.3)' }}>
                                    <i className="fa-solid fa-eye text-white" style={{ fontSize: '1.6rem' }}></i>
                                </div>
                                <h3 className="h4 fw-bold mb-3" style={{ color: 'var(--hh-secondary)' }}>Visión</h3>
                                <p className="text-muted mb-0" style={{ fontSize: '0.95rem', lineHeight: '1.7' }}>
                                    Nuestra visión es ser la tienda online líder en la distribución de productos frescos y naturales en Chile, reconocida por nuestra calidad excepcional, servicio al cliente y compromiso con la sostenibilidad. Aspiramos a expandir nuestra presencia a nivel nacional e internacional, estableciendo un nuevo estándar en la distribución de productos agrícolas directos del productor al consumidor.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

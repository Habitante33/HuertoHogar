import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function Blog() {
    const { mostrarNotificacion } = useContext(AppContext);
    
    // Estado para controlar qué artículo ver en el modal
    const [articuloActivo, setArticuloActivo] = useState(null);

    const posts = [
        {
            id: 'blog2',
            titulo: 'Beneficios clave de incorporar verduras orgánicas en tu alimentación diaria',
            categoria: 'Nutrición y Salud',
            categoriaClass: 'badge bg-success text-white px-3 py-2',
            fecha: 'junio 15, 2026',
            resumen: 'Consumir verduras orgánicas va mucho más allá de una tendencia; es una decisión consciente que impacta directamente en nuestra salud y en la conservación de la tierra. A diferencia de los cultivos tradicionales que dependen de pesticidas y fertilizantes químicos, las verduras ecológicas crecen de forma natural en suelos ricos en nutrientes. Esto se traduce en un aporte significativamente mayor de vitaminas y minerales...',
            contenidoHtml: `
                <p class="lead fw-bold text-success" style="font-family: 'Playfair Display', serif;">Una elección saludable para ti y respetuosa con nuestro planeta</p>
                <p>Consumir verduras orgánicas va mucho más allá de una tendencia; es una decisión consciente que impacta directamente en nuestra salud y en la conservación de la tierra. A diferencia de los cultivos tradicionales que dependen de pesticidas y fertilizantes químicos, las verduras ecológicas crecen de forma natural en suelos ricos en nutrientes. Esto no solo se traduce en un sabor mucho más intenso y auténtico, sino también en un aporte significativamente mayor de antioxidantes, vitaminas y minerales esenciales para nuestro organismo.</p>
                
                <h5 class="mt-4 text-success"><i class="fa-solid fa-heart me-2"></i>¿Por qué preferir verduras ecológicas?</h5>
                <ul>
                    <li><b>Libres de residuos químicos:</b> Al ser cultivadas sin pesticidas sintéticos ni herbicidas tóxicos, evitas la acumulación de trazas químicas en tu cuerpo, protegiendo tu sistema inmunológico y digestivo.</li>
                    <li><b>Mayor densidad de nutrientes:</b> Al crecer en suelos nutridos de forma natural (compost, abonos orgánicos), las plantas sintetizan mayor cantidad de vitaminas (especialmente vitamina C) y minerales como hierro y magnesio.</li>
                    <li><b>Sabor y frescura real:</b> Las verduras cosechadas en su punto óptimo de maduración conservan su agua celular y aceites esenciales naturales, logrando texturas firmes y sabores auténticos de campo.</li>
                    <li><b>Cuidado de la biodiversidad:</b> La agricultura ecológica respeta los ciclos del suelo y protege a los polinizadores locales (abejas, mariposas) esenciales para el equilibrio ambiental.</li>
                </ul>
                
                <div class="p-3 my-3 bg-light border-start border-4 border-success rounded">
                    <h5 class="text-success"><i class="fa-solid fa-seedling me-2"></i>El secreto está en el suelo</h5>
                    <p class="mb-0">Un suelo vivo produce plantas fuertes. Al elegir verduras de HuertoHogar, apoyas un modelo de agricultura limpia que protege las napas de agua y restaura la fertilidad natural de los campos chilenos.</p>
                </div>
                
                <p>Incorporar más vegetales orgánicos en tu mesa diaria es el paso más sencillo y efectivo para nutrirte de verdad y disfrutar del sabor natural que solía tener la comida. ¡Elige sano, elige consciente!</p>
            `
        },
        {
            id: 'blog1',
            titulo: 'Cajas de verduras, hortalizas y frutas ecológicas del jueves 11 de JUNIO de 2026',
            categoria: 'Huerta Ecológica',
            categoriaClass: 'badge bg-success text-white px-3 py-2',
            fecha: 'junio 08, 2026',
            resumen: 'Tras el parón en los repartos de estas últimas semanas, volvemos de nuevo. La primavera no dejó avanzar los cultivos y hemos tenido un parón de producción, pero parece que por fin nuestra huerta nos regala sus ricos productos de temporada. A ver si empiezan a madurar los tomates, de momento los que hemos podido probar, ya os adelantamos que están deliciosos. ...',
            contenidoHtml: `
                <p>Tras el parón en los repartos de estas últimas semanas, volvemos de nuevo. La primavera no dejó avanzar los cultivos y hemos tenido un parón de producción, pero parece que por fin nuestra huerta nos regala sus ricos productos de temporada. A ver si empiezan a madurar los tomates, de momento los que hemos podido probar, ya os adelantamos que están deliciosos.</p>
                <p>¿te animas a seguir con el propósito de una alimentación saludable y ecológica? Para afrontar este tiempo loco hay que reforzar nuestras defensas. Elige las verduras y hortalizas ecológicas de la huerta de Movera. Elige Huerto Natural.</p>
                
                <div class="p-3 my-3 bg-light border-start border-4 border-success rounded">
                    <h5 class="text-success"><i class="fa-solid fa-calendar-check me-2"></i>¡Pide tu caja para el JUEVES 11 de JUNIO!</h5>
                    <p class="mb-0">Para recibir tu caja de Huerto Natural debes rellenar el formulario de pedido antes del <b>MARTES a las 20h</b>.</p>
                </div>
            `
        },
        {
            id: 'blog3',
            titulo: 'Propiedades y secretos de la Miel Orgánica de Puerto Varas',
            categoria: 'Apicultura',
            categoriaClass: 'badge bg-warning text-dark px-3 py-2',
            fecha: 'junio 02, 2026',
            resumen: 'Nuestra miel orgánica proviene del sur de Chile, específicamente de las praderas nativas de Puerto Varas. En esta época de frío, la miel no solo endulza tus mañanas de forma natural, sino que actúa como un poderoso escudo protector. Producida bajo estrictos estándares de apicultura sostenible, conserva todas sus propiedades medicinales y enzimas activas intactas. ...',
            contenidoHtml: `
                <p class="lead fw-bold text-success" style="font-family: 'Playfair Display', serif;">Descubre el tesoro dorado de los bosques del sur de Chile</p>
                <p>Nuestra miel orgánica proviene del sur de Chile, específicamente de las praderas nativas de Puerto Varas. En esta época de frío, la miel no solo endulza tus mañanas de forma natural, sino que actúa como un poderoso escudo protector. Producida bajo estrictos estándares de apicultura sostenible, conserva todas sus propiedades medicinales y enzimas activas intactas.</p>
                
                <h5 class="mt-4 text-success"><i class="fa-solid fa-circle-check me-2"></i>Beneficios clave de la Miel de Pradera Nativa:</h5>
                <ul>
                    <li><b>Alto poder antibacterial:</b> Contiene agentes naturales que inhiben el crecimiento bacteriano, excelente para aliviar dolores de garganta y resfriados comunes.</li>
                    <li><b>Antioxidante natural:</b> Rica en flavonoides y compuestos flavonoides que combaten los radicales libres y previenen el daño celular.</li>
                    <li><b>Fuente de energía limpia:</b> Sus azúcares simples (fructosa y glucosa) se absorben de manera directa, ideales para deportistas y para comenzar el día.</li>
                    <li><b>100% Cruda y Sin Filtrar:</b> No la sometemos a procesos de calentamiento industrial, manteniendo todo el polen y propóleo de origen de forma intacta.</li>
                </ul>
                
                <div class="p-3 my-3 bg-light border-start border-4 border-warning rounded">
                    <h5 class="text-warning-emphasis"><i class="fa-solid fa-leaf me-2"></i>Apicultura Sostenible y Respetuosa</h5>
                    <p class="mb-0">Trabajamos en conjunto con pequeños apicultores locales que respetan los ciclos naturales de las abejas. No sobreexplotamos las colmenas y aseguramos que tengan suficiente alimento para pasar el invierno.</p>
                </div>
                
                <p>Si deseas incorporar este increíble alimento a tu despensa, agrégalo en tu próximo pedido semanal. ¡Es el complemento perfecto para tus infusiones, pan integral o endulzante de repostería saludable!</p>
            `
        }
    ];

    const compartirArticulo = (e, id) => {
        e.preventDefault();
        const dummyUrl = `${window.location.origin}/blog#${id}`;
        navigator.clipboard.writeText(dummyUrl).then(() => {
            mostrarNotificacion("¡Enlace copiado al portapapeles! Compártelo con tus amigos.", "success");
        }).catch(() => {
            mostrarNotificacion(`Enlace del artículo: ${dummyUrl}`, "info");
        });
    };

    return (
        <div>
            {/* Cabecera de Sección */}
            <div className="py-4 bg-light border-bottom mb-5">
                <div className="container text-center">
                    <h1 className="display-5 fw-bold" style={{ color: 'var(--hh-secondary)' }}>Alimentación y Vida Sana</h1>
                    <p className="text-muted">Aprende sobre sostenibilidad, recetas del campo y hábitos saludables en nuestro blog.</p>
                </div>
            </div>

            {/* Listado de Artículos */}
            <section className="py-3 bg-white">
                <div className="container" style={{ maxWidth: '850px' }}>
                    {posts.map((post) => (
                        <article key={post.id} className="blog-post mb-5 pb-4 border-bottom">
                            <h2 
                                className="blog-post-title mb-1" 
                                style={{ 
                                    fontFamily: "'Playfair Display', serif", 
                                    fontWeight: 700, 
                                    color: '#2E8B57', 
                                    fontSize: '2rem', 
                                    lineHeight: 1.3 
                                }}
                            >
                                {post.titulo}
                            </h2>
                            <div className="blog-post-meta text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                                {post.fecha}
                            </div>
                            <div 
                                className="blog-post-body text-dark mb-3" 
                                style={{ 
                                    fontSize: '1.05rem', 
                                    lineHeight: 1.7, 
                                    textAlign: 'justify', 
                                    fontFamily: "'Montserrat', sans-serif" 
                                }}
                            >
                                {post.resumen}
                            </div>
                            <div className="d-flex justify-content-between align-items-center fw-bold" style={{ fontSize: '0.85rem' }}>
                                <div>
                                    <a 
                                        href="#" 
                                        className="text-success text-decoration-none hover-dark-green"
                                        onClick={(e) => compartirArticulo(e, post.id)}
                                    >
                                        COMPARTIR
                                    </a>
                                </div>
                                <div>
                                    <button 
                                        type="button"
                                        className="btn btn-link text-success text-decoration-none hover-dark-green p-0 fw-bold"
                                        onClick={() => setArticuloActivo(post)}
                                        style={{ fontSize: '0.85rem' }}
                                    >
                                        LEER MÁS
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Modal Reactivo de Detalle */}
            {articuloActivo && (
                <>
                    {/* Backdrop */}
                    <div className="modal-backdrop fade show" onClick={() => setArticuloActivo(null)}></div>
                    
                    {/* Modal */}
                    <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }} tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title fw-bold text-success" style={{ fontFamily: "'Playfair Display', serif" }}>
                                        {articuloActivo.titulo}
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setArticuloActivo(null)}></button>
                                </div>
                                <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                    <div className="text-center mb-3">
                                        <span className={articuloActivo.categoriaClass}>
                                            {articuloActivo.categoria}
                                        </span>
                                    </div>
                                    <div 
                                        className="fs-6 text-dark lh-lg" 
                                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                                        dangerouslySetInnerHTML={{ __html: articuloActivo.contenidoHtml }}
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setArticuloActivo(null)}>
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

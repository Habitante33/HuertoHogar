import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import MapaHuerto from '../components/MapaHuerto';
import { validarFormulario } from '../utils/validaciones';

export default function Contacto() {
    const { mostrarNotificacion } = useContext(AppContext);

    // Estado del formulario
    const [valores, setValores] = useState({
        'contacto-nombre': '',
        'contacto-correo': '',
        'contacto-comentario': ''
    });

    // Estado de errores
    const [errores, setErrores] = useState({});

    // Configuración de validación declarativa
    const reglasValidacion = {
        'contacto-nombre': { required: true, maxLength: 100 },
        'contacto-correo': {
            required: true,
            maxLength: 100,
            pattern: /^[a-zA-Z0-9._%+-]+@(?:inacap\.cl|inacapmail\.cl|gmail\.com|profesor\.inacap\.cl)$/
        },
        'contacto-comentario': { required: true, maxLength: 500 }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        const nuevosValores = { ...valores, [id]: value };
        setValores(nuevosValores);

        // Limpiar error dinámicamente si el campo ahora es válido
        const reglas = reglasValidacion[id];
        if (reglas) {
            const errorTemp = { [id]: value.trim() === '' };
            // Si el correo tiene patrón, validarlo también para limpiar error
            if (id === 'contacto-correo' && reglas.pattern) {
                errorTemp[id] = !reglas.pattern.test(value.trim());
            }
            if (id === 'contacto-comentario' && reglas.maxLength) {
                errorTemp[id] = value.trim() === '' || value.length > reglas.maxLength;
            }
            setErrores(prev => ({ ...prev, [id]: errorTemp[id] }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar todo el formulario
        const { errores: nuevosErrores, esValido } = validarFormulario(valores, reglasValidacion);
        setErrores(nuevosErrores);

        if (esValido) {
            mostrarNotificacion("¡Éxito! Tu mensaje ha sido enviado. Nos pondremos en contacto pronto.", "success");
            // Resetear formulario
            setValores({
                'contacto-nombre': '',
                'contacto-correo': '',
                'contacto-comentario': ''
            });
            setErrores({});
        } else {
            mostrarNotificacion("Por favor, corrige los errores en el formulario de contacto.", "warning");
        }
    };

    return (
        <div className="container py-5">
            {/* Breadcrumb */}
            <div className="row mb-3">
                <div className="col-12">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/" className="text-success text-decoration-none">Inicio</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Contacto</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Cabecera */}
            <div className="py-4 bg-light border rounded-3 mb-5 text-center">
                <h1 className="display-5 fw-bold" style={{ color: 'var(--hh-secondary)' }}>Contacto</h1>
                <p className="text-muted">Estamos aquí para ayudarte. Encuéntranos o escríbenos directamente.</p>
            </div>

            {/* Formulario y Mapa */}
            <div className="row">
                {/* Formulario de Contacto */}
                <div className="col-lg-5 mb-5 mb-lg-0">
                    <h2 className="display-6 fw-bold mb-3" style={{ color: 'var(--hh-secondary)' }}>¿Tienes Consultas?</h2>
                    <p className="text-muted mb-4">Envíanos tus comentarios, sugerencias o dudas. Te responderemos en un plazo máximo de 24 horas hábiles.</p>
                    
                    <div className="card shadow-sm border p-4 rounded-4 bg-light">
                        <form onSubmit={handleSubmit}>
                            {/* Input Nombre */}
                            <div className="mb-3">
                                <label htmlFor="contacto-nombre" className="form-label fw-bold">Nombre Completo *</label>
                                <input 
                                    type="text" 
                                    className={`form-control ${errores['contacto-nombre'] ? 'is-invalid' : ''}`} 
                                    id="contacto-nombre" 
                                    placeholder="Ej: Juan Pérez" 
                                    value={valores['contacto-nombre']}
                                    onChange={handleChange}
                                    maxLength="100"
                                />
                                <div className="invalid-feedback">El nombre es requerido (máx. 100 caracteres).</div>
                            </div>

                            {/* Input Correo */}
                            <div className="mb-3">
                                <label htmlFor="contacto-correo" className="form-label fw-bold">Correo Electrónico *</label>
                                <input 
                                    type="email" 
                                    className={`form-control ${errores['contacto-correo'] ? 'is-invalid' : ''}`} 
                                    id="contacto-correo" 
                                    placeholder="correo@gmail.com" 
                                    value={valores['contacto-correo']}
                                    onChange={handleChange}
                                    maxLength="100"
                                />
                                <div className="invalid-feedback">Ingresa un correo válido (@inacap.cl, @inacapmail.cl o @gmail.com).</div>
                            </div>

                            {/* Input Comentario / Consulta */}
                            <div className="mb-3">
                                <div className="d-flex justify-content-between">
                                    <label htmlFor="contacto-comentario" className="form-label fw-bold">Consulta *</label>
                                    <small id="char-counter" className={`text-muted ${valores['contacto-comentario'].length > 500 ? 'text-danger' : ''}`}>
                                        {valores['contacto-comentario'].length}/500
                                    </small>
                                </div>
                                <textarea 
                                    className={`form-control ${errores['contacto-comentario'] ? 'is-invalid' : ''}`} 
                                    id="contacto-comentario" 
                                    rows="4" 
                                    placeholder="Escribe tu mensaje..." 
                                    value={valores['contacto-comentario']}
                                    onChange={handleChange}
                                    maxLength="500"
                                />
                                <div className="invalid-feedback">El comentario es requerido (máx. 500 caracteres).</div>
                            </div>

                            <div className="d-grid mt-4">
                                <button type="submit" className="btn btn-primary-hh py-2 shadow-sm">
                                    <i className="fa-solid fa-paper-plane me-2"></i>Enviar Mensaje
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Mapa de Sucursales */}
                <div className="col-lg-7">
                    <h2 className="display-6 fw-bold mb-3" style={{ color: 'var(--hh-secondary)' }}>Nuestras Sucursales</h2>
                    <p className="text-muted mb-4">Haz clic en los marcadores del mapa para ver detalles de cada punto de distribución en el país.</p>
                    <MapaHuerto />
                </div>
            </div>
        </div>
    );
}

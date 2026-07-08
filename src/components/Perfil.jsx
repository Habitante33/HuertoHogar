import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { validarFormulario } from '../utils/validaciones';

export default function Perfil() {
    const { 
        usuarioSesion, 
        actualizarPerfil, 
        regiones, 
        ordenes, 
        repetirPedido,
        mostrarNotificacion 
    } = useContext(AppContext);

    const navigate = useNavigate();

    // Redirigir a login si no hay sesión
    useEffect(() => {
        if (!usuarioSesion) {
            navigate('/login');
        }
    }, [usuarioSesion, navigate]);

    // Sub-pestañas activas ("editar" o "pedidos")
    const [subTabActivo, setSubTabActivo] = useState('editar');

    // Estado del Formulario Perfil
    const [valores, setValores] = useState({
        'perfil-nombre': '',
        'perfil-apellidos': '',
        'perfil-telefono': '',
        'perfil-region': '',
        'perfil-comuna': '',
        'perfil-direccion': ''
    });
    const [errores, setErrores] = useState({});
    const [comunasDisponibles, setComunasDisponibles] = useState([]);

    // Cargar datos iniciales
    useEffect(() => {
        if (usuarioSesion) {
            setValores({
                'perfil-nombre': usuarioSesion.nombre || '',
                'perfil-apellidos': usuarioSesion.apellidos || '',
                'perfil-telefono': usuarioSesion.telefono || '',
                'perfil-region': usuarioSesion.region || '',
                'perfil-comuna': usuarioSesion.comuna || '',
                'perfil-direccion': usuarioSesion.direccion || ''
            });
        }
    }, [usuarioSesion]);

    // Cargar comunas de la región seleccionada
    useEffect(() => {
        if (valores['perfil-region']) {
            const regionObj = regiones.find(r => r.nombre === valores['perfil-region']);
            if (regionObj) {
                setComunasDisponibles(regionObj.comunas);
            } else {
                setComunasDisponibles([]);
            }
        } else {
            setComunasDisponibles([]);
        }
    }, [valores['perfil-region'], regiones]);

    if (!usuarioSesion) return null;

    // Si es administrador, bloquear vista de cliente y pedir ir a la admin suite
    if (usuarioSesion.tipo === 'Administrador') {
        return (
            <div className="container my-5" style={{ maxWidth: '600px' }}>
                <div className="card shadow border-0 rounded-4 p-5 bg-white text-center">
                    <div className="d-inline-flex align-items-center justify-content-center mb-3 mx-auto" style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'rgba(220, 53, 69, 0.1)', color: '#dc3545' }}>
                        <i className="fa-solid fa-user-lock" style={{ fontSize: '2rem' }}></i>
                    </div>
                    <h4 className="fw-bold text-danger mb-2">Acceso Restringido</h4>
                    <p className="text-muted mx-auto mb-4" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                        Como <b>Administrador</b>, no puedes visualizar el historial de compras ni modificar tus datos personales desde este perfil de cliente público.
                    </p>
                    <div className="p-3 border rounded-3 bg-light text-start mb-4">
                        <span className="d-block fw-bold text-dark mb-1"><i className="fa-solid fa-circle-info text-info me-2"></i>¿Cómo modificar tus datos?</span>
                        <span className="small text-muted">Debes ingresar al panel administrativo, ir a la sección "Trabajadores" y seleccionar editar sobre tu propio registro.</span>
                    </div>
                    <button onClick={() => navigate('/admin')} className="btn btn-primary-hh btn-lg fs-6 shadow-sm w-100">
                        <i className="fa-solid fa-gears me-2"></i>Ir al Panel de Administración
                    </button>
                </div>
            </div>
        );
    }

    // Reglas de validación
    const reglasPerfil = {
        'perfil-nombre': { required: true, maxLength: 50 },
        'perfil-apellidos': { required: true, maxLength: 100 },
        'perfil-region': { required: true },
        'perfil-comuna': { required: true },
        'perfil-direccion': { required: true, maxLength: 300 }
    };

    // Manejar cambios en inputs
    const handleChange = (e) => {
        const { id, value } = e.target;
        
        // Restricción teléfono: solo números
        if (id === 'perfil-telefono') {
            const cleanVal = value.replace(/\D/g, '');
            setValores(prev => ({ ...prev, [id]: cleanVal }));
            
            // Validar formato si hay valor: debe empezar por 9 y tener 9 dígitos
            if (cleanVal && !/^9\d{8}$/.test(cleanVal)) {
                setErrores(prev => ({ ...prev, 'perfil-telefono': true }));
            } else {
                setErrores(prev => ({ ...prev, 'perfil-telefono': false }));
            }
            return;
        }

        setValores(prev => ({ ...prev, [id]: value }));
        setErrores(prev => ({ ...prev, [id]: false }));
    };

    // Guardar cambios del perfil
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar campos obligatorios
        const { errores: errs, esValido } = validarFormulario(valores, reglasPerfil);
        
        // Validar teléfono opcional
        let telValido = true;
        if (valores['perfil-telefono'] && !/^9\d{8}$/.test(valores['perfil-telefono'])) {
            errs['perfil-telefono'] = true;
            telValido = false;
        }

        setErrores(errs);

        if (esValido && telValido) {
            actualizarPerfil(usuarioSesion.run, {
                nombre: valores['perfil-nombre'].trim(),
                apellidos: valores['perfil-apellidos'].trim(),
                telefono: valores['perfil-telefono'],
                region: valores['perfil-region'],
                comuna: valores['perfil-comuna'],
                direccion: valores['perfil-direccion'].trim()
            });
        } else {
            mostrarNotificacion("Por favor, corrige los campos erróneos del perfil.", "warning");
        }
    };

    // Historial de Pedidos del cliente actual
    const misPedidos = ordenes
        .filter(o => o.clienteRun === usuarioSesion.run)
        .reverse(); // Newest first

    const handleRepetirPedido = () => {
        if (misPedidos.length === 0) return;
        const ultimoPedidoId = misPedidos[0].id;
        const exito = repetirPedido(ultimoPedidoId);
        if (exito) {
            navigate('/carrito');
        }
    };

    return (
        <div className="container my-5" style={{ maxWidth: '650px' }}>
            <div className="card shadow border-0 rounded-4 p-4 bg-white">
                
                {/* Cabecera Informativa */}
                <div className="d-flex align-items-center gap-3 mb-4 p-3 rounded-4" style={{ background: 'linear-gradient(135deg, rgba(46,139,87,0.08), rgba(139,69,19,0.05))' }}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '56px', height: '56px', background: 'var(--hh-primary)', color: '#fff', fontSize: '1.5rem' }}>
                        <i className="fa-solid fa-user"></i>
                    </div>
                    <div>
                        <h4 className="mb-0 fw-bold text-dark">{usuarioSesion.nombre} {usuarioSesion.apellidos}</h4>
                        <p className="mb-0 text-muted small">{usuarioSesion.correo}</p>
                        <span className="badge mt-1" style={{ backgroundColor: usuarioSesion.tipo === 'Vendedor' ? '#0d6efd' : 'var(--hh-primary)' }}>
                            {usuarioSesion.tipo}
                        </span>
                    </div>
                </div>

                {/* Sub-pestañas Internas */}
                <ul className="nav nav-tabs mb-4" id="perfilSubTabs" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button 
                            className={`nav-link fw-semibold ${subTabActivo === 'editar' ? 'active text-success' : 'text-secondary'}`}
                            onClick={() => setSubTabActivo('editar')}
                            type="button"
                        >
                            <i className="fa-solid fa-pen-to-square me-1"></i>Editar Datos
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button 
                            className={`nav-link fw-semibold ${subTabActivo === 'pedidos' ? 'active text-success' : 'text-secondary'}`}
                            onClick={() => setSubTabActivo('pedidos')}
                            type="button"
                        >
                            <i className="fa-solid fa-clock-rotate-left me-1"></i>Mis Pedidos
                        </button>
                    </li>
                </ul>

                {/* Contenidos de Sub-pestañas */}
                <div className="tab-content">
                    {/* EDITAR DATOS */}
                    {subTabActivo === 'editar' && (
                        <form onSubmit={handleSubmit}>
                            <p className="fw-semibold text-muted small text-uppercase mb-3"><i className="fa-solid fa-pen-to-square me-1"></i>Información personal</p>

                            {/* RUN (Bloqueado) */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold text-muted">RUN</label>
                                <input type="text" className="form-control bg-light text-muted" value={usuarioSesion.run} disabled />
                            </div>

                            {/* Nombre */}
                            <div className="mb-3">
                                <label htmlFor="perfil-nombre" className="form-label fw-semibold">Nombre *</label>
                                <input 
                                    type="text" 
                                    className={`form-control ${errores['perfil-nombre'] ? 'is-invalid' : ''}`} 
                                    id="perfil-nombre" 
                                    value={valores['perfil-nombre']}
                                    onChange={handleChange}
                                    maxLength="50"
                                />
                                <div className="invalid-feedback">El nombre es requerido (máx. 50 caracteres).</div>
                            </div>

                            {/* Apellidos */}
                            <div className="mb-3">
                                <label htmlFor="perfil-apellidos" className="form-label fw-semibold">Apellidos *</label>
                                <input 
                                    type="text" 
                                    className={`form-control ${errores['perfil-apellidos'] ? 'is-invalid' : ''}`} 
                                    id="perfil-apellidos" 
                                    value={valores['perfil-apellidos']}
                                    onChange={handleChange}
                                    maxLength="100"
                                />
                                <div className="invalid-feedback">Los apellidos son requeridos (máx. 100 caracteres).</div>
                            </div>

                            {/* Teléfono */}
                            <div className="mb-3">
                                <label htmlFor="perfil-telefono" className="form-label fw-semibold">
                                    <i className="fa-solid fa-phone me-1 text-success"></i>Número de Contacto
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text">+56</span>
                                    <input 
                                        type="tel" 
                                        className={`form-control ${errores['perfil-telefono'] ? 'is-invalid' : ''}`} 
                                        id="perfil-telefono" 
                                        placeholder="912345678" 
                                        value={valores['perfil-telefono']}
                                        onChange={handleChange}
                                        maxLength="9"
                                    />
                                </div>
                                <div className="invalid-feedback">Ingresa un número válido de 9 dígitos (debe comenzar con 9).</div>
                                <div className="form-text text-muted">Ej: 912345678 (sin el +56)</div>
                            </div>

                            <hr className="my-4" />
                            <p className="fw-semibold text-muted small text-uppercase mb-3"><i className="fa-solid fa-truck me-1"></i>Dirección de Entrega</p>

                            {/* Región */}
                            <div className="mb-3">
                                <label htmlFor="perfil-region" className="form-label fw-semibold">Región *</label>
                                <select 
                                    id="perfil-region" 
                                    className={`form-select ${errores['perfil-region'] ? 'is-invalid' : ''}`}
                                    value={valores['perfil-region']}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccione Región</option>
                                    {regiones.map(r => (
                                        <option key={r.id} value={r.nombre}>{r.nombre}</option>
                                    ))}
                                </select>
                                <div className="invalid-feedback">Selecciona una región.</div>
                            </div>

                            {/* Comuna */}
                            <div className="mb-3">
                                <label htmlFor="perfil-comuna" className="form-label fw-semibold">Comuna *</label>
                                <select 
                                    id="perfil-comuna" 
                                    className={`form-select ${errores['perfil-comuna'] ? 'is-invalid' : ''}`}
                                    value={valores['perfil-comuna']}
                                    onChange={handleChange}
                                    disabled={!valores['perfil-region']}
                                >
                                    <option value="">Seleccione Comuna</option>
                                    {comunasDisponibles.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                <div className="invalid-feedback">Selecciona una comuna.</div>
                            </div>

                            {/* Dirección */}
                            <div className="mb-3">
                                <label htmlFor="perfil-direccion" className="form-label fw-semibold">Dirección de Despacho *</label>
                                <input 
                                    type="text" 
                                    className={`form-control ${errores['perfil-direccion'] ? 'is-invalid' : ''}`} 
                                    id="perfil-direccion" 
                                    value={valores['perfil-direccion']}
                                    onChange={handleChange}
                                    maxLength="300"
                                />
                                <div className="invalid-feedback">La dirección es requerida (máx. 300 caracteres).</div>
                            </div>

                            <div className="d-grid mt-4">
                                <button type="submit" className="btn btn-primary-hh btn-lg fs-6 shadow-sm">
                                    <i className="fa-solid fa-floppy-disk me-2"></i>Guardar Cambios
                                </button>
                            </div>
                        </form>
                    )}

                    {/* MIS PEDIDOS */}
                    {subTabActivo === 'pedidos' && (
                        <div>
                            {/* Botón repetir último pedido */}
                            {misPedidos.length > 0 && (
                                <div className="mb-4">
                                    <button 
                                        className="btn btn-outline-success w-100 fw-semibold py-2 shadow-sm" 
                                        onClick={handleRepetirPedido}
                                    >
                                        <i className="fa-solid fa-rotate-right me-2"></i>Repetir último pedido ({misPedidos[0].id})
                                    </button>
                                </div>
                            )}

                            {/* Listado */}
                            {misPedidos.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="fa-solid fa-box-open fs-1 mb-3 d-block text-muted"></i>
                                    <p className="text-muted fw-semibold">Aún no tienes pedidos realizados.</p>
                                    <button onClick={() => navigate('/productos')} className="btn btn-primary-hh btn-sm mt-2">
                                        <i className="fa-solid fa-store me-1"></i>Ir al catálogo
                                    </button>
                                </div>
                            ) : (
                                misPedidos.map((orden, idx) => (
                                    <div key={orden.id} className={`orden-card ${idx === 0 ? "orden-card--ultimo border border-success" : ""} mb-3 p-3 rounded shadow-sm bg-light`}>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <div>
                                                <span className="fw-bold text-success">{orden.id}</span>
                                                {idx === 0 && <span className="badge bg-success ms-2" style={{ fontSize: '0.7rem' }}>Último</span>}
                                            </div>
                                            <span className="small text-muted">
                                                <i className="fa-regular fa-calendar me-1"></i>{orden.fecha}
                                            </span>
                                        </div>
                                        
                                        <ul className="list-unstyled mb-2 border-top border-bottom py-2 my-2">
                                            {orden.items.map(it => (
                                                <li key={it.id} className="d-flex justify-content-between align-items-center py-1">
                                                    <span><i className="fa-solid fa-leaf text-success me-1"></i>{it.nombre}</span>
                                                    <span className="text-muted small">{it.cantidad} × ${it.precio.toLocaleString("es-CL")}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="small text-muted">
                                                <i className="fa-solid fa-location-dot me-1"></i>{orden.cliente.comuna}, {orden.cliente.region}
                                            </span>
                                            <span className="fw-bold text-success">${orden.total.toLocaleString("es-CL")} CLP</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

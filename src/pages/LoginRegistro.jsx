import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { validarRUT, validarFormulario } from '../utils/validaciones';

export default function LoginRegistro() {
    const { usuarioSesion, login, registrarUsuario, regiones } = useContext(AppContext);
    const navigate = useNavigate();

    // Redireccionar si ya tiene sesión iniciada
    useEffect(() => {
        if (usuarioSesion) {
            if (usuarioSesion.tipo === 'Administrador' || usuarioSesion.tipo === 'Vendedor') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
    }, [usuarioSesion, navigate]);

    // Control de Tab Activo ("login" o "registro")
    const [tabActivo, setTabActivo] = useState('login');

    // Estado Formulario Login
    const [loginValores, setLoginValores] = useState({
        'login-correo': '',
        'login-contrasena': ''
    });
    const [loginErrores, setLoginErrores] = useState({});

    // Estado Formulario Registro
    const [regValores, setRegValores] = useState({
        'reg-run': '',
        'reg-nombre': '',
        'reg-apellidos': '',
        'reg-correo': '',
        'reg-region': '',
        'reg-comuna': '',
        'reg-direccion': '',
        'reg-contrasena': ''
    });
    const [regErrores, setRegErrores] = useState({});
    const [comunasDisponibles, setComunasDisponibles] = useState([]);

    // Regiones/Comunas: Cargar comunas de la región seleccionada
    useEffect(() => {
        if (regValores['reg-region']) {
            const regionObj = regiones.find(r => r.nombre === regValores['reg-region']);
            if (regionObj) {
                setComunasDisponibles(regionObj.comunas);
                // Si la comuna actual no está en la nueva región, resetearla
                if (!regionObj.comunas.includes(regValores['reg-comuna'])) {
                    setRegValores(prev => ({ ...prev, 'reg-comuna': '' }));
                }
            } else {
                setComunasDisponibles([]);
            }
        } else {
            setComunasDisponibles([]);
        }
    }, [regValores['reg-region'], regiones]);

    // Reglas de validación
    const loginReglas = {
        'login-correo': { 
            required: true, 
            maxLength: 100, 
            pattern: /^[a-zA-Z0-9._%+-]+@(?:inacap\.cl|inacapmail\.cl|gmail\.com)$/ 
        },
        'login-contrasena': { required: true, minLength: 4, maxLength: 10 }
    };

    const registroReglas = {
        'reg-run': { required: true, custom: (val) => validarRUT(val) },
        'reg-nombre': { required: true, maxLength: 50 },
        'reg-apellidos': { required: true, maxLength: 100 },
        'reg-correo': { 
            required: true, 
            maxLength: 100, 
            pattern: /^[a-zA-Z0-9._%+-]+@(?:inacap\.cl|inacapmail\.cl|gmail\.com)$/ 
        },
        'reg-region': { required: true },
        'reg-comuna': { required: true },
        'reg-direccion': { required: true, maxLength: 300 },
        'reg-contrasena': { required: true, minLength: 4, maxLength: 10 }
    };

    // Manejador inputs Login
    const handleLoginChange = (e) => {
        const { id, value } = e.target;
        setLoginValores(prev => ({ ...prev, [id]: value }));
        // Limpieza de error
        setLoginErrores(prev => ({ ...prev, [id]: false }));
    };

    // Manejador inputs Registro
    const handleRegChange = (e) => {
        const { id, value } = e.target;
        setRegValores(prev => ({ ...prev, [id]: value }));
        setRegErrores(prev => ({ ...prev, [id]: false }));
    };

    // Submit Login
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        const { errores, esValido } = validarFormulario(loginValores, loginReglas);
        setLoginErrores(errores);

        if (esValido) {
            login(loginValores['login-correo'].trim(), loginValores['login-contrasena']);
        }
    };

    // Submit Registro
    const handleRegSubmit = (e) => {
        e.preventDefault();
        const { errores, esValido } = validarFormulario(regValores, registroReglas);
        setRegErrores(errores);

        if (esValido) {
            const nuevoUsuario = {
                run: regValores['reg-run'].replace(/\s+/g, '').toUpperCase(),
                nombre: regValores['reg-nombre'].trim(),
                apellidos: regValores['reg-apellidos'].trim(),
                correo: regValores['reg-correo'].trim(),
                contrasena: regValores['reg-contrasena'],
                tipo: 'Cliente',
                region: regValores['reg-region'],
                comuna: regValores['reg-comuna'],
                direccion: regValores['reg-direccion'].trim()
            };

            const exito = registrarUsuario(nuevoUsuario);
            if (exito) {
                // Limpiar formulario y cambiar a tab login
                setRegValores({
                    'reg-run': '',
                    'reg-nombre': '',
                    'reg-apellidos': '',
                    'reg-correo': '',
                    'reg-region': '',
                    'reg-comuna': '',
                    'reg-direccion': '',
                    'reg-contrasena': ''
                });
                setRegErrores({});
                setTabActivo('login');
            }
        }
    };

    return (
        <div className="container my-5" style={{ maxWidth: '600px' }}>
            <div className="card shadow border-0 rounded-4 p-4 bg-white">
                <div className="text-center mb-4">
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                        <img 
                            src="/src/assets/imagenes/logoHuerto.jpeg" 
                            alt="Logo HuertoHogar" 
                            style={{ height: '55px', borderRadius: '8px', objectFit: 'cover' }} 
                        />
                        <span className="fs-2 fw-bold" style={{ color: 'var(--hh-secondary)', fontFamily: "'Playfair Display', serif" }}>
                            HuertoHogar
                        </span>
                    </div>
                    <p className="text-muted small">Crea tu cuenta de cliente o inicia sesión para gestionar tus pedidos.</p>
                </div>

                {/* TABS nav-pills */}
                <ul className="nav nav-pills nav-fill mb-4 bg-light p-1 rounded" id="loginRegisterTabs" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button 
                            className={`nav-link rounded fw-bold py-2 ${tabActivo === 'login' ? 'active bg-success text-white shadow-sm' : 'text-secondary'}`}
                            onClick={() => setTabActivo('login')}
                            type="button"
                        >
                            Iniciar Sesión
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button 
                            className={`nav-link rounded fw-bold py-2 ${tabActivo === 'registro' ? 'active bg-success text-white shadow-sm' : 'text-secondary'}`}
                            onClick={() => setTabActivo('registro')}
                            type="button"
                        >
                            Registrarse
                        </button>
                    </li>
                </ul>

                <div className="tab-content" id="loginRegisterTabsContent">
                    {/* FORMULARIO INICIAR SESIÓN */}
                    {tabActivo === 'login' && (
                        <div className="tab-pane fade show active" role="tabpanel">
                            <form onSubmit={handleLoginSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="login-correo" className="form-label fw-semibold">Correo Electrónico *</label>
                                    <input 
                                        type="email" 
                                        className={`form-control ${loginErrores['login-correo'] ? 'is-invalid' : ''}`}
                                        id="login-correo" 
                                        placeholder="correo@gmail.com" 
                                        value={loginValores['login-correo']}
                                        onChange={handleLoginChange}
                                    />
                                    <div className="invalid-feedback">
                                        Ingresa un correo válido (Máx. 100 caracteres. Dominios permitidos: @inacap.cl, @inacapmail.cl o @gmail.com).
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="login-contrasena" className="form-label fw-semibold">Contraseña *</label>
                                    <input 
                                        type="password" 
                                        className={`form-control ${loginErrores['login-contrasena'] ? 'is-invalid' : ''}`}
                                        id="login-contrasena" 
                                        placeholder="••••••••" 
                                        value={loginValores['login-contrasena']}
                                        onChange={handleLoginChange}
                                    />
                                    <div className="invalid-feedback">La contraseña es obligatoria y debe tener entre 4 y 10 caracteres.</div>
                                </div>
                                <div className="d-grid mt-4">
                                    <button type="submit" className="btn btn-primary-hh btn-lg fs-6 shadow-sm">
                                        <i className="fa-solid fa-arrow-right-to-bracket me-2"></i>Ingresar a mi Cuenta
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* FORMULARIO REGISTRARSE */}
                    {tabActivo === 'registro' && (
                        <div className="tab-pane fade show active" role="tabpanel">
                            <form onSubmit={handleRegSubmit}>
                                {/* RUN */}
                                <div className="mb-3">
                                    <label htmlFor="reg-run" class="form-label fw-semibold">RUN (Sin puntos ni guion) *</label>
                                    <input 
                                        type="text" 
                                        className={`form-control ${regErrores['reg-run'] ? 'is-invalid' : ''}`}
                                        id="reg-run" 
                                        placeholder="Ej: 12345678K"
                                        value={regValores['reg-run']}
                                        onChange={handleRegChange}
                                    />
                                    <div className="invalid-feedback">RUN inválido. Debe tener entre 7 y 9 dígitos y dígito verificador correcto (sin puntos ni guion).</div>
                                </div>

                                {/* Nombre */}
                                <div className="mb-3">
                                    <label htmlFor="reg-nombre" className="form-label fw-semibold">Nombre *</label>
                                    <input 
                                        type="text" 
                                        className={`form-control ${regErrores['reg-nombre'] ? 'is-invalid' : ''}`}
                                        id="reg-nombre" 
                                        placeholder="Nombre"
                                        value={regValores['reg-nombre']}
                                        onChange={handleRegChange}
                                    />
                                    <div className="invalid-feedback">El nombre es requerido (máx. 50 caracteres).</div>
                                </div>

                                {/* Apellidos */}
                                <div className="mb-3">
                                    <label htmlFor="reg-apellidos" className="form-label fw-semibold">Apellidos *</label>
                                    <input 
                                        type="text" 
                                        className={`form-control ${regErrores['reg-apellidos'] ? 'is-invalid' : ''}`}
                                        id="reg-apellidos" 
                                        placeholder="Apellidos"
                                        value={regValores['reg-apellidos']}
                                        onChange={handleRegChange}
                                    />
                                    <div className="invalid-feedback">Los apellidos son requeridos (máx. 100 caracteres).</div>
                                </div>

                                {/* Correo */}
                                <div className="mb-3">
                                    <label htmlFor="reg-correo" className="form-label fw-semibold">Correo Electrónico *</label>
                                    <input 
                                        type="email" 
                                        className={`form-control ${regErrores['reg-correo'] ? 'is-invalid' : ''}`}
                                        id="reg-correo" 
                                        placeholder="correo@gmail.com"
                                        value={regValores['reg-correo']}
                                        onChange={handleRegChange}
                                    />
                                    <div className="invalid-feedback">Correo requerido. Máx 100 chars. Dominios: @inacap.cl, @inacapmail.cl o @gmail.com.</div>
                                </div>

                                {/* Región */}
                                <div className="mb-3">
                                    <label htmlFor="reg-region" className="form-label fw-semibold">Región *</label>
                                    <select 
                                        id="reg-region" 
                                        className={`form-select ${regErrores['reg-region'] ? 'is-invalid' : ''}`}
                                        value={regValores['reg-region']}
                                        onChange={handleRegChange}
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
                                    <label htmlFor="reg-comuna" className="form-label fw-semibold">Comuna *</label>
                                    <select 
                                        id="reg-comuna" 
                                        className={`form-select ${regErrores['reg-comuna'] ? 'is-invalid' : ''}`}
                                        value={regValores['reg-comuna']}
                                        onChange={handleRegChange}
                                        disabled={!regValores['reg-region']}
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
                                    <label htmlFor="reg-direccion" className="form-label fw-semibold">Dirección de Despacho *</label>
                                    <input 
                                        type="text" 
                                        className={`form-control ${regErrores['reg-direccion'] ? 'is-invalid' : ''}`}
                                        id="reg-direccion" 
                                        placeholder="Av. Providencia 123"
                                        value={regValores['reg-direccion']}
                                        onChange={handleRegChange}
                                        maxLength="300"
                                    />
                                    <div className="invalid-feedback">La dirección es requerida (máx. 300 caracteres).</div>
                                </div>

                                {/* Contraseña */}
                                <div className="mb-3">
                                    <label htmlFor="reg-contrasena" className="form-label fw-semibold">Contraseña *</label>
                                    <input 
                                        type="password" 
                                        className={`form-control ${regErrores['reg-contrasena'] ? 'is-invalid' : ''}`}
                                        id="reg-contrasena" 
                                        placeholder="••••••••"
                                        value={regValores['reg-contrasena']}
                                        onChange={handleRegChange}
                                    />
                                    <div className="invalid-feedback">Contraseña requerida (entre 4 y 10 caracteres).</div>
                                </div>

                                {/* Botón Enviar */}
                                <div className="d-grid mt-4">
                                    <button type="submit" className="btn btn-primary-hh btn-lg fs-6 shadow-sm">
                                        <i className="fa-solid fa-user-plus me-2"></i>Crear Cuenta
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

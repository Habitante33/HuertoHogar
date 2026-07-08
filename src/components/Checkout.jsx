import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { validarFormulario } from '../utils/validaciones';

export default function Checkout() {
    const { 
        carrito, 
        productos, 
        usuarioSesion, 
        regiones, 
        crearOrden,
        mostrarNotificacion 
    } = useContext(AppContext);

    const navigate = useNavigate();

    // Redireccionar si el carrito está vacío
    useEffect(() => {
        if (carrito.length === 0) {
            navigate('/carrito');
        }
    }, [carrito, navigate]);

    // Estado del Formulario
    const [valores, setValores] = useState({
        'cart-region': '',
        'cart-comuna': '',
        'cart-direccion': ''
    });
    const [errores, setErrores] = useState({});
    const [comunasDisponibles, setComunasDisponibles] = useState([]);
    
    // Método de pago: "exito" (Webpay Simulado Exitoso) o "fallo" (Webpay Simulado Fallido)
    const [metodoPago, setMetodoPago] = useState('exito');

    // Pre-llenar datos con el usuario autenticado si existe
    useEffect(() => {
        if (usuarioSesion) {
            setValores({
                'cart-region': usuarioSesion.region || '',
                'cart-comuna': usuarioSesion.comuna || '',
                'cart-direccion': usuarioSesion.direccion || ''
            });
        }
    }, [usuarioSesion]);

    // Cargar comunas de la región seleccionada
    useEffect(() => {
        if (valores['cart-region']) {
            const regionObj = regiones.find(r => r.nombre === valores['cart-region']);
            if (regionObj) {
                setComunasDisponibles(regionObj.comunas);
            } else {
                setComunasDisponibles([]);
            }
        } else {
            setComunasDisponibles([]);
        }
    }, [valores['cart-region'], regiones]);

    if (carrito.length === 0) return null;

    // Obtener detalles de productos del carrito
    const itemsCompletos = carrito.map(item => {
        const prod = productos.find(p => p.id === item.id);
        return {
            ...item,
            producto: prod
        };
    }).filter(item => item.producto !== undefined);

    const subtotal = itemsCompletos.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);

    // Reglas de validación
    const reglasEnvio = {
        'cart-region': { required: true },
        'cart-comuna': { required: true },
        'cart-direccion': { required: true, maxLength: 300 }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setValores(prev => ({ ...prev, [id]: value }));
        setErrores(prev => ({ ...prev, [id]: false }));
    };

    const handleConfirmarPago = (e) => {
        e.preventDefault();

        // Validar campos
        const { errores: errs, esValido } = validarFormulario(valores, reglasEnvio);
        setErrores(errs);

        if (!esValido) {
            mostrarNotificacion("Por favor, rellena los datos de despacho obligatorios.", "warning");
            return;
        }

        if (metodoPago === 'fallo') {
            // Simular pago fallido
            navigate('/checkout/failure');
            return;
        }

        // Crear la orden de compra exitosa
        const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);
        const nombreCliente = usuarioSesion ? `${usuarioSesion.nombre} ${usuarioSesion.apellidos}` : "Cliente Invitado";
        const fechaActual = new Date();
        const fechaStr = fechaActual.toLocaleDateString("es-CL") + " " + fechaActual.toLocaleTimeString("es-CL", { hour: '2-digit', minute: '2-digit' });

        const nuevaOrden = {
            id: orderId,
            clienteRun: usuarioSesion ? usuarioSesion.run : null,
            cliente: {
                nombre: nombreCliente,
                region: valores['cart-region'],
                comuna: valores['cart-comuna'],
                direccion: valores['cart-direccion'].trim()
            },
            items: itemsCompletos.map(item => ({
                id: item.id,
                nombre: item.producto.nombre,
                precio: item.producto.precio,
                cantidad: item.cantidad
            })),
            total: subtotal,
            fecha: fechaStr
        };

        // Guardar orden y vaciar carrito (a través del context)
        crearOrden(nuevaOrden);

        // Redirigir a éxito pasándole el id de la orden
        navigate(`/checkout/success?orderId=${orderId}`);
    };

    return (
        <div className="container py-5">
            {/* Breadcrumb */}
            <div className="row mb-3">
                <div className="col-12">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/" className="text-success text-decoration-none">Inicio</Link></li>
                            <li className="breadcrumb-item"><Link to="/carrito" className="text-success text-decoration-none">Carrito</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Procesar Pago</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                {/* Formulario por pasos (Despacho + Simulación de Pasarela) */}
                <div className="col-lg-7">
                    <div className="card border-0 shadow-sm p-4 bg-white border rounded-4 mb-4">
                        <h4 className="fw-bold mb-4" style={{ color: 'var(--hh-secondary)' }}>
                            <i className="fa-solid fa-truck text-success me-2"></i> 1. Datos de Despacho
                        </h4>
                        
                        <form onSubmit={handleConfirmarPago}>
                            {/* Región */}
                            <div className="mb-3">
                                <label htmlFor="cart-region" className="form-label fw-bold">Región *</label>
                                <select 
                                    id="cart-region" 
                                    className={`form-select ${errores['cart-region'] ? 'is-invalid' : ''}`}
                                    value={valores['cart-region']}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccione Región</option>
                                    {regiones.map(r => (
                                        <option key={r.id} value={r.nombre}>{r.nombre}</option>
                                    ))}
                                </select>
                                <div className="invalid-feedback">La región es obligatoria.</div>
                            </div>

                            {/* Comuna */}
                            <div className="mb-3">
                                <label htmlFor="cart-comuna" className="form-label fw-bold">Comuna *</label>
                                <select 
                                    id="cart-comuna" 
                                    className={`form-select ${errores['cart-comuna'] ? 'is-invalid' : ''}`}
                                    value={valores['cart-comuna']}
                                    onChange={handleChange}
                                    disabled={!valores['cart-region']}
                                >
                                    <option value="">Seleccione Comuna</option>
                                    {comunasDisponibles.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                <div className="invalid-feedback">La comuna es obligatoria.</div>
                            </div>

                            {/* Dirección */}
                            <div className="mb-4">
                                <label htmlFor="cart-direccion" className="form-label fw-bold">Dirección de Despacho *</label>
                                <input 
                                    type="text" 
                                    id="cart-direccion" 
                                    className={`form-control ${errores['cart-direccion'] ? 'is-invalid' : ''}`}
                                    placeholder="Calle, número, departamento/casa" 
                                    value={valores['cart-direccion']}
                                    onChange={handleChange}
                                    maxLength="300"
                                />
                                <div className="invalid-feedback">La dirección es obligatoria (máx. 300 caracteres).</div>
                            </div>

                            <hr className="my-4" />

                            <h4 className="fw-bold mb-4" style={{ color: 'var(--hh-secondary)' }}>
                                <i className="fa-solid fa-credit-card text-success me-2"></i> 2. Simulación de Pasarela de Pago
                            </h4>
                            
                            <div className="p-3 bg-light rounded-3 border mb-4">
                                <p className="small text-muted mb-3">
                                    Simula una transacción bancaria. Puedes escoger si la pasarela retornará una transacción aprobada o fallida para evaluar ambos flujos.
                                </p>
                                
                                <div className="form-check mb-2">
                                    <input 
                                        className="form-check-input text-success" 
                                        type="radio" 
                                        name="paymentSim" 
                                        id="sim-exito" 
                                        value="exito"
                                        checked={metodoPago === 'exito'}
                                        onChange={() => setMetodoPago('exito')}
                                    />
                                    <label className="form-check-label fw-bold" htmlFor="sim-exito">
                                        🟢 Transacción Aprobada (Webpay Simulado Éxito)
                                    </label>
                                </div>
                                
                                <div className="form-check">
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="paymentSim" 
                                        id="sim-fallo" 
                                        value="fallo"
                                        checked={metodoPago === 'fallo'}
                                        onChange={() => setMetodoPago('fallo')}
                                    />
                                    <label className="form-check-label fw-bold text-danger" htmlFor="sim-fallo">
                                        🔴 Transacción Declinada (Webpay Simulado Fallo)
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary-hh btn-lg w-100 py-3 shadow-sm">
                                <i className="fa-solid fa-lock me-2"></i> Pagar y Finalizar Compra
                            </button>
                        </form>
                    </div>
                </div>

                {/* Resumen Lateral */}
                <div className="col-lg-5">
                    <div className="card border-0 shadow-sm p-4 bg-light border rounded-4">
                        <h5 className="fw-bold border-bottom pb-2 mb-3" style={{ color: 'var(--hh-secondary)' }}>Resumen de tu compra</h5>
                        
                        <div className="mb-4" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                            {itemsCompletos.map(item => (
                                <div key={item.id} className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <span className="fw-bold text-dark d-block" style={{ fontSize: '0.95rem' }}>{item.producto.nombre}</span>
                                        <small className="text-muted">{item.cantidad} unidad(es) × ${item.producto.price ? item.producto.price.toLocaleString("es-CL") : item.producto.precio.toLocaleString("es-CL")}</small>
                                    </div>
                                    <span className="fw-semibold text-dark">
                                        ${(item.producto.precio * item.cantidad).toLocaleString("es-CL")} CLP
                                    </span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="d-flex justify-content-between mb-2">
                            <span>Subtotal:</span>
                            <span className="fw-semibold">${subtotal.toLocaleString("es-CL")} CLP</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <span>Costo de Despacho:</span>
                            <span className="text-success fw-semibold">Gratis</span>
                        </div>
                        <div className="d-flex justify-content-between fs-5 fw-bold border-top pt-2">
                            <span>Total a Pagar:</span>
                            <span className="text-success">${subtotal.toLocaleString("es-CL")} CLP</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

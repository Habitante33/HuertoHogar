import React from 'react';
import { Link } from 'react-router-dom';

export default function CompraFallida() {
    return (
        <div className="container py-5 text-center" style={{ maxWidth: '600px' }}>
            <div className="card shadow border-0 rounded-4 p-5 bg-white border">
                <div className="text-danger fs-1 mb-3">
                    <i className="fa-solid fa-circle-xmark fa-shake"></i>
                </div>
                <h2 className="fw-bold mb-2 text-danger">No se pudo realizar el pago</h2>
                <p className="text-muted mb-4 fs-6">
                    Lo sentimos, la pasarela de pago simulada ha declinado tu transacción bancaria. Esto puede deberse a fondos insuficientes, tarjeta inválida o rechazo automático de prueba.
                </p>

                <div className="p-3 border rounded-3 bg-light text-start mb-4">
                    <span className="d-block fw-bold text-dark mb-1">
                        <i className="fa-solid fa-triangle-exclamation text-warning me-2"></i>Sugerencias para solucionar el problema:
                    </span>
                    <ul className="small text-muted ps-3 mb-0">
                        <li>Verifica los datos de despacho e ingresa una dirección válida.</li>
                        <li>Cambia la opción de simulación a "Transacción Aprobada" para proceder con éxito.</li>
                        <li>Comprueba que tienes conexión estable a internet.</li>
                    </ul>
                </div>

                <div className="d-flex flex-column gap-2">
                    <Link to="/checkout" className="btn btn-danger btn-lg fs-6 shadow-sm py-2">
                        <i className="fa-solid fa-rotate-left me-2"></i>Volver a Intentar el Pago
                    </Link>
                    <Link to="/carrito" className="btn btn-outline-secondary">
                        Regresar al Carrito de Compras
                    </Link>
                </div>
            </div>
        </div>
    );
}

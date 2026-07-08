import React from 'react';

export default function AlertaStock({ stock, stockCritico }) {
    if (stock > stockCritico) return null;

    return (
        <div className="alert alert-warning py-2 mb-3" role="alert" style={{ fontSize: '0.85rem' }}>
            ⚠️ <b>¡Advertencia de Stock Crítico!</b> Solo quedan {stock} unidades disponibles en el inventario.
        </div>
    );
}

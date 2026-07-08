import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { useAuth } from '../../context/AuthContext';
import storageService from '../../services/storageService';

export default function AdminSectionPage({ title, description, icon, children }) {
    const { productos, categorias } = useInventory();
    const { rolSimulado } = useAuth();
    const ordenes = storageService.orders.getAll();
    const usuarios = storageService.users.getAll();
    const totalStock = productos.reduce((sum, producto) => sum + (producto.stock || 0), 0);

    return (
        <div>
            <div className="mb-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="fs-4 text-success">{icon}</span>
                    <h2 className="fw-bold text-dark mb-0">{title}</h2>
                </div>
                <p className="text-muted small mb-0">{description}</p>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-3 rounded-3 bg-white">
                        <div className="small text-muted">Órdenes</div>
                        <div className="fs-3 fw-bold text-success">{ordenes.length}</div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-3 rounded-3 bg-white">
                        <div className="small text-muted">Productos</div>
                        <div className="fs-3 fw-bold text-success">{productos.length}</div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-3 rounded-3 bg-white">
                        <div className="small text-muted">Usuarios</div>
                        <div className="fs-3 fw-bold text-success">{usuarios.length}</div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm p-4 bg-white rounded-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h5 className="fw-bold mb-1">Vista {title}</h5>
                        <p className="text-muted small mb-0">Rol activo: {rolSimulado}</p>
                    </div>
                    <span className="badge bg-light text-success border">{categorias.length} categorías · {totalStock} stock</span>
                </div>
                {children}
            </div>
        </div>
    );
}

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { InventoryProvider, useInventory } from './InventoryContext';
import { CartProvider, useCart } from './CartContext';
import { AuthProvider, useAuth } from './AuthContext';
import storageService from '../services/storageService';
import { REGIONES_CHILE, USUARIOS_INICIALES, ORDENES_INICIALES } from './seedData';

export const AppContext = createContext(null);

function AppContextInner({ children }) {
    const { productos, categorias, crearProducto, editarProducto, eliminarProducto, crearCategoria, editarCategoria, eliminarCategoria, getCategoryIcon } = useInventory();
    const { carrito, total, agregarAlCarrito, eliminarDelCarrito, cambiarCantidadItem, actualizarCantidadItem, limpiarCarrito, setCarrito } = useCart();
    const { usuarioSesion, rolSimulado, login, logout, registrarUsuario, actualizarPerfil, cambiarRolSimulado, setUsuarioSesion } = useAuth();

    const [usuarios, setUsuarios] = useState(() => {
        const stored = storageService.users.getAll();
        if (stored.length === 0) {
            USUARIOS_INICIALES.forEach((user) => storageService.users.create(user));
            return storageService.users.getAll();
        }
        return stored;
    });
    const [ordenes, setOrdenes] = useState(() => {
        const stored = storageService.orders.getAll();
        if (stored.length === 0) {
            ORDENES_INICIALES.forEach((order) => storageService.orders.create(order));
            return storageService.orders.getAll();
        }
        return stored;
    });
    const [toasts, setToasts] = useState([]);
    const [regiones] = useState(REGIONES_CHILE);
    const [promptConfig, setPromptConfig] = useState(null);
    const [confirmConfig, setConfirmConfig] = useState(null);

    const mostrarNotificacion = (mensaje, tipo = 'success') => {
        const id = Date.now() + Math.random().toString(36).slice(2, 9);
        const nuevoToast = { id, mensaje, tipo };
        setToasts((prev) => [...prev, nuevoToast]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 4000);
    };

    const cerrarToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const promptHH = (mensaje) => new Promise((resolve) => setPromptConfig({ mensaje, resolve }));
    const confirmHH = (mensaje) => new Promise((resolve) => setConfirmConfig({ mensaje, resolve }));

    const crearUsuario = (usrData) => {
        const exists = usuarios.some((user) => String(user.run).toUpperCase() === String(usrData.run).toUpperCase() || user.correo === usrData.correo);
        if (exists) {
            mostrarNotificacion('Error: RUN o Correo duplicado en base de datos.', 'error');
            return false;
        }
        storageService.users.create(usrData);
        setUsuarios((prev) => [...prev, usrData]);
        mostrarNotificacion('Usuario creado con éxito.', 'success');
        return true;
    };

    const editarUsuario = (run, usrData) => {
        storageService.users.update(run, usrData);
        setUsuarios((prev) => prev.map((user) => String(user.run) === String(run) ? { ...user, ...usrData } : user));
        if (usuarioSesion && String(usuarioSesion.run) === String(run)) {
            setUsuarioSesion({ ...usuarioSesion, ...usrData });
        }
        mostrarNotificacion('Usuario actualizado con éxito.', 'success');
        return true;
    };

    const eliminarUsuario = (run) => {
        if (usuarioSesion && String(usuarioSesion.run) === String(run)) {
            mostrarNotificacion('No puedes eliminar al usuario con la sesión activa actual.', 'warning');
            return false;
        }
        storageService.users.delete(run);
        setUsuarios((prev) => prev.filter((user) => String(user.run) !== String(run)));
        mostrarNotificacion('Usuario eliminado con éxito.', 'info');
        return true;
    };

    const crearOrden = (ordenData) => {
        storageService.orders.create(ordenData);
        setOrdenes((prev) => [...prev, ordenData]);
        limpiarCarrito();
        mostrarNotificacion(`Pedido ${ordenData.id} registrado con éxito.`, 'success');
    };

    const repetirPedido = (ordenId) => {
        const orden = ordenes.find((item) => item.id === ordenId);
        if (!orden) return false;

        let agregados = 0;
        const sinStock = [];
        const nuevoCarrito = [...carrito];

        orden.items.forEach((item) => {
            const producto = productos.find((producto) => String(producto.id) === String(item.id));
            if (!producto) return;

            const enCarrito = nuevoCarrito.find((carro) => String(carro.id) === String(item.id));
            const cantidadEnCarrito = enCarrito ? enCarrito.cantidad : 0;
            const disponible = producto.stock - cantidadEnCarrito;

            if (disponible <= 0) {
                sinStock.push(producto.nombre);
                return;
            }

            const cantidadAgregar = Math.min(item.cantidad, disponible);
            if (enCarrito) {
                enCarrito.cantidad += cantidadAgregar;
            } else {
                nuevoCarrito.push({ id: item.id, cantidad: cantidadAgregar });
            }
            agregados += 1;
        });

        if (nuevoCarrito.length > 0) {
            setCarrito(nuevoCarrito);
        }

        if (sinStock.length > 0) {
            mostrarNotificacion(`Advertencia: Productos sin stock no agregados: ${sinStock.join(', ')}.`, 'warning');
        }

        if (agregados > 0) {
            mostrarNotificacion(`¡Productos del pedido ${orden.id} añadidos al carrito!`, 'success');
            return true;
        }
        return false;
    };

    const value = useMemo(() => ({
        productos,
        usuarios,
        regiones,
        carrito,
        total,
        usuarioSesion,
        rolSimulado,
        ordenes,
        toasts,
        mostrarNotificacion,
        cerrarToast,
        agregarAlCarrito,
        eliminarDelCarrito,
        cambiarCantidadItem,
        actualizarCantidadItem,
        limpiarCarrito,
        login,
        logout,
        registrarUsuario,
        actualizarPerfil,
        cambiarRolSimulado,
        crearProducto,
        editarProducto,
        eliminarProducto,
        crearUsuario,
        editarUsuario,
        eliminarUsuario,
        crearOrden,
        repetirPedido,
        promptConfig,
        setPromptConfig,
        promptHH,
        confirmConfig,
        setConfirmConfig,
        confirmHH,
        categorias,
        crearCategoria,
        editarCategoria,
        eliminarCategoria,
        getCategoryIcon
    }), [productos, usuarios, regiones, carrito, total, usuarioSesion, rolSimulado, ordenes, toasts, categorias, agregarAlCarrito, eliminarDelCarrito, cambiarCantidadItem, actualizarCantidadItem, limpiarCarrito, login, logout, registrarUsuario, actualizarPerfil, cambiarRolSimulado, crearProducto, editarProducto, eliminarProducto, crearUsuario, editarUsuario, eliminarUsuario, crearOrden, repetirPedido, promptConfig, confirmConfig, crearCategoria, editarCategoria, eliminarCategoria, getCategoryIcon]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}

export function AppProvider({ children }) {
    return (
        <InventoryProvider>
            <CartProvider>
                <AuthProvider>
                    <AppContextInner>{children}</AppContextInner>
                </AuthProvider>
            </CartProvider>
        </InventoryProvider>
    );
}

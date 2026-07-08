import React, { createContext, useContext, useMemo, useState, useRef, useEffect } from 'react';
import { useInventory } from './InventoryContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { productos } = useInventory();
    const [carrito, setCarrito] = useState([]);
    const carritoRef = useRef([]);

    useEffect(() => {
        carritoRef.current = carrito;
    }, [carrito]);

    const total = useMemo(() => {
        return carrito.reduce((sum, item) => {
            const producto = productos.find((p) => String(p.id) === String(item.id));
            return sum + (producto ? producto.precio * item.cantidad : 0);
        }, 0);
    }, [carrito, productos]);

    const agregarAlCarrito = (id, cantidad = 1) => {
        const producto = productos.find((p) => String(p.id) === String(id));
        if (!producto) return false;

        const currentItems = carritoRef.current;
        const itemExistente = currentItems.find((item) => String(item.id) === String(id));
        const cantidadActual = itemExistente ? itemExistente.cantidad : 0;
        const cantidadNueva = cantidadActual + cantidad;

        if (cantidadNueva > producto.stock) {
            return false;
        }

        let nextItems;
        if (itemExistente) {
            nextItems = currentItems.map((item) => String(item.id) === String(id) ? { ...item, cantidad: cantidadNueva } : item);
        } else {
            nextItems = [...currentItems, { id, cantidad }];
        }

        carritoRef.current = nextItems;
        setCarrito(nextItems);
        return true;
    };

    const eliminarDelCarrito = (id) => {
        const nextItems = carritoRef.current.filter((item) => String(item.id) !== String(id));
        carritoRef.current = nextItems;
        setCarrito(nextItems);
    };

    const cambiarCantidadItem = (id, cambio) => {
        const producto = productos.find((p) => String(p.id) === String(id));
        const maxStock = producto ? producto.stock : Infinity;

        const nextItems = carritoRef.current.flatMap((item) => {
            if (String(item.id) !== String(id)) {
                return [item];
            }

            const nuevaCantidad = item.cantidad + cambio;
            if (nuevaCantidad <= 0) {
                return [];
            }

            if (nuevaCantidad > maxStock) {
                return [item];
            }

            return [{ ...item, cantidad: nuevaCantidad }];
        });

        carritoRef.current = nextItems;
        setCarrito(nextItems);
    };

    const limpiarCarrito = () => {
        carritoRef.current = [];
        setCarrito([]);
    };

    const actualizarCantidadItem = (id, nuevaCantidad) => {
        const producto = productos.find((p) => String(p.id) === String(id));
        const maxStock = producto ? producto.stock : Infinity;

        const nextItems = carritoRef.current.map((item) => {
            if (String(item.id) === String(id)) {
                const cantidadValida = Math.max(1, Math.min(nuevaCantidad, maxStock));
                return { ...item, cantidad: cantidadValida };
            }
            return item;
        });

        carritoRef.current = nextItems;
        setCarrito(nextItems);
    };

    const value = useMemo(() => ({
        carrito,
        total,
        agregarAlCarrito,
        eliminarDelCarrito,
        cambiarCantidadItem,
        actualizarCantidadItem,
        limpiarCarrito,
        setCarrito
    }), [carrito, total, productos]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

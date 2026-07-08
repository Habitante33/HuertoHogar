import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import storageService from '../services/storageService';
import { PRODUCTOS_INICIALES } from './seedData';
import { getEmojiPorCategoria } from '../components/TarjetaProducto';

const InventoryContext = createContext(null);

const CATEGORY_ICONS_KEY = 'categorias_iconos_hh';

function readCategoryIcons() {
    try {
        const raw = localStorage.getItem(CATEGORY_ICONS_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (error) {
        console.error('Error al leer iconos de categorías:', error);
        return {};
    }
}

function writeCategoryIcons(data) {
    try {
        localStorage.setItem(CATEGORY_ICONS_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Error al guardar iconos de categorías:', error);
    }
}

export function InventoryProvider({ children }) {
    const [productos, setProductos] = useState(() => storageService.products.getAll());
    const [categorias, setCategorias] = useState(() => storageService.categories.getAll());
    const [categoryIcons, setCategoryIcons] = useState(() => readCategoryIcons());

    useEffect(() => {
        const storedProducts = storageService.products.getAll();
        if (storedProducts.length === 0) {
            PRODUCTOS_INICIALES.forEach((producto) => storageService.products.create(producto));
            setProductos(storageService.products.getAll());
        } else {
            setProductos(storedProducts);
        }

        const storedCategories = storageService.categories.getAll();
        if (storedCategories.length === 0) {
            const seedCategories = ['Frutas Frescas', 'Verduras Orgánicas', 'Productos Orgánicos', 'Productos Lácteos'];
            seedCategories.forEach((categoria) => storageService.categories.create(categoria));
            setCategorias(storageService.categories.getAll());
        } else {
            setCategorias(storedCategories);
        }
    }, []);

    const getCategoryIcon = (nombre) => {
        if (!nombre) return getEmojiPorCategoria(nombre);
        return categoryIcons[nombre] || getEmojiPorCategoria(nombre);
    };

    const guardarIconoCategoria = (nombre, icono) => {
        const nextIcons = { ...categoryIcons };
        if (icono) {
            nextIcons[nombre] = icono;
        } else {
            delete nextIcons[nombre];
        }
        setCategoryIcons(nextIcons);
        writeCategoryIcons(nextIcons);
    };

    const crearProducto = (producto) => {
        const created = storageService.products.create(producto);
        setProductos((prev) => [...prev, created]);
        return created;
    };

    const editarProducto = (id, updates) => {
        const updated = storageService.products.update(id, updates);
        if (!updated) {
            return null;
        }
        setProductos((prev) => prev.map((producto) => String(producto.id) === String(id) ? { ...producto, ...updated } : producto));
        return updated;
    };

    const eliminarProducto = (id) => {
        const deleted = storageService.products.delete(id);
        if (!deleted) {
            return false;
        }
        setProductos((prev) => prev.filter((producto) => String(producto.id) !== String(id)));
        return true;
    };

    const crearCategoria = (nombre, icono = null) => {
        const created = storageService.categories.create(nombre);
        if (!created) {
            return null;
        }
        setCategorias((prev) => [...prev, created]);
        guardarIconoCategoria(nombre, icono);
        return created;
    };

    const editarCategoria = (oldValue, newValue, icono = null) => {
        const updated = storageService.categories.update(oldValue, newValue);
        if (!updated) {
            return null;
        }
        setCategorias((prev) => prev.map((categoria) => String(categoria) === String(oldValue) ? newValue : categoria));
        const previousIcon = categoryIcons[oldValue];
        if (icono === null) {
            const nextIcons = { ...categoryIcons };
            delete nextIcons[oldValue];
            if (newValue) {
                nextIcons[newValue] = previousIcon || '';
            }
            setCategoryIcons(nextIcons);
            writeCategoryIcons(nextIcons);
        } else if (icono) {
            guardarIconoCategoria(newValue, icono);
            delete categoryIcons[oldValue];
            writeCategoryIcons({ ...categoryIcons, [newValue]: icono });
        } else {
            guardarIconoCategoria(newValue, null);
            delete categoryIcons[oldValue];
            writeCategoryIcons({ ...categoryIcons, [newValue]: '' });
        }
        return updated;
    };

    const eliminarCategoria = (nombre) => {
        const deleted = storageService.categories.delete(nombre);
        if (!deleted) {
            return false;
        }
        setCategorias((prev) => prev.filter((categoria) => String(categoria) !== String(nombre)));
        const nextIcons = { ...categoryIcons };
        delete nextIcons[nombre];
        setCategoryIcons(nextIcons);
        writeCategoryIcons(nextIcons);
        return true;
    };

    const value = useMemo(() => ({
        productos,
        categorias,
        setProductos,
        setCategorias,
        crearProducto,
        editarProducto,
        eliminarProducto,
        crearCategoria,
        editarCategoria,
        eliminarCategoria,
        getCategoryIcon
    }), [productos, categorias, categoryIcons]);

    return (
        <InventoryContext.Provider value={value}>
            {children}
        </InventoryContext.Provider>
    );
}

export function useInventory() {
    const context = useContext(InventoryContext);
    if (!context) {
        throw new Error('useInventory must be used within an InventoryProvider');
    }
    return context;
}

import React, { createContext, useState, useEffect } from 'react';
import {
    REGIONES_CHILE,
    PRODUCTOS_INICIALES,
    USUARIOS_INICIALES,
    ORDENES_INICIALES,
    DB_VERSION
} from './seedData';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // 1. Inicialización y chequeo de versión de LocalStorage
    const inicializarDatos = () => {
        const versionGuardada = localStorage.getItem("db_version_hh");
        if (versionGuardada !== DB_VERSION) {
            // Guardar datos temporales para no perderlos si es posible, pero resetear base
            const carritoRespaldo = localStorage.getItem("carrito_hh");
            const sesionRespaldo  = localStorage.getItem("usuario_sesion_hh");
            const rolRespaldo     = localStorage.getItem("rol_simulado_hh");

            localStorage.clear();
            localStorage.setItem("db_version_hh", DB_VERSION);

            if (carritoRespaldo) localStorage.setItem("carrito_hh", carritoRespaldo);
            if (sesionRespaldo)  localStorage.setItem("usuario_sesion_hh", sesionRespaldo);
            if (rolRespaldo)     localStorage.setItem("rol_simulado_hh", rolRespaldo);
        }

        // Semillas si no existen
        if (!localStorage.getItem("productos_hh")) {
            localStorage.setItem("productos_hh", JSON.stringify(PRODUCTOS_INICIALES));
        }
        if (!localStorage.getItem("usuarios_hh")) {
            localStorage.setItem("usuarios_hh", JSON.stringify(USUARIOS_INICIALES));
        }
        if (!localStorage.getItem("regiones_hh")) {
            localStorage.setItem("regiones_hh", JSON.stringify(REGIONES_CHILE));
        }
        if (!localStorage.getItem("carrito_hh")) {
            localStorage.setItem("carrito_hh", JSON.stringify([]));
        }
        if (!localStorage.getItem("usuario_sesion_hh")) {
            localStorage.setItem("usuario_sesion_hh", JSON.stringify(null));
        }
        if (!localStorage.getItem("rol_simulado_hh")) {
            localStorage.setItem("rol_simulado_hh", JSON.stringify("Cliente"));
        }
        if (!localStorage.getItem("ordenes_hh")) {
            localStorage.setItem("ordenes_hh", JSON.stringify(ORDENES_INICIALES));
        }
        if (!localStorage.getItem("categorias_hh")) {
            const catsSemilla = ["Frutas Frescas", "Verduras Orgánicas", "Productos Orgánicos", "Productos Lácteos"];
            localStorage.setItem("categorias_hh", JSON.stringify(catsSemilla));
        }
    };

    // Inicializar antes de cargar estados
    inicializarDatos();

    // 2. Definición de Estados de React
    const [productos, setProductos] = useState(() => JSON.parse(localStorage.getItem("productos_hh")));
    const [usuarios, setUsuarios] = useState(() => JSON.parse(localStorage.getItem("usuarios_hh")));
    const [regiones] = useState(() => JSON.parse(localStorage.getItem("regiones_hh")));
    const [carrito, setCarrito] = useState(() => JSON.parse(localStorage.getItem("carrito_hh")));
    const [usuarioSesion, setUsuarioSesion] = useState(() => JSON.parse(localStorage.getItem("usuario_sesion_hh")));
    const [rolSimulado, setRolSimulado] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("rol_simulado_hh")) || "Cliente";
        } catch {
            return localStorage.getItem("rol_simulado_hh") || "Cliente";
        }
    });
    const [ordenes, setOrdenes] = useState(() => JSON.parse(localStorage.getItem("ordenes_hh")));
    const [categorias, setCategorias] = useState(() => JSON.parse(localStorage.getItem("categorias_hh")));
    const [toasts, setToasts] = useState([]);

    // Estados para diálogos asíncronos simulados (prompt y confirm en Toasts)
    const [promptConfig, setPromptConfig] = useState(null);
    const [confirmConfig, setConfirmConfig] = useState(null);

    const promptHH = (mensaje) => {
        return new Promise((resolve) => {
            setPromptConfig({ mensaje, resolve });
        });
    };

    const confirmHH = (mensaje) => {
        return new Promise((resolve) => {
            setConfirmConfig({ mensaje, resolve });
        });
    };

    // 3. Sincronización automática de estados de React con LocalStorage
    useEffect(() => {
        localStorage.setItem("productos_hh", JSON.stringify(productos));
    }, [productos]);

    useEffect(() => {
        localStorage.setItem("usuarios_hh", JSON.stringify(usuarios));
    }, [usuarios]);

    useEffect(() => {
        localStorage.setItem("carrito_hh", JSON.stringify(carrito));
    }, [carrito]);

    useEffect(() => {
        localStorage.setItem("usuario_sesion_hh", JSON.stringify(usuarioSesion));
    }, [usuarioSesion]);

    useEffect(() => {
        localStorage.setItem("rol_simulado_hh", JSON.stringify(rolSimulado));
    }, [rolSimulado]);

    useEffect(() => {
        localStorage.setItem("ordenes_hh", JSON.stringify(ordenes));
    }, [ordenes]);

    useEffect(() => {
        localStorage.setItem("categorias_hh", JSON.stringify(categorias));
    }, [categorias]);


    // 4. Lógica del Sistema de Notificaciones (Toasts)
    const mostrarNotificacion = (mensaje, tipo = "success") => {
        const id = Date.now() + Math.random().toString(36).substr(2, 9);
        const nuevoToast = { id, mensaje, tipo };
        setToasts(prev => [...prev, nuevoToast]);

        // Auto-eliminar después de 4 segundos
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    };

    const cerrarToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };


    // 5. Funciones de Negocio: Carrito
    const agregarAlCarrito = (id, cantidad = 1) => {
        const prod = productos.find(p => p.id === id);
        if (!prod) {
            mostrarNotificacion("Producto no encontrado", "error");
            return;
        }

        const itemExistente = carrito.find(item => item.id === id);
        const cantidadActual = itemExistente ? itemExistente.cantidad : 0;
        const cantidadNueva = cantidadActual + cantidad;

        if (cantidadNueva > prod.stock) {
            mostrarNotificacion(`Lo sentimos, no hay suficiente stock disponible (Máximo: ${prod.stock} unidades).`, "warning");
            return;
        }

        if (itemExistente) {
            setCarrito(prev => prev.map(item => item.id === id ? { ...item, cantidad: cantidadNueva } : item));
        } else {
            setCarrito(prev => [...prev, { id, cantidad }]);
        }

        mostrarNotificacion(`¡Se agregó ${cantidad} unidad(es) de ${prod.nombre} al carrito!`, "success");
    };

    const eliminarDelCarrito = (id) => {
        setCarrito(prev => prev.filter(item => item.id !== id));
        mostrarNotificacion("Producto eliminado del carrito", "info");
    };

    const cambiarCantidadItem = (id, cambio) => {
        const prod = productos.find(p => p.id === id);
        const item = carrito.find(i => i.id === id);
        if (!prod || !item) return;

        const nuevaCantidad = item.cantidad + cambio;

        if (nuevaCantidad > prod.stock) {
            mostrarNotificacion(`Lo sentimos, no hay más stock disponible (Stock máximo: ${prod.stock} unidades).`, "warning");
            return;
        }

        if (nuevaCantidad <= 0) {
            eliminarDelCarrito(id);
            return;
        }

        setCarrito(prev => prev.map(item => item.id === id ? { ...item, cantidad: nuevaCantidad } : item));
    };

    const limpiarCarrito = () => {
        setCarrito([]);
    };


    // 6. Funciones de Negocio: Autenticación, Registro y Perfil
    const login = (correo, contrasena) => {
        const usuario = usuarios.find(u => u.correo === correo && u.contrasena === contrasena);
        if (usuario) {
            setUsuarioSesion(usuario);
            setRolSimulado(usuario.tipo);
            mostrarNotificacion(`¡Bienvenido de vuelta, ${usuario.nombre}!`, "success");
            return usuario;
        } else {
            mostrarNotificacion("Correo o contraseña incorrectos", "error");
            return null;
        }
    };

    const logout = () => {
        setUsuarioSesion(null);
        setRolSimulado("Cliente");
        limpiarCarrito();
        mostrarNotificacion("Sesión cerrada con éxito.", "success");
    };

    const registrarUsuario = (nuevoUsuario) => {
        if (usuarios.some(u => u.run.toUpperCase() === nuevoUsuario.run.toUpperCase() || u.correo === nuevoUsuario.correo)) {
            mostrarNotificacion("Error: El RUN o el Correo ya se encuentran registrados.", "error");
            return false;
        }
        setUsuarios(prev => [...prev, nuevoUsuario]);
        mostrarNotificacion("¡Registro Exitoso! Inicia sesión.", "success");
        return true;
    };

    const actualizarPerfil = (run, datosActualizados) => {
        setUsuarios(prev => prev.map(u => u.run === run ? { ...u, ...datosActualizados } : u));
        
        // Si el usuario en sesión es el mismo, actualizar también su estado
        if (usuarioSesion && usuarioSesion.run === run) {
            setUsuarioSesion(prev => ({ ...prev, ...datosActualizados }));
        }
        
        mostrarNotificacion("¡Perfil guardado exitosamente!", "success");
    };

    const cambiarRolSimulado = (nuevoRol) => {
        setRolSimulado(nuevoRol);
        const usuarioSimulado = usuarios.find(u => u.tipo === nuevoRol);
        if (usuarioSimulado) {
            setUsuarioSesion(usuarioSimulado);
        } else {
            setUsuarioSesion(null);
        }
        mostrarNotificacion(`Rol simulado cambiado a: ${nuevoRol}`, "info");
    };


    // 7. CRUD Administración: Productos
    const crearProducto = (prodData) => {
        if (productos.some(p => p.id.toUpperCase() === prodData.id.toUpperCase())) {
            mostrarNotificacion("Error: Ya existe un producto con este código.", "error");
            return false;
        }
        setProductos(prev => [...prev, prodData]);
        mostrarNotificacion("Producto creado con éxito.", "success");
        return true;
    };

    const editarProducto = (id, prodData) => {
        setProductos(prev => prev.map(p => p.id === id ? { ...p, ...prodData } : p));
        mostrarNotificacion("Producto actualizado con éxito.", "success");
        return true;
    };

    const eliminarProducto = (id) => {
        setProductos(prev => prev.filter(p => p.id !== id));
        // También remover del carrito si existía
        setCarrito(prev => prev.filter(item => item.id !== id));
        mostrarNotificacion("Producto eliminado del inventario.", "info");
    };


    // 8. CRUD Administración: Usuarios
    const crearUsuario = (usrData) => {
        if (usuarios.some(u => u.run.toUpperCase() === usrData.run.toUpperCase() || u.correo === usrData.correo)) {
            mostrarNotificacion("Error: RUN o Correo duplicado en base de datos.", "error");
            return false;
        }
        setUsuarios(prev => [...prev, usrData]);
        mostrarNotificacion("Usuario creado con éxito.", "success");
        return true;
    };

    const editarUsuario = (run, usrData) => {
        setUsuarios(prev => prev.map(u => u.run === run ? { ...u, ...usrData } : u));
        if (usuarioSesion && usuarioSesion.run === run) {
            setUsuarioSesion(prev => ({ ...prev, ...usrData }));
        }
        mostrarNotificacion("Usuario actualizado con éxito.", "success");
        return true;
    };

    const eliminarUsuario = (run) => {
        if (usuarioSesion && usuarioSesion.run === run) {
            mostrarNotificacion("No puedes eliminar al usuario con la sesión activa actual.", "warning");
            return false;
        }
        setUsuarios(prev => prev.filter(u => u.run !== run));
        mostrarNotificacion("Usuario eliminado con éxito.", "info");
        return true;
    };


    // 9. CRUD Administración: Órdenes y Creación de Pedido
    const crearOrden = (ordenData) => {
        // Descontar stock
        setProductos(prev => prev.map(p => {
            const itemComprado = ordenData.items.find(it => it.id === p.id);
            if (itemComprado) {
                return { ...p, stock: Math.max(0, p.stock - itemComprado.cantidad) };
            }
            return p;
        }));

        setOrdenes(prev => [...prev, ordenData]);
        limpiarCarrito();
        mostrarNotificacion(`Pedido ${ordenData.id} registrado con éxito.`, "success");
    };

    const repetirPedido = (ordenId) => {
        const orden = ordenes.find(o => o.id === ordenId);
        if (!orden) return;

        let agregados = 0;
        let sinStock = [];
        let nuevoCarrito = [...carrito];

        orden.items.forEach(it => {
            const prod = productos.find(p => p.id === it.id);
            if (!prod) return;

            const enCarrito = nuevoCarrito.find(c => c.id === it.id);
            const cantidadEnCarrito = enCarrito ? enCarrito.cantidad : 0;
            const disponible = prod.stock - cantidadEnCarrito;

            if (disponible <= 0) {
                sinStock.push(prod.nombre);
                return;
            }

            const cantAgregar = Math.min(it.cantidad, disponible);
            if (enCarrito) {
                enCarrito.cantidad += cantAgregar;
            } else {
                nuevoCarrito.push({ id: it.id, cantidad: cantAgregar });
            }
            agregados++;
        });

        setCarrito(nuevoCarrito);

        if (sinStock.length > 0) {
            mostrarNotificacion(`Advertencia: Productos sin stock no agregados: ${sinStock.join(", ")}.`, "warning");
        }
        if (agregados > 0) {
            mostrarNotificacion(`¡Productos del pedido ${orden.id} añadidos al carrito!`, "success");
            return true;
        }
        return false;
    };

    const crearCategoria = (nombre) => {
        if (!nombre || nombre.trim() === "") return false;
        const norm = nombre.trim();
        if (categorias.includes(norm)) {
            mostrarNotificacion("La categoría ya existe.", "warning");
            return false;
        }
        setCategorias([...categorias, norm]);
        mostrarNotificacion("Categoría creada con éxito.", "success");
        return true;
    };

    const editarCategoria = (oldNombre, newNombre) => {
        if (!newNombre || newNombre.trim() === "") return false;
        const norm = newNombre.trim();
        if (categorias.includes(norm) && norm !== oldNombre) {
            mostrarNotificacion("Ya existe una categoría con ese nombre.", "warning");
            return false;
        }
        
        // Actualizar la lista de categorías
        setCategorias(categorias.map(c => c === oldNombre ? norm : c));
        
        // Actualizar la categoría en todos los productos asociados
        setProductos(productos.map(p => p.categoria === oldNombre ? { ...p, categoria: norm } : p));
        
        mostrarNotificacion("Categoría modificada con éxito.", "success");
        return true;
    };

    const eliminarCategoria = (nombre) => {
        const productosEnUso = productos.filter(p => p.categoria === nombre);
        if (productosEnUso.length > 0) {
            mostrarNotificacion(`No se puede eliminar: hay ${productosEnUso.length} producto(s) en esta categoría.`, "warning");
            return false;
        }
        setCategorias(categorias.filter(c => c !== nombre));
        mostrarNotificacion("Categoría eliminada con éxito.", "info");
        return true;
    };

    return (
        <AppContext.Provider value={{
            productos,
            usuarios,
            regiones,
            carrito,
            usuarioSesion,
            rolSimulado,
            ordenes,
            toasts,
            mostrarNotificacion,
            cerrarToast,
            agregarAlCarrito,
            eliminarDelCarrito,
            cambiarCantidadItem,
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
            eliminarCategoria
        }}>
            {children}
        </AppContext.Provider>
    );
};

import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import { validarRUT, validarFormulario } from '../../utils/validaciones';
import { getShortLabel } from '../TarjetaProducto';
import AdminDashboard from './AdminDashboard';
import AdminOrders from './AdminOrders';
import AdminProducts from './AdminProducts';
import AdminCategories from './AdminCategories';
import AdminUsers from './AdminUsers';
import AdminReports from './AdminReports';
import AdminProfile from './AdminProfile';

export default function AdminPanel() {
    const navigate = useNavigate();
    const location = useLocation();
    const { usuarioSesion, rolSimulado, logout } = useAuth();
    const {
        productos,
        usuarios,
        ordenes,
        categorias,
        regiones,
        mostrarNotificacion,
        promptHH,
        crearCategoria,
        editarCategoria,
        eliminarCategoria,
        getCategoryIcon,
        crearUsuario,
        editarUsuario,
        eliminarUsuario,
        crearProducto,
        editarProducto,
        eliminarProducto
    } = useAppContext();

    const totalStockFisico = productos.reduce((sum, producto) => sum + (producto.stock || 0), 0);
    const currentPath = location.pathname;

    const [searchProd, setSearchProd] = useState('');
    const [soloCriticos, setSoloCriticos] = useState(false);
    const [boletaOrden, setBoletaOrden] = useState(null);

    const [nuevaCatNombre, setNuevaCatNombre] = useState('');
    const [nuevaCatIcono, setNuevaCatIcono] = useState('');
    const [usarIconoPorDefecto, setUsarIconoPorDefecto] = useState(true);
    const [editandoCatNombre, setEditandoCatNombre] = useState(null);
    const [editandoCatNuevoNombre, setEditandoCatNuevoNombre] = useState('');
    const [editandoCatIcono, setEditandoCatIcono] = useState('');
    const [usarIconoDefectoEdicion, setUsarIconoDefectoEdicion] = useState(true);

    const [searchUsr, setSearchUsr] = useState('');
    const [showUsrModal, setShowUsrModal] = useState(false);
    const [editingUsrRun, setEditingUsrRun] = useState(null);
    const [usrForm, setUsrForm] = useState({
        run: '', nombre: '', apellidos: '', correo: '', region: '', comuna: '', direccion: '', tipo: 'Cliente', contrasena: ''
    });
    const [usrErrors, setUsrErrors] = useState({});
    const [comunasDisponibles, setComunasDisponibles] = useState([]);
    const [historialUsuario, setHistorialUsuario] = useState(null);

    const [perfilForm, setPerfilForm] = useState({
        nombre: '', apellidos: '', correo: '', contrasena: '', region: '', comuna: '', direccion: ''
    });
    const [perfilErrors, setPerfilErrors] = useState({});
    const [perfilComunas, setPerfilComunas] = useState([]);

    const [showProdModal, setShowProdModal] = useState(false);
    const [editingProdId, setEditingProdId] = useState(null);
    const [prodForm, setProdForm] = useState({
        id: '', nombre: '', categoria: '', precio: '', stock: '', stockCritico: '', esOferta: false, precioAnterior: '', imagen: '', descripcion: ''
    });
    const [prodErrors, setProdErrors] = useState({});

    useEffect(() => {
        if (usrForm.region) {
            const regionObj = regiones.find((r) => r.nombre === usrForm.region);
            setComunasDisponibles(regionObj ? regionObj.comunas : []);
        } else {
            setComunasDisponibles([]);
        }
    }, [usrForm.region, regiones]);

    useEffect(() => {
        if (usuarioSesion) {
            setPerfilForm({
                nombre: usuarioSesion.nombre || '',
                apellidos: usuarioSesion.apellidos || '',
                correo: usuarioSesion.correo || '',
                contrasena: usuarioSesion.contrasena || '',
                region: usuarioSesion.region || '',
                comuna: usuarioSesion.comuna || '',
                direccion: usuarioSesion.direccion || ''
            });
        }
    }, [usuarioSesion]);

    useEffect(() => {
        if (perfilForm.region) {
            const regionObj = regiones.find((r) => r.nombre === perfilForm.region);
            setPerfilComunas(regionObj ? regionObj.comunas : []);
        } else {
            setPerfilComunas([]);
        }
    }, [perfilForm.region, regiones]);

    const handleAdminNavigation = (tab) => {
        const routes = {
            dashboard: '/admin',
            ordenes: '/admin/orders',
            productos: '/admin/products',
            categorias: '/admin/categories',
            usuarios: '/admin/users',
            reportes: '/admin/reports',
            perfil: '/admin/profile'
        };

        navigate(routes[tab] || '/admin');
    };

    const productosFiltrados = productos.filter((p) => {
        const coincideBusqueda = p.nombre.toLowerCase().includes(searchProd.toLowerCase()) || p.id.toLowerCase().includes(searchProd.toLowerCase());
        const coincideStockCritico = !soloCriticos || p.stock <= p.stockCritico;
        return coincideBusqueda && coincideStockCritico;
    });

    const usuariosFiltrados = usuarios.filter((u) =>
        u.tipo !== 'Administrador' && (
            u.nombre.toLowerCase().includes(searchUsr.toLowerCase()) ||
            u.run.toLowerCase().includes(searchUsr.toLowerCase()) ||
            u.tipo.toLowerCase().includes(searchUsr.toLowerCase())
        )
    );

    const ventasPorCategoria = categorias.map((cat) => {
        const totalCat = ordenes.reduce((sum, orden) => {
            const itemsCat = orden.items.filter((item) => {
                const producto = productos.find((p) => p.nombre === item.nombre);
                return producto && getShortLabel(producto.categoria) === getShortLabel(cat);
            });
            return sum + itemsCat.reduce((subSum, item) => subSum + item.precio * item.cantidad, 0);
        }, 0);

        return { categoria: cat, total: totalCat };
    });

    const maxVentaCat = Math.max(...ventasPorCategoria.map((v) => v.total), 1);

    const handleNuevaCatIconUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setNuevaCatIcono(reader.result);
            setUsarIconoPorDefecto(false);
        };
        reader.readAsDataURL(file);
    };

    const handleCrearCategoria = (e) => {
        e.preventDefault();
        const nombre = nuevaCatNombre.trim();
        if (!nombre) {
            mostrarNotificacion('Ingresa un nombre de categoría.', 'warning');
            return;
        }

        const icono = usarIconoPorDefecto ? null : nuevaCatIcono || null;
        const creada = crearCategoria(nombre, icono);
        if (creada) {
            setNuevaCatNombre('');
            setNuevaCatIcono('');
            setUsarIconoPorDefecto(true);
            mostrarNotificacion('Categoría creada con éxito.', 'success');
        } else {
            mostrarNotificacion('La categoría ya existe o no se pudo crear.', 'warning');
        }
    };

    const handleEditarCategoria = (oldNombre) => {
        setEditandoCatNombre(oldNombre);
        setEditandoCatNuevoNombre(oldNombre);
        const currentIcon = getCategoryIcon(oldNombre);
        setEditandoCatIcono(typeof currentIcon === 'string' && currentIcon.startsWith('data:') ? currentIcon : '');
        setUsarIconoDefectoEdicion(!currentIcon || typeof currentIcon !== 'string' || !currentIcon.startsWith('data:'));
    };

    const handleEditCatIconUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setEditandoCatIcono(reader.result);
            setUsarIconoDefectoEdicion(false);
        };
        reader.readAsDataURL(file);
    };

    const handleGuardarCategoria = (oldNombre) => {
        const nombre = editandoCatNuevoNombre.trim();
        if (!nombre) {
            mostrarNotificacion('El nombre no puede quedar vacío.', 'warning');
            return;
        }

        const icono = usarIconoDefectoEdicion ? null : editandoCatIcono || null;
        const actualizada = editarCategoria(oldNombre, nombre, icono);
        if (actualizada) {
            setEditandoCatNombre(null);
            setEditandoCatNuevoNombre('');
            setEditandoCatIcono('');
            setUsarIconoDefectoEdicion(true);
            mostrarNotificacion('Categoría actualizada.', 'success');
        } else {
            mostrarNotificacion('No se pudo actualizar la categoría.', 'warning');
        }
    };

    const handleEliminarCategoria = (nombre) => {
        if (window.confirm(`¿Deseas eliminar la categoría ${nombre}?`)) {
            const eliminado = eliminarCategoria(nombre);
            if (eliminado) {
                mostrarNotificacion('Categoría eliminada.', 'info');
            }
        }
    };

    const openNewUsrModal = () => {
        setEditingUsrRun(null);
        setUsrForm({
            run: '', nombre: '', apellidos: '', correo: '', region: '', comuna: '', direccion: '', tipo: 'Cliente', contrasena: ''
        });
        setUsrErrors({});
        setShowUsrModal(true);
    };

    const openEditUsrModal = (usuario) => {
        setEditingUsrRun(usuario.run);
        setUsrForm({
            run: usuario.run,
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            correo: usuario.correo,
            region: usuario.region,
            comuna: usuario.comuna,
            direccion: usuario.direccion,
            tipo: usuario.tipo,
            contrasena: usuario.contrasena
        });
        setUsrErrors({});
        setShowUsrModal(true);
    };

    const handleUsrChange = (e) => {
        const { id, value } = e.target;
        setUsrForm((prev) => ({ ...prev, [id]: value }));
        setUsrErrors((prev) => ({ ...prev, [id]: false }));
    };

    const handleUsrSubmit = async (e) => {
        e.preventDefault();
        const reglas = {
            run: { required: !editingUsrRun, custom: (val) => editingUsrRun || validarRUT(val) },
            nombre: { required: true, maxLength: 50 },
            apellidos: { required: true, maxLength: 100 },
            correo: { required: true, maxLength: 100, pattern: /^[a-zA-Z0-9._%+-]+@(?:inacap\.cl|inacapmail\.cl|gmail\.com)$/ },
            region: { required: true },
            comuna: { required: true },
            direccion: { required: true, maxLength: 300 },
            tipo: { required: true },
            contrasena: { required: true, minLength: 4, maxLength: 10 }
        };

        const { errores, esValido } = validarFormulario(usrForm, reglas);
        setUsrErrors(errores);

        if (!esValido) {
            mostrarNotificacion('Revisa los datos del usuario.', 'warning');
            return;
        }

        // Si se está editando un administrador o asignando el rol de administrador
        const usuarioOriginal = usuarios.find(u => u.run === editingUsrRun);
        const esAdminAfectado = (usuarioOriginal && usuarioOriginal.tipo === 'Administrador') || usrForm.tipo === 'Administrador';

        if (esAdminAfectado) {
            const passwordIngresada = await promptHH('Ingresa tu contraseña actual para confirmar los cambios de tipo Administrador.');
            if (!passwordIngresada || String(passwordIngresada).trim() === '') {
                mostrarNotificacion('La contraseña es obligatoria para confirmar los cambios del Administrador.', 'warning');
                return;
            }

            if (String(passwordIngresada).trim() !== String(usuarioSesion?.contrasena ?? '')) {
                mostrarNotificacion('La contraseña ingresada no es correcta.', 'error');
                return;
            }
        }

        const usrData = {
            run: editingUsrRun || usrForm.run.replace(/\s+/g, '').toUpperCase(),
            nombre: usrForm.nombre.trim(),
            apellidos: usrForm.apellidos.trim(),
            correo: usrForm.correo.trim(),
            contrasena: usrForm.contrasena,
            tipo: usrForm.tipo,
            region: usrForm.region,
            comuna: usrForm.comuna,
            direccion: usrForm.direccion.trim()
        };

        const exito = editingUsrRun ? editarUsuario(editingUsrRun, usrData) : crearUsuario(usrData);
        if (exito) {
            setShowUsrModal(false);
            mostrarNotificacion(editingUsrRun ? 'Usuario actualizado.' : 'Usuario creado.', 'success');
        }
    };

    const handleEliminarUsuario = async (usuario) => {
        if (usuarioSesion && usuarioSesion.run === usuario.run) {
            mostrarNotificacion('No puedes eliminar tu propia cuenta.', 'warning');
            return;
        }

        if (usuario.tipo === 'Administrador') {
            const passwordIngresada = await promptHH('Ingresa tu contraseña actual para confirmar la eliminación de este Administrador.');
            if (!passwordIngresada || String(passwordIngresada).trim() === '') {
                mostrarNotificacion('La contraseña es obligatoria para confirmar la eliminación.', 'warning');
                return;
            }

            if (String(passwordIngresada).trim() !== String(usuarioSesion?.contrasena ?? '')) {
                mostrarNotificacion('La contraseña ingresada no es correcta.', 'error');
                return;
            }
        }

        if (window.confirm(`¿Deseas eliminar al usuario ${usuario.nombre} (${usuario.run})?`)) {
            const eliminado = eliminarUsuario(usuario.run);
            if (eliminado) {
                mostrarNotificacion('Usuario eliminado.', 'info');
            }
        }
    };

    const handlePerfilChange = (e) => {
        const { id, value } = e.target;
        setPerfilForm((prev) => ({ ...prev, [id]: value }));
        setPerfilErrors((prev) => ({ ...prev, [id]: false }));
    };

    const openNewProdModal = () => {
        setEditingProdId(null);
        setProdForm({
            id: '',
            nombre: '',
            categoria: categorias[0] || '',
            precio: '',
            stock: '',
            stockCritico: '',
            esOferta: false,
            precioAnterior: '',
            imagen: '',
            descripcion: ''
        });
        setProdErrors({});
        setShowProdModal(true);
    };

    const openEditProdModal = (producto) => {
        setEditingProdId(producto.id);
        setProdForm({
            id: producto.id || '',
            nombre: producto.nombre || '',
            categoria: producto.categoria || categorias[0] || '',
            precio: producto.precio ?? '',
            stock: producto.stock ?? '',
            stockCritico: producto.stockCritico ?? '',
            esOferta: Boolean(producto.esOferta),
            precioAnterior: producto.precioAnterior ?? '',
            imagen: producto.imagen || '',
            descripcion: producto.descripcion || ''
        });
        setProdErrors({});
        setShowProdModal(true);
    };

    const handleProdChange = (e) => {
        const { id, value, type, checked } = e.target;
        const nextValue = type === 'checkbox' ? checked : value;
        setProdForm((prev) => ({ ...prev, [id]: nextValue }));
        setProdErrors((prev) => ({ ...prev, [id]: false }));
    };

    const handleProdImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setProdForm((prev) => ({ ...prev, imagen: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleProdSubmit = (e) => {
        e.preventDefault();

        const reglas = {
            id: { required: true, minLength: 3 },
            nombre: { required: true, maxLength: 100 },
            categoria: { required: true },
            precio: { required: true, custom: (val) => Number.isInteger(Number(val)) && Number(val) > 0 },
            stock: { required: true, custom: (val) => Number.isInteger(Number(val)) && Number(val) >= 0 },
            stockCritico: { required: true, custom: (val) => Number.isInteger(Number(val)) && Number(val) >= 0 },
            descripcion: { required: true, maxLength: 500 }
        };

        if (prodForm.esOferta) {
            reglas.precioAnterior = {
                required: true,
                custom: (val) => Number.isInteger(Number(val)) && Number(val) > Number(prodForm.precio || 0)
            };
        }

        const { errores, esValido } = validarFormulario(prodForm, reglas);
        setProdErrors(errores);

        if (!esValido) {
            mostrarNotificacion('Revisa los datos del producto.', 'warning');
            return;
        }

        const productoId = (editingProdId || prodForm.id.trim().toUpperCase()).trim();
        const productoData = {
            id: productoId,
            nombre: prodForm.nombre.trim(),
            categoria: prodForm.categoria,
            precio: Number(prodForm.precio),
            stock: Number(prodForm.stock),
            stockCritico: Number(prodForm.stockCritico),
            esOferta: Boolean(prodForm.esOferta),
            precioAnterior: prodForm.esOferta ? Number(prodForm.precioAnterior) : undefined,
            imagen: prodForm.imagen || '',
            descripcion: prodForm.descripcion.trim()
        };

        if (!editingProdId && productos.some((producto) => String(producto.id).toUpperCase() === productoId.toUpperCase())) {
            mostrarNotificacion('Ya existe un producto con ese código.', 'warning');
            return;
        }

        const exito = editingProdId ? editarProducto(editingProdId, productoData) : crearProducto(productoData);
        if (exito) {
            setShowProdModal(false);
            mostrarNotificacion(editingProdId ? 'Producto actualizado.' : 'Producto creado.', 'success');
        }
    };

    const handlePerfilSubmit = async (e) => {
        e.preventDefault();
        const reglas = {
            nombre: { required: true, maxLength: 50 },
            apellidos: { required: true, maxLength: 100 },
            correo: { required: true, maxLength: 100, pattern: /^[a-zA-Z0-9._%+-]+@(?:inacap\.cl|inacapmail\.cl|gmail\.com)$/ },
            contrasena: { required: true, minLength: 4, maxLength: 10 },
            region: { required: true },
            comuna: { required: true },
            direccion: { required: true, maxLength: 300 }
        };

        const { errores, esValido } = validarFormulario(perfilForm, reglas);
        setPerfilErrors(errores);

        if (!esValido) {
            mostrarNotificacion('Completa los datos de tu perfil.', 'warning');
            return;
        }

        const passwordIngresada = await promptHH('Ingresa tu contraseña actual para confirmar los cambios de tu perfil.');
        if (!passwordIngresada || String(passwordIngresada).trim() === '') {
            mostrarNotificacion('La contraseña es obligatoria para actualizar el perfil.', 'warning');
            return;
        }

        if (String(passwordIngresada).trim() !== String(usuarioSesion?.contrasena ?? '')) {
            mostrarNotificacion('La contraseña ingresada no es correcta.', 'error');
            return;
        }

        const actualizado = editarUsuario(usuarioSesion.run, {
            run: usuarioSesion.run,
            tipo: usuarioSesion.tipo,
            ...perfilForm,
            contrasena: perfilForm.contrasena || usuarioSesion?.contrasena || ''
        });

        if (actualizado) {
            mostrarNotificacion('Perfil actualizado con éxito.', 'success');
        }
    };

    const renderContent = () => {
        if (currentPath === '/admin/orders') {
            return <AdminOrders ordenes={ordenes} boletaOrden={boletaOrden} setBoletaOrden={setBoletaOrden} mostrarNotificacion={mostrarNotificacion} />;
        }

        if (currentPath === '/admin/products') {
            return (
                <AdminProducts
                    productosFiltrados={productosFiltrados}
                    searchProd={searchProd}
                    setSearchProd={setSearchProd}
                    soloCriticos={soloCriticos}
                    setSoloCriticos={setSoloCriticos}
                    rolSimulado={rolSimulado}
                    openNewProdModal={openNewProdModal}
                    openEditProdModal={openEditProdModal}
                    eliminarProducto={eliminarProducto}
                    showProdModal={showProdModal}
                    setShowProdModal={setShowProdModal}
                    editingProdId={editingProdId}
                    prodForm={prodForm}
                    prodErrors={prodErrors}
                    handleProdChange={handleProdChange}
                    handleProdImageUpload={handleProdImageUpload}
                    handleProdSubmit={handleProdSubmit}
                    categorias={categorias}
                />
            );
        }

        if (currentPath === '/admin/categories') {
            return (
                <AdminCategories
                    categorias={categorias}
                    productos={productos}
                    rolSimulado={rolSimulado}
                    nuevaCatNombre={nuevaCatNombre}
                    setNuevaCatNombre={setNuevaCatNombre}
                    nuevaCatIcono={nuevaCatIcono}
                    setNuevaCatIcono={setNuevaCatIcono}
                    usarIconoPorDefecto={usarIconoPorDefecto}
                    setUsarIconoPorDefecto={setUsarIconoPorDefecto}
                    handleNuevaCatIconUpload={handleNuevaCatIconUpload}
                    handleCrearCategoria={handleCrearCategoria}
                    editandoCatNombre={editandoCatNombre}
                    setEditandoCatNombre={setEditandoCatNombre}
                    editandoCatNuevoNombre={editandoCatNuevoNombre}
                    setEditandoCatNuevoNombre={setEditandoCatNuevoNombre}
                    editandoCatIcono={editandoCatIcono}
                    setEditandoCatIcono={setEditandoCatIcono}
                    usarIconoDefectoEdicion={usarIconoDefectoEdicion}
                    setUsarIconoDefectoEdicion={setUsarIconoDefectoEdicion}
                    handleEditCatIconUpload={handleEditCatIconUpload}
                    handleEditarCategoria={handleEditarCategoria}
                    handleGuardarCategoria={handleGuardarCategoria}
                    handleEliminarCategoria={handleEliminarCategoria}
                    getCategoryIcon={getCategoryIcon}
                />
            );
        }

        if (currentPath === '/admin/users') {
            return (
                <AdminUsers
                    usuariosFiltrados={usuariosFiltrados}
                    searchUsr={searchUsr}
                    setSearchUsr={setSearchUsr}
                    usuarioSesion={usuarioSesion}
                    openNewUsrModal={openNewUsrModal}
                    openEditUsrModal={openEditUsrModal}
                    handleEliminarUsuario={handleEliminarUsuario}
                    historialUsuario={historialUsuario}
                    setHistorialUsuario={setHistorialUsuario}
                    ordenes={ordenes}
                    showUsrModal={showUsrModal}
                    setShowUsrModal={setShowUsrModal}
                    editingUsrRun={editingUsrRun}
                    usrForm={usrForm}
                    usrErrors={usrErrors}
                    handleUsrChange={handleUsrChange}
                    handleUsrSubmit={handleUsrSubmit}
                    regiones={regiones}
                    comunasDisponibles={comunasDisponibles}
                />
            );
        }

        if (currentPath === '/admin/reports') {
            return <AdminReports ordenes={ordenes} ventasPorCategoria={ventasPorCategoria} maxVentaCat={maxVentaCat} productos={productos} usuarios={usuarios} />;
        }

        if (currentPath === '/admin/profile') {
            return (
                <AdminProfile
                    perfilForm={perfilForm}
                    perfilErrors={perfilErrors}
                    perfilComunas={perfilComunas}
                    handlePerfilChange={handlePerfilChange}
                    handlePerfilSubmit={handlePerfilSubmit}
                    regiones={regiones}
                />
            );
        }

        return (
            <AdminDashboard
                ordenes={ordenes}
                productos={productos}
                usuarios={usuarios}
                totalStockFisico={totalStockFisico}
                rolSimulado={rolSimulado}
                setTabActiva={handleAdminNavigation}
                setSoloCriticos={setSoloCriticos}
                mostrarNotificacion={mostrarNotificacion}
            />
        );
    };

    return (
        <div className="container-fluid p-0 d-flex" style={{ minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
            <aside className="bg-light border-end d-flex flex-column justify-content-between p-3 flex-shrink-0 shadow-sm" style={{ width: '250px', minHeight: '100vh' }}>
                <div>
                    <div className="text-center py-4 border-bottom mb-4">
                        <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center mx-auto mb-2 shadow" style={{ width: '60px', height: '60px', fontSize: '1.6rem', fontWeight: 'bold' }}>
                            {usuarioSesion ? usuarioSesion.nombre.charAt(0) : 'A'}
                        </div>
                        <h6 className="fw-bold mb-0 text-dark">
                            {usuarioSesion ? `${usuarioSesion.nombre} ${usuarioSesion.apellidos}` : 'Usuario Staff'}
                        </h6>
                        <span className="badge bg-success small mt-1">{rolSimulado}</span>
                    </div>

                    <ul className="nav nav-pills flex-column mb-auto gap-1">
                        <li className="nav-item">
                            <NavLink to="/admin" end className={({ isActive }) => `nav-link w-100 text-start fw-semibold py-2 px-3 border-0 d-flex align-items-center gap-2 ${isActive ? 'active bg-success text-white shadow-sm' : 'text-secondary bg-transparent'}`}>
                                <i className="fa-solid fa-chart-line"></i> Dashboard
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin/orders" className={({ isActive }) => `nav-link w-100 text-start fw-semibold py-2 px-3 border-0 d-flex align-items-center gap-2 ${isActive ? 'active bg-success text-white shadow-sm' : 'text-secondary bg-transparent'}`}>
                                <i className="fa-solid fa-file-invoice"></i> Órdenes
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin/products" className={({ isActive }) => `nav-link w-100 text-start fw-semibold py-2 px-3 border-0 d-flex align-items-center gap-2 ${isActive ? 'active bg-success text-white shadow-sm' : 'text-secondary bg-transparent'}`}>
                                <i className="fa-solid fa-cubes"></i> Productos
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin/categories" className={({ isActive }) => `nav-link w-100 text-start fw-semibold py-2 px-3 border-0 d-flex align-items-center gap-2 ${isActive ? 'active bg-success text-white shadow-sm' : 'text-secondary bg-transparent'}`}>
                                <i className="fa-solid fa-list"></i> Categorías
                            </NavLink>
                        </li>
                        {rolSimulado === 'Administrador' && (
                            <li className="nav-item">
                                <NavLink to="/admin/users" className={({ isActive }) => `nav-link w-100 text-start fw-semibold py-2 px-3 border-0 d-flex align-items-center gap-2 ${isActive ? 'active bg-success text-white shadow-sm' : 'text-secondary bg-transparent'}`}>
                                    <i className="fa-solid fa-users"></i> Usuarios
                                </NavLink>
                            </li>
                        )}
                        <li className="nav-item">
                            <NavLink to="/admin/reports" className={({ isActive }) => `nav-link w-100 text-start fw-semibold py-2 px-3 border-0 d-flex align-items-center gap-2 ${isActive ? 'active bg-success text-white shadow-sm' : 'text-secondary bg-transparent'}`}>
                                <i className="fa-solid fa-chart-pie"></i> Reportes
                            </NavLink>
                        </li>
                        <li className="nav-item border-top mt-2 pt-2">
                            <NavLink to="/admin/profile" className={({ isActive }) => `nav-link w-100 text-start fw-semibold py-2 px-3 border-0 d-flex align-items-center gap-2 ${isActive ? 'active bg-success text-white shadow-sm' : 'text-secondary bg-transparent'}`}>
                                <i className="fa-solid fa-user-gear"></i> Perfil
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className="d-flex flex-column gap-2 mt-4">
                    <NavLink to="/" className="btn btn-dark w-100 py-2 d-flex align-items-center justify-content-center gap-2 text-decoration-none text-white small">
                        <i className="fa-solid fa-store"></i> Ver Tienda
                    </NavLink>
                    <button onClick={() => { logout(); navigate('/'); }} className="btn btn-danger w-100 py-2 d-flex align-items-center justify-content-center gap-2 small">
                        <i className="fa-solid fa-door-open"></i> Cerrar Sesión
                    </button>
                </div>
            </aside>

            <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
                <header className="border-bottom bg-white px-4 py-3 shadow-sm">
                    <h4 className="fw-bold mb-0 text-dark">Panel Administrativo</h4>
                </header>
                <main className="p-4 flex-grow-1" style={{ overflowY: 'auto' }}>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

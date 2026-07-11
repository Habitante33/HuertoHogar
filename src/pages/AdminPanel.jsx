import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { validarRUT, validarFormulario } from '../utils/validaciones';

// Importación de Componentes Modularizados
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminOrders from '../components/admin/AdminOrders';
import AdminProducts from '../components/admin/AdminProducts';
import AdminCategories from '../components/admin/AdminCategories';
import AdminUsers from '../components/admin/AdminUsers';
import AdminReports from '../components/admin/AdminReports';
import AdminProfile from '../components/admin/AdminProfile';

export default function AdminPanel() {
    const {
        productos,
        usuarios,
        ordenes,
        regiones,
        categorias,
        rolSimulado,
        usuarioSesion,
        crearProducto,
        editarProducto,
        eliminarProducto,
        crearUsuario,
        editarUsuario,
        eliminarUsuario,
        crearCategoria,
        editarCategoria,
        eliminarCategoria,
        mostrarNotificacion,
        promptHH,
        confirmHH,
        logout
    } = useContext(AppContext);

    const navigate = useNavigate();

    // Redireccionar si el rol es Cliente (no autorizado)
    useEffect(() => {
        if (rolSimulado === 'Cliente') {
            mostrarNotificacion("Acceso denegado: debes ser Vendedor o Administrador.", "error");
            navigate('/');
        }
    }, [rolSimulado, navigate]);

    // Pestaña principal activa
    const [tabActiva, setTabActiva] = useState('dashboard');

    // ==========================================
    // ESTADOS COMPARTIDOS
    // ==========================================
    const [boletaOrden, setBoletaOrden] = useState(null);
    const [historialUsuario, setHistorialUsuario] = useState(null);

    // ==========================================
    // ESTADOS Y HANDLERS PRODUCTOS
    // ==========================================
    const [showProdModal, setShowProdModal] = useState(false);
    const [editingProdId, setEditingProdId] = useState(null);
    const [prodForm, setProdForm] = useState({
        id: '', nombre: '', categoria: categorias[0] || 'Frutas Frescas',
        precio: '', stock: '', stockCritico: '', descripcion: '', imagen: '',
        esOferta: false, precioAnterior: ''
    });
    const [prodErrors, setProdErrors] = useState({});
    const [searchProd, setSearchProd] = useState('');
    const [soloCriticos, setSoloCriticos] = useState(false);

    const openNewProdModal = () => {
        setEditingProdId(null);
        setProdForm({
            id: '', nombre: '', categoria: categorias[0] || 'Frutas Frescas',
            precio: '', stock: '', stockCritico: '', descripcion: '', imagen: '',
            esOferta: false, precioAnterior: ''
        });
        setProdErrors({});
        setShowProdModal(true);
    };

    const openEditProdModal = (p) => {
        setEditingProdId(p.id);
        setProdForm({
            id: p.id, nombre: p.nombre, categoria: p.categoria,
            precio: p.precio.toString(), stock: p.stock.toString(),
            stockCritico: p.stockCritico.toString(), descripcion: p.descripcion,
            imagen: p.imagen, esOferta: p.esOferta || false,
            precioAnterior: p.precioAnterior ? p.precioAnterior.toString() : ''
        });
        setProdErrors({});
        setShowProdModal(true);
    };

    const handleProdChange = (e) => {
        const { id, value, type, checked } = e.target;
        setProdForm(prev => ({ ...prev, [id]: type === 'checkbox' ? checked : value }));
        setProdErrors(prev => ({ ...prev, [id]: false }));
    };

    const handleProdImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                setProdForm(prev => ({ ...prev, imagen: evt.target.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProdSubmit = (e) => {
        e.preventDefault();
        
        // Limpiar puntos y comas de los precios antes de validar y guardar (CLP es siempre entero)
        const precioLimpio = prodForm.precio.toString().replace(/[\.,]/g, '');
        const precioAnteriorLimpio = prodForm.precioAnterior ? prodForm.precioAnterior.toString().replace(/[\.,]/g, '') : '';
        
        const formParaValidar = {
            ...prodForm,
            precio: precioLimpio,
            precioAnterior: precioAnteriorLimpio
        };

        const reglas = {
            id: { required: true, minLength: 3 },
            nombre: { required: true, maxLength: 100 },
            categoria: { required: true },
            precio: { required: true, custom: val => !isNaN(parseInt(val)) && parseInt(val) >= 0 },
            stock: { required: true, custom: val => parseInt(val) >= 0 && !val.toString().includes('.') },
            stockCritico: { custom: val => !val || (parseInt(val) >= 0 && !val.toString().includes('.')) }
        };
        if (prodForm.esOferta) {
            reglas.precioAnterior = { required: true, custom: val => !isNaN(parseInt(val)) && parseInt(val) > parseInt(precioLimpio) };
        }
        const { errores, esValido } = validarFormulario(formParaValidar, reglas);
        setProdErrors(errores);

        if (esValido) {
            const prodData = {
                id: prodForm.id.trim().toUpperCase(),
                nombre: prodForm.nombre.trim(),
                categoria: prodForm.categoria,
                precio: parseInt(precioLimpio),
                stock: parseInt(prodForm.stock),
                stockCritico: parseInt(prodForm.stockCritico) || 0,
                descripcion: prodForm.descripcion.trim() || 'Sin descripción.',
                imagen: prodForm.imagen,
                esOferta: prodForm.esOferta,
                precioAnterior: prodForm.esOferta ? parseInt(precioAnteriorLimpio) : null,
                origen: 'Nacional'
            };
            const exito = editingProdId ? editarProducto(editingProdId, prodData) : crearProducto(prodData);
            if (exito) setShowProdModal(false);
        }
    };

    // ==========================================
    // ESTADOS Y HANDLERS CATEGORÍAS
    // ==========================================
    const [nuevaCatNombre, setNuevaCatNombre] = useState('');
    const [editandoCatNombre, setEditandoCatNombre] = useState(null);
    const [editandoCatNuevoNombre, setEditandoCatNuevoNombre] = useState('');

    const handleCrearCategoria = (e) => {
        e.preventDefault();
        if (crearCategoria(nuevaCatNombre)) setNuevaCatNombre('');
    };

    const handleEditarCategoria = (oldNombre) => {
        setEditandoCatNombre(oldNombre);
        setEditandoCatNuevoNombre(oldNombre);
    };

    const handleGuardarCategoria = (oldNombre) => {
        if (editarCategoria(oldNombre, editandoCatNuevoNombre)) setEditandoCatNombre(null);
    };

    const handleEliminarCategoria = async (nombre) => {
        const confirmado = await confirmHH(`¿Estás seguro de que deseas eliminar la categoría "${nombre}"?`);
        if (confirmado) eliminarCategoria(nombre);
    };

    // ==========================================
    // ESTADOS Y HANDLERS USUARIOS
    // ==========================================
    const [showUsrModal, setShowUsrModal] = useState(false);
    const [editingUsrRun, setEditingUsrRun] = useState(null);
    const [usrForm, setUsrForm] = useState({
        run: '', nombre: '', apellidos: '', correo: '', region: '', comuna: '', direccion: '', tipo: 'Cliente', contrasena: ''
    });
    const [usrErrors, setUsrErrors] = useState({});
    const [comunasDisponibles, setComunasDisponibles] = useState([]);
    const [searchUsr, setSearchUsr] = useState('');

    useEffect(() => {
        if (usrForm.region) {
            const regionObj = regiones.find(r => r.nombre === usrForm.region);
            setComunasDisponibles(regionObj ? regionObj.comunas : []);
        } else {
            setComunasDisponibles([]);
        }
    }, [usrForm.region, regiones]);

    const openNewUsrModal = () => {
        setEditingUsrRun(null);
        setUsrForm({
            run: '', nombre: '', apellidos: '', correo: '', region: '', comuna: '', direccion: '', tipo: 'Cliente', contrasena: ''
        });
        setUsrErrors({});
        setShowUsrModal(true);
    };

    const openEditUsrModal = async (u) => {
        if (u.tipo === 'Administrador') {
            const esMismoUsuario = usuarioSesion && usuarioSesion.run === u.run;
            const mensajePrompt = esMismoUsuario 
                ? "Por favor, ingrese su contraseña actual para confirmar la edición:" 
                : "Por favor, ingrese la contraseña de este Administrador para confirmar la edición:";
            const password = await promptHH(mensajePrompt);
            if (password === null) return;
            if (password !== u.contrasena) {
                mostrarNotificacion("Error: Contraseña incorrecta. No se puede editar este administrador.", "error");
                return;
            }
        }
        setEditingUsrRun(u.run);
        setUsrForm({
            run: u.run, nombre: u.nombre, apellidos: u.apellidos, correo: u.correo,
            region: u.region, comuna: u.comuna, direccion: u.direccion, tipo: u.tipo, contrasena: u.contrasena
        });
        setUsrErrors({});
        setShowUsrModal(true);
    };

    const handleUsrChange = (e) => {
        const { id, value } = e.target;
        setUsrForm(prev => ({ ...prev, [id]: value }));
        setUsrErrors(prev => ({ ...prev, [id]: false }));
    };

    const handleUsrSubmit = (e) => {
        e.preventDefault();
        const reglas = {
            run: { required: !editingUsrRun, custom: val => editingUsrRun || validarRUT(val) },
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

        if (esValido) {
            const usrData = {
                run: editingUsrRun || usrForm.run.replace(/\s+/g, '').toUpperCase(),
                nombre: usrForm.nombre.trim(), apellidos: usrForm.apellidos.trim(), correo: usrForm.correo.trim(),
                contrasena: usrForm.contrasena, tipo: usrForm.tipo, region: usrForm.region, comuna: usrForm.comuna, direccion: usrForm.direccion.trim()
            };
            const exito = editingUsrRun ? editarUsuario(editingUsrRun, usrData) : crearUsuario(usrData);
            if (exito) setShowUsrModal(false);
        }
    };

    const handleEliminarUsuario = async (u) => {
        if (usuarioSesion && usuarioSesion.run === u.run) {
            mostrarNotificacion("Error: No puedes eliminarte a ti mismo.", "error");
            return;
        }
        if (u.tipo === 'Administrador') {
            const password = await promptHH("Por favor, ingrese la contraseña de este Administrador para confirmar la eliminación:");
            if (password === null) return;
            if (password !== u.contrasena) {
                mostrarNotificacion("Error: Contraseña incorrecta. No se puede eliminar este administrador.", "error");
                return;
            }
        }
        const confirmado = await confirmHH(`¿Deseas eliminar el usuario ${u.nombre} (${u.run})?`);
        if (confirmado && eliminarUsuario(u.run)) mostrarNotificacion("Usuario eliminado con éxito.", "info");
    };

    // ==========================================
    // ESTADOS Y HANDLERS PERFIL PROPIO (STAFF)
    // ==========================================
    const [perfilForm, setPerfilForm] = useState({
        nombre: '', apellidos: '', correo: '', contrasena: '', region: '', comuna: '', direccion: ''
    });
    const [perfilErrors, setPerfilErrors] = useState({});
    const [perfilComunas, setPerfilComunas] = useState([]);

    useEffect(() => {
        if (usuarioSesion && tabActiva === 'perfil') {
            setPerfilForm({
                nombre: usuarioSesion.nombre || '', apellidos: usuarioSesion.apellidos || '', correo: usuarioSesion.correo || '',
                contrasena: usuarioSesion.contrasena || '', region: usuarioSesion.region || '', comuna: usuarioSesion.comuna || '',
                direccion: usuarioSesion.direccion || ''
            });
        }
    }, [usuarioSesion, tabActiva]);

    useEffect(() => {
        if (perfilForm.region) {
            const regionObj = regiones.find(r => r.nombre === perfilForm.region);
            setPerfilComunas(regionObj ? regionObj.comunas : []);
        } else {
            setPerfilComunas([]);
        }
    }, [perfilForm.region, regiones]);

    const handlePerfilChange = (e) => {
        const { id, value } = e.target;
        setPerfilForm(prev => ({ ...prev, [id]: value }));
        setPerfilErrors(prev => ({ ...prev, [id]: false }));
    };

    const handlePerfilSubmit = (e) => {
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
        if (esValido) {
            editarUsuario(usuarioSesion.run, { run: usuarioSesion.run, tipo: usuarioSesion.tipo, ...perfilForm });
        }
    };

    // ==========================================
    // AUXILIARES Y FILTROS
    // ==========================================
    const totalStockFisico = productos.reduce((sum, p) => sum + p.stock, 0);
    
    const productosFiltrados = productos.filter(p => {
        const coincideBusqueda = p.nombre.toLowerCase().includes(searchProd.toLowerCase()) || p.id.toLowerCase().includes(searchProd.toLowerCase());
        const coincideStockCritico = !soloCriticos || p.stock <= p.stockCritico;
        return coincideBusqueda && coincideStockCritico;
    });

    const usuariosFiltrados = usuarios.filter(u => 
        u.nombre.toLowerCase().includes(searchUsr.toLowerCase()) || u.run.toLowerCase().includes(searchUsr.toLowerCase()) || u.tipo.toLowerCase().includes(searchUsr.toLowerCase())
    );

    const ventasPorCategoria = categorias.map(cat => {
        const totalCat = ordenes.reduce((sum, o) => {
            const itemsCat = o.items.filter(it => {
                const prod = productos.find(p => p.nombre === it.nombre);
                return prod && prod.categoria === cat;
            });
            return sum + itemsCat.reduce((s, it) => s + (it.precio * it.cantidad), 0);
        }, 0);
        return { categoria: cat, total: totalCat };
    });

    const maxVentaCat = Math.max(...ventasPorCategoria.map(v => v.total), 1);

    if (rolSimulado === 'Cliente') return null;

    return (
        <div className="container-fluid p-0 d-flex" style={{ minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
            
            {/* Sidebar Modular */}
            <AdminSidebar 
                tabActiva={tabActiva} 
                setTabActiva={setTabActiva} 
                usuarioSesion={usuarioSesion} 
                rolSimulado={rolSimulado} 
                logout={logout} 
                navigate={navigate} 
            />

            {/* Contenedor de Contenidos */}
            <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
                
                {/* Header Modular */}
                <AdminHeader />

                {/* Switch de Contenidos */}
                <main className="p-4 flex-grow-1" style={{ overflowY: 'auto' }}>
                    {tabActiva === 'dashboard' && (
                        <AdminDashboard 
                            ordenes={ordenes} 
                            productos={productos} 
                            usuarios={usuarios} 
                            totalStockFisico={totalStockFisico} 
                            rolSimulado={rolSimulado} 
                            setTabActiva={setTabActiva} 
                            setSoloCriticos={setSoloCriticos}
                            mostrarNotificacion={mostrarNotificacion} 
                        />
                    )}
                    {tabActiva === 'ordenes' && (
                        <AdminOrders 
                            ordenes={ordenes} 
                            boletaOrden={boletaOrden} 
                            setBoletaOrden={setBoletaOrden} 
                            mostrarNotificacion={mostrarNotificacion} 
                        />
                    )}
                    {tabActiva === 'productos' && (
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
                    )}
                    {tabActiva === 'categorias' && (
                        <AdminCategories 
                            categorias={categorias}
                            productos={productos}
                            rolSimulado={rolSimulado}
                            nuevaCatNombre={nuevaCatNombre}
                            setNuevaCatNombre={setNuevaCatNombre}
                            handleCrearCategoria={handleCrearCategoria}
                            editandoCatNombre={editandoCatNombre}
                            setEditandoCatNombre={setEditandoCatNombre}
                            editandoCatNuevoNombre={editandoCatNuevoNombre}
                            setEditandoCatNuevoNombre={setEditandoCatNuevoNombre}
                            handleEditarCategoria={handleEditarCategoria}
                            handleGuardarCategoria={handleGuardarCategoria}
                            handleEliminarCategoria={handleEliminarCategoria}
                        />
                    )}
                    {tabActiva === 'usuarios' && rolSimulado === 'Administrador' && (
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
                    )}
                    {tabActiva === 'reportes' && (
                        <AdminReports 
                            ordenes={ordenes} 
                            ventasPorCategoria={ventasPorCategoria} 
                            maxVentaCat={maxVentaCat} 
                            productos={productos} 
                            usuarios={usuarios} 
                        />
                    )}
                    {tabActiva === 'perfil' && (
                        <AdminProfile 
                            perfilForm={perfilForm}
                            perfilErrors={perfilErrors}
                            perfilComunas={perfilComunas}
                            handlePerfilChange={handlePerfilChange}
                            handlePerfilSubmit={handlePerfilSubmit}
                            regiones={regiones}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}

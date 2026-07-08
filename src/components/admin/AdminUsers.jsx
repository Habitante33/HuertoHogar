import React from 'react';

export default function AdminUsers({
    usuariosFiltrados,
    searchUsr,
    setSearchUsr,
    usuarioSesion,
    openNewUsrModal,
    openEditUsrModal,
    handleEliminarUsuario,
    historialUsuario,
    setHistorialUsuario,
    ordenes,
    showUsrModal,
    setShowUsrModal,
    editingUsrRun,
    usrForm,
    usrErrors,
    handleUsrChange,
    handleUsrSubmit,
    regiones,
    comunasDisponibles
}) {
    return (
        <div>
            <div className="mb-4">
                <h2 className="fw-bold text-dark mb-1">Administración de Cuentas</h2>
                <p className="text-muted small">Gestión de usuarios del sistema y acceso a su historial de compras.</p>
            </div>

            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div style={{ maxWidth: '300px', width: '100%' }}>
                    <div className="input-group input-group-sm">
                        <span className="input-group-text bg-white text-muted"><i className="fa-solid fa-magnifying-glass"></i></span>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Buscar usuario..." 
                            value={searchUsr}
                            onChange={(e) => setSearchUsr(e.target.value)}
                        />
                    </div>
                </div>
                <button className="btn btn-success btn-sm shadow-sm" onClick={openNewUsrModal}>
                    <i className="fa-solid fa-user-plus me-1"></i> Agregar Usuario
                </button>
            </div>

            <div className="card border-0 shadow-sm p-3 bg-white border rounded-3">
                <div className="table-responsive">
                    <table className="table align-middle table-hover">
                        <thead>
                            <tr className="table-light text-muted small">
                                <th>RUN</th>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Dirección</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuariosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-muted">No se encontraron usuarios.</td>
                                </tr>
                            ) : (
                                usuariosFiltrados.map(u => (
                                    <tr key={u.run}>
                                        <td className="fw-bold">{u.run}</td>
                                        <td>{u.nombre} {u.apellidos}</td>
                                        <td>{u.correo}</td>
                                        <td>
                                            <span className={`badge ${
                                                u.tipo === 'Administrador' ? 'bg-danger' : 
                                                u.tipo === 'Vendedor' ? 'bg-primary' : 'bg-success'
                                            }`}>
                                                {u.tipo}
                                            </span>
                                        </td>
                                        <td className="small text-muted">{u.direccion}, {u.comuna}, {u.region}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                {u.tipo === 'Cliente' && (
                                                    <button 
                                                        className="btn btn-xs btn-outline-success d-flex align-items-center gap-1"
                                                        onClick={() => setHistorialUsuario(u)}
                                                        title="Ver compras anteriores"
                                                    >
                                                        <i className="fa-solid fa-clock-rotate-left"></i> Historial
                                                    </button>
                                                )}
                                                <button className="btn btn-xs btn-outline-primary" onClick={() => openEditUsrModal(u)}>
                                                    <i className="fa-solid fa-user-pen"></i>
                                                </button>
                                                <button 
                                                    className="btn btn-xs btn-outline-danger" 
                                                    onClick={() => handleEliminarUsuario(u)}
                                                    disabled={usuarioSesion && usuarioSesion.run === u.run}
                                                >
                                                    <i className="fa-solid fa-user-minus"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL HISTORIAL DE COMPRAS */}
            {historialUsuario && (
                <>
                    <div className="modal-backdrop fade show" onClick={() => setHistorialUsuario(null)}></div>
                    <div className="modal fade show" style={{ display: 'block', zIndex: 1060 }} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content shadow-lg border-0">
                                <div className="modal-header bg-success text-white py-3">
                                    <h5 className="modal-title fw-bold">
                                        <i className="fa-solid fa-clock-rotate-left me-2"></i>
                                        Historial de Compras: {historialUsuario.nombre} {historialUsuario.apellidos}
                                    </h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setHistorialUsuario(null)}></button>
                                </div>
                                <div className="modal-body p-4" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                                    <p className="text-muted small">Listado de todas las transacciones realizadas por el RUN: <strong>{historialUsuario.run}</strong></p>
                                    
                                    {ordenes.filter(o => o.clienteRun === historialUsuario.run).length === 0 ? (
                                        <div className="text-center py-5 text-muted">
                                            <i className="fa-solid fa-folder-open fs-1 mb-2 d-block"></i>
                                            El cliente no registra órdenes de compra históricas.
                                        </div>
                                    ) : (
                                        <div className="d-flex flex-column gap-3">
                                            {ordenes.filter(o => o.clienteRun === historialUsuario.run).map(orden => (
                                                <div key={orden.id} className="p-3 border rounded bg-light">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <span className="fw-bold text-success">{orden.id}</span>
                                                        <span className="small text-muted">{orden.fecha}</span>
                                                    </div>
                                                    <ul className="list-unstyled mb-2 border-top border-bottom py-2 my-2 small">
                                                        {orden.items.map(it => (
                                                            <li key={it.id} className="d-flex justify-content-between">
                                                                <span>• {it.nombre} ({it.cantidad}x)</span>
                                                                <span className="text-muted">${(it.precio * it.cantidad).toLocaleString("es-CL")}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <div className="d-flex justify-content-between align-items-center font-monospace">
                                                        <span className="small text-muted">Despacho: {orden.cliente.direccion}</span>
                                                        <span className="fw-bold text-success">${orden.total.toLocaleString("es-CL")} CLP</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer py-2">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary btn-sm" 
                                        onClick={() => setHistorialUsuario(null)}
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* MODAL USUARIO */}
            {showUsrModal && (
                <>
                    <div className="modal-backdrop fade show" onClick={() => setShowUsrModal(false)}></div>
                    <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content shadow-lg border-0">
                                <div className="modal-header bg-success text-white py-3">
                                    <h5 className="modal-title fw-bold">
                                        {editingUsrRun ? `Editar Usuario: ${editingUsrRun}` : 'Nuevo Usuario'}
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setShowUsrModal(false)}></button>
                                </div>
                                <form onSubmit={handleUsrSubmit}>
                                    <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">RUN (Sin puntos ni guion) *</label>
                                                <input 
                                                    type="text" 
                                                    className={`form-control form-control-sm ${usrErrors.run ? 'is-invalid' : ''}`}
                                                    id="run" 
                                                    placeholder="Ej: 19011022K"
                                                    value={usrForm.run}
                                                    onChange={handleUsrChange}
                                                    disabled={editingUsrRun !== null}
                                                />
                                                <div className="invalid-feedback">RUN inválido. Debe tener dígito verificador correcto sin puntos ni guion.</div>
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Nombre *</label>
                                                <input 
                                                    type="text" 
                                                    className={`form-control form-control-sm ${usrErrors.nombre ? 'is-invalid' : ''}`}
                                                    id="nombre" 
                                                    value={usrForm.nombre}
                                                    onChange={handleUsrChange}
                                                    maxLength="50"
                                                />
                                                <div className="invalid-feedback">El nombre es requerido (máx. 50).</div>
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Apellidos *</label>
                                                <input 
                                                    type="text" 
                                                    className={`form-control form-control-sm ${usrErrors.apellidos ? 'is-invalid' : ''}`}
                                                    id="apellidos" 
                                                    value={usrForm.apellidos}
                                                    onChange={handleUsrChange}
                                                    maxLength="100"
                                                />
                                                <div className="invalid-feedback">Los apellidos son requeridos (máx. 100).</div>
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Correo Electrónico *</label>
                                                <input 
                                                    type="email" 
                                                    className={`form-control form-control-sm ${usrErrors.correo ? 'is-invalid' : ''}`}
                                                    id="correo" 
                                                    value={usrForm.correo}
                                                    onChange={handleUsrChange}
                                                    maxLength="100"
                                                />
                                                <div className="invalid-feedback">Ingresa un correo corporativo (@inacap.cl, @inacapmail.cl) o de Gmail.</div>
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Rol / Permisos *</label>
                                                <select 
                                                    id="tipo" 
                                                    className="form-select form-select-sm"
                                                    value={usrForm.tipo}
                                                    onChange={handleUsrChange}
                                                >
                                                    <option value="Cliente">Cliente (Público)</option>
                                                    <option value="Vendedor">Vendedor (Admin Limitado)</option>
                                                    <option value="Administrador">Administrador (Admin Total)</option>
                                                </select>
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Contraseña *</label>
                                                <input 
                                                    type="text" 
                                                    className={`form-control form-control-sm ${usrErrors.contrasena ? 'is-invalid' : ''}`}
                                                    id="contrasena" 
                                                    value={usrForm.contrasena}
                                                    onChange={handleUsrChange}
                                                />
                                                <div className="invalid-feedback">Contraseña obligatoria (entre 4 y 10 chars).</div>
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Región *</label>
                                                <select 
                                                    id="region" 
                                                    className={`form-select form-select-sm ${usrErrors.region ? 'is-invalid' : ''}`}
                                                    value={usrForm.region}
                                                    onChange={handleUsrChange}
                                                >
                                                    <option value="">Seleccione Región</option>
                                                    {regiones.map(r => (
                                                        <option key={r.id} value={r.nombre}>{r.nombre}</option>
                                                    ))}
                                                </select>
                                                <div className="invalid-feedback">La región es obligatoria.</div>
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Comuna *</label>
                                                <select 
                                                    id="comuna" 
                                                    className={`form-select form-select-sm ${usrErrors.comuna ? 'is-invalid' : ''}`}
                                                    value={usrForm.comuna}
                                                    onChange={handleUsrChange}
                                                    disabled={!usrForm.region}
                                                >
                                                    <option value="">Seleccione Comuna</option>
                                                    {comunasDisponibles.map(c => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                                <div className="invalid-feedback">La comuna es obligatoria.</div>
                                            </div>

                                            <div className="col-12">
                                                <label className="form-label small fw-bold">Dirección Particular *</label>
                                                <input 
                                                    type="text" 
                                                    className={`form-control form-control-sm ${usrErrors.direccion ? 'is-invalid' : ''}`}
                                                    id="direccion" 
                                                    value={usrForm.direccion}
                                                    onChange={handleUsrChange}
                                                    maxLength="300"
                                                />
                                                <div className="invalid-feedback">La dirección es requerida (máx. 300).</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer bg-light py-2">
                                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowUsrModal(false)}>Cancelar</button>
                                        <button type="submit" className="btn btn-success btn-sm">Guardar Usuario</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

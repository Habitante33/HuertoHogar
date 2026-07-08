import React from 'react';

export default function AdminProfile({
    perfilForm,
    perfilErrors,
    perfilComunas,
    handlePerfilChange,
    handlePerfilSubmit,
    regiones
}) {
    return (
        <div>
            <div className="mb-4">
                <h2 className="fw-bold text-dark mb-1">Mi Cuenta de Trabajo</h2>
                <p className="text-muted small">Modifica tus datos de acceso personales y dirección.</p>
            </div>

            <div className="card border-0 shadow-sm p-4 bg-white border rounded-3" style={{ maxWidth: '600px' }}>
                <form onSubmit={handlePerfilSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">Nombre *</label>
                            <input 
                                type="text" 
                                className={`form-control ${perfilErrors.nombre ? 'is-invalid' : ''}`}
                                id="nombre"
                                value={perfilForm.nombre}
                                onChange={handlePerfilChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">Apellidos *</label>
                            <input 
                                type="text" 
                                className={`form-control ${perfilErrors.apellidos ? 'is-invalid' : ''}`}
                                id="apellidos"
                                value={perfilForm.apellidos}
                                onChange={handlePerfilChange}
                            />
                        </div>
                        <div className="col-12">
                            <label className="form-label small fw-bold">Correo Electrónico *</label>
                            <input 
                                type="email" 
                                className={`form-control ${perfilErrors.correo ? 'is-invalid' : ''}`}
                                id="correo"
                                value={perfilForm.correo}
                                onChange={handlePerfilChange}
                            />
                        </div>
                        <div className="col-12">
                            <label className="form-label small fw-bold">Contraseña de Acceso *</label>
                            <input 
                                type="text" 
                                className={`form-control ${perfilErrors.contrasena ? 'is-invalid' : ''}`}
                                id="contrasena"
                                value={perfilForm.contrasena}
                                onChange={handlePerfilChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">Región *</label>
                            <select 
                                className={`form-select ${perfilErrors.region ? 'is-invalid' : ''}`}
                                id="region"
                                value={perfilForm.region}
                                onChange={handlePerfilChange}
                            >
                                <option value="">Seleccionar Región</option>
                                {regiones.map(r => (
                                    <option key={r.id} value={r.nombre}>{r.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">Comuna *</label>
                            <select 
                                className={`form-select ${perfilErrors.comuna ? 'is-invalid' : ''}`}
                                id="comuna"
                                value={perfilForm.comuna}
                                onChange={handlePerfilChange}
                                disabled={!perfilForm.region}
                            >
                                <option value="">Seleccionar Comuna</option>
                                {perfilComunas.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-12">
                            <label className="form-label small fw-bold">Dirección Particular *</label>
                            <input 
                                type="text" 
                                className={`form-control ${perfilErrors.direccion ? 'is-invalid' : ''}`}
                                id="direccion"
                                value={perfilForm.direccion}
                                onChange={handlePerfilChange}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-success btn-sm mt-4 px-4 py-2">
                        <i className="fa-floppy-disk fa-solid me-1"></i> Guardar Cambios Perfil
                    </button>
                </form>
            </div>
        </div>
    );
}

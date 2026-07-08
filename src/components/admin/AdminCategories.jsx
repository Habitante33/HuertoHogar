import React from 'react';
import { getShortLabel } from '../TarjetaProducto';

export default function AdminCategories({
    categorias,
    productos,
    rolSimulado,
    nuevaCatNombre,
    setNuevaCatNombre,
    nuevaCatIcono,
    setNuevaCatIcono,
    usarIconoPorDefecto,
    setUsarIconoPorDefecto,
    handleNuevaCatIconUpload,
    handleCrearCategoria,
    editandoCatNombre,
    setEditandoCatNombre,
    editandoCatNuevoNombre,
    setEditandoCatNuevoNombre,
    editandoCatIcono,
    setEditandoCatIcono,
    usarIconoDefectoEdicion,
    setUsarIconoDefectoEdicion,
    handleEditCatIconUpload,
    handleEditarCategoria,
    handleGuardarCategoria,
    handleEliminarCategoria,
    getCategoryIcon
}) {
    return (
        <div>
            <div className="mb-4">
                <h2 className="fw-bold text-dark mb-1">Administración de Categorías</h2>
                <p className="text-muted small">Crear, editar o eliminar categorías del catálogo.</p>
            </div>

            <div className="row g-4">
                {/* Crear nueva categoría (Solo Administrador) */}
                {rolSimulado === 'Administrador' && (
                    <div className="col-md-5">
                        <div className="card border-0 shadow-sm p-4 bg-white border rounded-3">
                            <h5 className="fw-bold mb-3 text-success">Nueva Categoría</h5>
                            <form onSubmit={handleCrearCategoria}>
                                <div className="mb-3">
                                    <label htmlFor="nueva-cat" className="form-label small fw-bold text-muted">Nombre de la Categoría</label>
                                    <input 
                                        type="text" 
                                        id="nueva-cat" 
                                        className="form-control" 
                                        placeholder="Ej: Internacional"
                                        value={nuevaCatNombre}
                                        onChange={(e) => setNuevaCatNombre(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="usar-icono-defecto"
                                            checked={usarIconoPorDefecto}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                setUsarIconoPorDefecto(checked);
                                                if (checked) {
                                                    setNuevaCatIcono('');
                                                }
                                            }}
                                        />
                                        <label className="form-check-label small fw-bold text-muted" htmlFor="usar-icono-defecto">
                                            Usar icono por defecto
                                        </label>
                                    </div>
                                </div>
                                {!usarIconoPorDefecto && (
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">Cargar icono</label>
                                        <input type="file" className="form-control" accept="image/*" onChange={handleNuevaCatIconUpload} />
                                        {nuevaCatIcono && (
                                            <div className="mt-2">
                                                <small className="text-muted d-block mb-1">Vista previa:</small>
                                                <img src={nuevaCatIcono} alt="Previsualización del icono" style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '8px' }} />
                                            </div>
                                        )}
                                    </div>
                                )}
                                <button type="submit" className="btn btn-success btn-sm w-100 py-2">
                                    <i className="fa-solid fa-plus me-1"></i> Agregar Categoría
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Listado de Categorías */}
                <div className={rolSimulado === 'Administrador' ? 'col-md-7' : 'col-md-12'}>
                    <div className="card border-0 shadow-sm p-4 bg-white border rounded-3">
                        <h5 className="fw-bold mb-3 text-dark">Categorías Disponibles</h5>
                        <div className="list-group list-group-flush">
                            {categorias.map(cat => {
                                const conteoProds = productos.filter(p => p.categoria === cat).length;
                                const esEditable = editandoCatNombre === cat;

                                return (
                                    <div key={cat} className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                                        {esEditable ? (
                                            <div className="d-flex flex-column flex-grow-1 me-3 gap-2">
                                                <div className="d-flex align-items-center gap-2">
                                                    <input 
                                                        type="text" 
                                                        className="form-control form-control-sm"
                                                        value={editandoCatNuevoNombre}
                                                        onChange={(e) => setEditandoCatNuevoNombre(e.target.value)}
                                                    />
                                                    <button className="btn btn-xs btn-success" onClick={() => handleGuardarCategoria(cat)}>
                                                        Guardar
                                                    </button>
                                                    <button className="btn btn-xs btn-secondary" onClick={() => setEditandoCatNombre(null)}>
                                                        Cancelar
                                                    </button>
                                                </div>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="form-check form-switch">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            checked={usarIconoDefectoEdicion}
                                                            onChange={(e) => {
                                                                const checked = e.target.checked;
                                                                setUsarIconoDefectoEdicion(checked);
                                                                if (checked) {
                                                                    setEditandoCatIcono('');
                                                                }
                                                            }}
                                                        />
                                                        <label className="form-check-label small text-muted">Usar icono por defecto</label>
                                                    </div>
                                                </div>
                                                {!usarIconoDefectoEdicion && (
                                                    <div>
                                                        <input type="file" className="form-control form-control-sm" accept="image/*" onChange={handleEditCatIconUpload} />
                                                        {editandoCatIcono && (
                                                            <div className="mt-2">
                                                                <small className="text-muted">Vista previa:</small>
                                                                <img src={editandoCatIcono} alt="Previsualización del icono" style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '6px', marginLeft: '6px' }} />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="d-inline-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#f4f6f9' }}>
                                                    {(() => {
                                                        const icono = getCategoryIcon(cat);
                                                        if (typeof icono === 'string' && icono.startsWith('data:')) {
                                                            return <img src={icono} alt="Icono de categoría" style={{ width: '24px', height: '24px', objectFit: 'cover', borderRadius: '6px' }} />;
                                                        }
                                                        return <span className="fs-5">{icono}</span>;
                                                    })()}
                                                </span>
                                                <div>
                                                    <span className="fw-bold text-dark">{getShortLabel(cat)}</span>
                                                    <span className="badge bg-light text-muted small ms-2 border">{conteoProds} productos</span>
                                                </div>
                                            </div>
                                        )}

                                        {rolSimulado === 'Administrador' && !esEditable && (
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-xs btn-outline-primary" onClick={() => handleEditarCategoria(cat)} title="Editar nombre">
                                                    <i className="fa-solid fa-pen"></i>
                                                </button>
                                                <button className="btn btn-xs btn-outline-danger" onClick={() => handleEliminarCategoria(cat)} title="Eliminar categoría">
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

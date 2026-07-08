import React from 'react';

export default function AdminCategories({
    categorias,
    productos,
    rolSimulado,
    nuevaCatNombre,
    setNuevaCatNombre,
    handleCrearCategoria,
    editandoCatNombre,
    setEditandoCatNombre,
    editandoCatNuevoNombre,
    setEditandoCatNuevoNombre,
    handleEditarCategoria,
    handleGuardarCategoria,
    handleEliminarCategoria
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
                                        placeholder="Ej: Panadería Orgánica"
                                        value={nuevaCatNombre}
                                        onChange={(e) => setNuevaCatNombre(e.target.value)}
                                    />
                                </div>
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
                                            <div className="d-flex align-items-center gap-2 flex-grow-1 me-3">
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
                                        ) : (
                                            <div>
                                                <span className="fw-bold text-dark">{cat}</span>
                                                <span className="badge bg-light text-muted small ms-2 border">{conteoProds} productos</span>
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

import React from 'react';
import { getEmojiPorCategoria, getShortLabel } from '../TarjetaProducto';

export default function AdminProducts({
    productosFiltrados,
    searchProd,
    setSearchProd,
    soloCriticos,
    setSoloCriticos,
    rolSimulado,
    openNewProdModal,
    openEditProdModal,
    eliminarProducto,
    showProdModal,
    setShowProdModal,
    editingProdId,
    prodForm,
    prodErrors,
    handleProdChange,
    handleProdImageUpload,
    handleProdSubmit,
    categorias
}) {
    return (
        <div>
            <div className="mb-4">
                <h2 className="fw-bold text-dark mb-1">Inventario de Productos</h2>
                <p className="text-muted small">Administración y control de stock crítico.</p>
            </div>

            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div className="d-flex align-items-center gap-3 flex-wrap">
                    {/* Buscador */}
                    <div style={{ maxWidth: '300px', width: '100%' }}>
                        <div className="input-group input-group-sm">
                            <span className="input-group-text bg-white text-muted"><i className="fa-solid fa-magnifying-glass"></i></span>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Buscar producto..." 
                                value={searchProd}
                                onChange={(e) => setSearchProd(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    {/* Botón Toggle Stock Crítico */}
                    <button 
                        className={`btn btn-sm d-flex align-items-center gap-1 fw-bold ${soloCriticos ? 'btn-danger' : 'btn-outline-danger'}`}
                        onClick={() => setSoloCriticos(!soloCriticos)}
                    >
                        <i className="fa-solid fa-triangle-exclamation"></i> 
                        {soloCriticos ? 'Ver Todos los Productos' : 'Ver Productos Críticos'}
                    </button>
                </div>
                
                {/* Botón Agregar (Solo Administrador) */}
                {rolSimulado === 'Administrador' && (
                    <button className="btn btn-success btn-sm shadow-sm" onClick={openNewProdModal}>
                        <i className="fa-solid fa-plus me-1"></i> Agregar Producto
                    </button>
                )}
            </div>

            <div className="card border-0 shadow-sm p-3 bg-white border rounded-3">
                <div className="table-responsive">
                    <table className="table align-middle table-hover">
                        <thead>
                            <tr className="table-light text-muted small">
                                <th>Código</th>
                                <th>Producto</th>
                                <th>Categoría</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Oferta</th>
                                {rolSimulado === 'Administrador' && <th>Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {productosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-muted">No se encontraron productos.</td>
                                </tr>
                            ) : (
                                productosFiltrados.map(p => (
                                    <tr key={p.id} className={p.stock <= p.stockCritico ? 'table-warning' : ''}>
                                        <td className="fw-bold">{p.id}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="fs-4">{p.imagen ? null : getEmojiPorCategoria(p.categoria)}</span>
                                                {p.imagen && <img src={p.imagen} alt="" style={{ width: '35px', height: '35px', objectFit: 'cover', borderRadius: '4px' }} />}
                                                <span>{p.nombre}</span>
                                                {p.stock <= p.stockCritico && <span className="badge bg-danger small ms-1">Crítico</span>}
                                            </div>
                                        </td>
                                        <td>{getShortLabel(p.categoria)}</td>
                                        <td className="fw-bold text-success">${p.precio.toLocaleString("es-CL")} CLP</td>
                                        <td>{p.stock} unid. <small className="text-muted d-block">(Crit: {p.stockCritico})</small></td>
                                        <td>
                                            {p.esOferta ? (
                                                <span className="badge bg-warning text-dark fw-bold">SÍ (-${(p.precioAnterior - p.precio).toLocaleString("es-CL")})</span>
                                            ) : 'NO'}
                                        </td>
                                        {rolSimulado === 'Administrador' && (
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-xs btn-outline-primary" onClick={() => openEditProdModal(p)}>
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>
                                                    <button className="btn btn-xs btn-outline-danger" onClick={() => {
                                                        if (window.confirm(`¿Deseas eliminar el producto ${p.nombre}?`)) {
                                                            eliminarProducto(p.id);
                                                        }
                                                    }}>
                                                        <i className="fa-solid fa-trash-can"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL PRODUCTO (REACTIVO) */}
            {showProdModal && (
                <>
                    <div className="modal-backdrop fade show" onClick={() => setShowProdModal(false)}></div>
                    <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content shadow-lg border-0">
                                <div className="modal-header bg-success text-white py-3">
                                    <h5 className="modal-title fw-bold">
                                        {editingProdId ? `Editar Producto: ${editingProdId}` : 'Nuevo Producto'}
                                    </h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowProdModal(false)}></button>
                                </div>
                                <form onSubmit={handleProdSubmit}>
                                    <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Código *</label>
                                                <input 
                                                    type="text" 
                                                    className={`form-control form-control-sm ${prodErrors.id ? 'is-invalid' : ''}`}
                                                    id="id" 
                                                    placeholder="Ej: FR004"
                                                    value={prodForm.id}
                                                    onChange={handleProdChange}
                                                    disabled={editingProdId !== null}
                                                />
                                                <div className="invalid-feedback">Código requerido (mín. 3 caracteres).</div>
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Nombre *</label>
                                                <input 
                                                    type="text" 
                                                    className={`form-control form-control-sm ${prodErrors.nombre ? 'is-invalid' : ''}`}
                                                    id="nombre" 
                                                    value={prodForm.nombre}
                                                    onChange={handleProdChange}
                                                    maxLength="100"
                                                />
                                                <div className="invalid-feedback">Nombre obligatorio (máx. 100).</div>
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Categoría *</label>
                                                <select 
                                                    id="categoria" 
                                                    className="form-select form-select-sm"
                                                    value={prodForm.categoria}
                                                    onChange={handleProdChange}
                                                >
                                                    {categorias.map(cat => (
                                                        <option key={cat} value={cat}>{getShortLabel(cat)}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Precio Unitario ($ CLP) *</label>
                                                <input 
                                                    type="number" 
                                                    className={`form-control form-control-sm ${prodErrors.precio ? 'is-invalid' : ''}`}
                                                    id="precio" 
                                                    value={prodForm.precio}
                                                    onChange={handleProdChange}
                                                />
                                                <div className="invalid-feedback">El precio debe ser un entero positivo.</div>
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Stock Inicial *</label>
                                                <input 
                                                    type="number" 
                                                    className={`form-control form-control-sm ${prodErrors.stock ? 'is-invalid' : ''}`}
                                                    id="stock" 
                                                    value={prodForm.stock}
                                                    onChange={handleProdChange}
                                                />
                                                <div className="invalid-feedback">Ingresa un stock entero positivo.</div>
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Stock Crítico</label>
                                                <input 
                                                    type="number" 
                                                    className={`form-control form-control-sm ${prodErrors.stockCritico ? 'is-invalid' : ''}`}
                                                    id="stockCritico" 
                                                    value={prodForm.stockCritico}
                                                    onChange={handleProdChange}
                                                />
                                                <div className="invalid-feedback">Ingresa un stock crítico válido.</div>
                                            </div>

                                            <div className="col-12">
                                                <div className="form-check">
                                                    <input 
                                                        className="form-check-input" 
                                                        type="checkbox" 
                                                        id="esOferta" 
                                                        checked={prodForm.esOferta}
                                                        onChange={handleProdChange}
                                                    />
                                                    <label className="form-check-label small fw-bold text-success" htmlFor="esOferta">
                                                        Este producto está en Oferta Promocional
                                                    </label>
                                                </div>
                                            </div>

                                            {prodForm.esOferta && (
                                                <div className="col-md-6">
                                                    <label className="form-label small fw-bold">Precio Anterior ($ CLP) *</label>
                                                    <input 
                                                        type="number" 
                                                        className={`form-control form-control-sm ${prodErrors.precioAnterior ? 'is-invalid' : ''}`}
                                                        id="precioAnterior" 
                                                        value={prodForm.precioAnterior}
                                                        onChange={handleProdChange}
                                                    />
                                                    <div className="invalid-feedback">El precio anterior debe ser mayor al precio en oferta.</div>
                                                </div>
                                            )}

                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Subir Foto Local</label>
                                                <input 
                                                    type="file" 
                                                    className="form-control form-control-sm"
                                                    accept="image/*"
                                                    onChange={handleProdImageUpload}
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">O ingresar URL de Imagen</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control form-control-sm" 
                                                    id="imagen"
                                                    placeholder="http://..."
                                                    value={prodForm.imagen.startsWith('data:') ? '' : prodForm.imagen}
                                                    onChange={handleProdChange}
                                                />
                                            </div>

                                            {prodForm.imagen && (
                                                <div className="col-12">
                                                    <span className="small text-muted d-block mb-1">Vista Previa:</span>
                                                    <img 
                                                        src={prodForm.imagen} 
                                                        alt="Previsualización" 
                                                        style={{ height: '80px', objectFit: 'cover', borderRadius: '6px' }}
                                                    />
                                                </div>
                                            )}

                                            <div className="col-12">
                                                <label className="form-label small fw-bold">Descripción *</label>
                                                <textarea 
                                                    className={`form-control form-control-sm ${prodErrors.descripcion ? 'is-invalid' : ''}`}
                                                    id="descripcion" 
                                                    rows="3" 
                                                    value={prodForm.descripcion}
                                                    onChange={handleProdChange}
                                                    maxLength="500"
                                                />
                                                <div className="invalid-feedback">La descripción es obligatoria (máx. 500 chars).</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer bg-light py-2">
                                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowProdModal(false)}>Cancelar</button>
                                        <button type="submit" className="btn btn-success btn-sm">Guardar Producto</button>
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

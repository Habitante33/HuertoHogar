import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function ToastContainer() {
    const { 
        toasts, 
        cerrarToast,
        promptConfig,
        setPromptConfig,
        confirmConfig,
        setConfirmConfig
    } = useContext(AppContext);

    // Si no hay nada que mostrar, no renderizar el contenedor
    if (toasts.length === 0 && !promptConfig && !confirmConfig) return null;

    const getIcon = (tipo) => {
        if (tipo === "error") return <i className="fa-solid fa-circle-xmark"></i>;
        if (tipo === "warning") return <i className="fa-solid fa-triangle-exclamation"></i>;
        if (tipo === "info") return <i className="fa-solid fa-circle-info"></i>;
        return <i className="fa-solid fa-circle-check"></i>;
    };

    return (
        <div 
            id="toast-container-hh" 
            style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 99999,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}
        >
            {/* 1. Listado de Toasts convencionales */}
            {toasts.map((toast) => (
                <div key={toast.id} className={`toast-hh toast-hh-${toast.type} show`}>
                    <div className="toast-hh-content">
                        <span className="toast-hh-icon" style={{ color: toast.type === 'warning' ? '#f39c12' : undefined }}>
                            {getIcon(toast.type)}
                        </span>
                        <span className="toast-hh-message">{toast.mensaje}</span>
                    </div>
                    <button className="toast-hh-close" onClick={() => cerrarToast(toast.id)}>
                        &times;
                    </button>
                </div>
            ))}

            {/* 2. Diálogo Prompt con Input de Contraseña (Toasts de Entrada) */}
            {promptConfig && (
                <div className="toast-hh toast-hh-info show shadow-lg border border-info" style={{ minWidth: '320px' }}>
                    <div className="toast-hh-content flex-column align-items-start w-100 p-2">
                        <div className="d-flex align-items-center mb-2 w-100">
                            <span className="toast-hh-icon text-info" style={{ fontSize: '1.2rem', marginRight: '8px' }}>
                                <i className="fa-solid fa-circle-question"></i>
                            </span>
                            <span className="toast-hh-message fw-bold text-dark" style={{ fontSize: '0.9rem' }}>
                                {promptConfig.mensaje}
                            </span>
                        </div>
                        <input 
                            type="password" 
                            className="form-control form-control-sm mb-2 prompt-hh-input" 
                            placeholder="Contraseña..." 
                            id="prompt-input-value"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const val = e.target.value;
                                    promptConfig.resolve(val);
                                    setPromptConfig(null);
                                }
                            }}
                        />
                        <div className="d-flex gap-2 w-100">
                            <button 
                                className="btn btn-sm btn-primary-hh flex-grow-1 btn-prompt-ok" 
                                onClick={() => {
                                    const val = document.getElementById("prompt-input-value").value;
                                    promptConfig.resolve(val);
                                    setPromptConfig(null);
                                }}
                            >
                                Aceptar
                            </button>
                            <button 
                                className="btn btn-sm btn-secondary flex-grow-1 btn-prompt-cancel" 
                                onClick={() => {
                                    promptConfig.resolve(null);
                                    setPromptConfig(null);
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Diálogo Confirm con botones Sí/No */}
            {confirmConfig && (
                <div className="toast-hh toast-hh-warning show shadow-lg border border-warning" style={{ minWidth: '320px' }}>
                    <div className="toast-hh-content flex-column align-items-start w-100 p-2">
                        <div className="d-flex align-items-center mb-2 w-100">
                            <span className="toast-hh-icon" style={{ color: '#f39c12', fontSize: '1.2rem', marginRight: '8px' }}>
                                <i className="fa-solid fa-circle-question"></i>
                            </span>
                            <span className="toast-hh-message fw-bold text-dark" style={{ fontSize: '0.9rem' }}>
                                {confirmConfig.mensaje}
                            </span>
                        </div>
                        <div className="d-flex gap-2 w-100 mt-2">
                            <button 
                                className="btn btn-sm btn-success flex-grow-1 btn-confirm-yes" 
                                onClick={() => {
                                    confirmConfig.resolve(true);
                                    setConfirmConfig(null);
                                }}
                            >
                                Sí
                            </button>
                            <button 
                                className="btn btn-sm btn-secondary flex-grow-1 btn-confirm-no" 
                                onClick={() => {
                                    confirmConfig.resolve(false);
                                    setConfirmConfig(null);
                                }}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

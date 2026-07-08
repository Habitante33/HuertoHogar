import React, { createContext, useContext, useMemo, useState } from 'react';
import storageService from '../services/storageService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [usuarioSesion, setUsuarioSesion] = useState(null);
    const [rolSimulado, setRolSimulado] = useState('Cliente');

    const login = (correo, contrasena) => {
        const usuarios = storageService.users.getAll();
        const usuario = usuarios.find((u) => u.correo === correo && u.contrasena === contrasena);
        if (!usuario) {
            return null;
        }

        const rolReal = usuario.tipo || 'Cliente';
        setUsuarioSesion(usuario);
        setRolSimulado(rolReal);
        return usuario;
    };

    const logout = () => {
        setUsuarioSesion(null);
        setRolSimulado('Cliente');
    };

    const registrarUsuario = (nuevoUsuario) => {
        const usuarios = storageService.users.getAll();
        const existe = usuarios.some((u) => String(u.run).toUpperCase() === String(nuevoUsuario.run).toUpperCase() || u.correo === nuevoUsuario.correo);
        if (existe) {
            return false;
        }

        storageService.users.create(nuevoUsuario);
        return true;
    };

    const actualizarPerfil = (run, datosActualizados) => {
        const updated = storageService.users.update(run, datosActualizados);
        if (!updated) {
            return null;
        }

        if (usuarioSesion && String(usuarioSesion.run) === String(run)) {
            const sesionActualizada = { ...usuarioSesion, ...updated };
            setUsuarioSesion(sesionActualizada);
            setRolSimulado(sesionActualizada.tipo || 'Cliente');
        }
        return updated;
    };

    const cambiarRolSimulado = () => {
        if (usuarioSesion) {
            setRolSimulado(usuarioSesion.tipo || 'Cliente');
        }
    };

    const value = useMemo(() => ({
        usuarioSesion,
        rolSimulado,
        login,
        logout,
        registrarUsuario,
        actualizarPerfil,
        cambiarRolSimulado,
        setUsuarioSesion,
        setRolSimulado
    }), [usuarioSesion, rolSimulado]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

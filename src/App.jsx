import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';

// Importación de Páginas
import Home from './pages/Home';
import Productos from './pages/Productos';
import DetalleProducto from './pages/DetalleProducto';
import Categorias from './pages/Categorias';
import Ofertas from './pages/Ofertas';
import Nosotros from './pages/Nosotros';
import Blog from './pages/Blog';
import Contacto from './pages/Contacto';
import LoginRegistro from './pages/LoginRegistro';
import Perfil from './pages/Perfil';
import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';
import CompraExitosa from './pages/CompraExitosa';
import CompraFallida from './pages/CompraFallida';
import AdminPanel from './pages/AdminPanel';
import AdminOrderDetail from './components/admin/AdminOrderDetail';
import AdminUserHistory from './components/admin/AdminUserHistory';

export default function App() {
    return (
        <AppProvider>
            <BrowserRouter>
                <Routes>
                    {/* Ruta Base con el Layout Global */}
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="productos" element={<Productos />} />
                        <Route path="productos/:id" element={<DetalleProducto />} />
                        <Route path="categorias" element={<Categorias />} />
                        <Route path="ofertas" element={<Ofertas />} />
                        <Route path="nosotros" element={<Nosotros />} />
                        <Route path="blog" element={<Blog />} />
                        <Route path="contacto" element={<Contacto />} />
                        <Route path="login" element={<LoginRegistro />} />
                        <Route path="perfil" element={<Perfil />} />
                        <Route path="carrito" element={<Carrito />} />
                        <Route path="checkout" element={<Checkout />} />
                        <Route path="checkout/success" element={<CompraExitosa />} />
                        <Route path="checkout/failure" element={<CompraFallida />} />
                        <Route path="admin" element={<AdminPanel />} />
                        <Route path="admin/orders" element={<AdminPanel />} />
                        <Route path="admin/products" element={<AdminPanel />} />
                        <Route path="admin/categories" element={<AdminPanel />} />
                        <Route path="admin/users" element={<AdminPanel />} />
                        <Route path="admin/reports" element={<AdminPanel />} />
                        <Route path="admin/profile" element={<AdminPanel />} />
                        <Route path="admin/orders/:id" element={<AdminOrderDetail />} />
                        <Route path="admin/users/:id/history" element={<AdminUserHistory />} />
                        
                        {/* Redireccionar cualquier ruta inválida al inicio */}
                        <Route path="*" element={<Home />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AppProvider>
    );
}

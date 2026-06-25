// MAIN.JS - CONTROLADOR Y CARGADOR DE COMPONENTES DE HUERTO HOGAR

// Variable global para ajustar rutas relativas de recursos (imágenes, assets)
window.ajustarRutaRecurso = function(ruta) {
    if (!ruta) return "";
    const path = window.location.pathname;
    const isInComponents = path.includes("/src/components/") || path.includes("/src/components");
    if (isInComponents) {
        return ruta.replace("src/assets/", "../assets/");
    }
    return ruta;
};

// Función global para redireccionar de manera segura desde cualquier carpeta
window.redireccionarA = function(pagina) {
    const path = window.location.pathname;
    const isInComponents = path.includes("/src/components/") || path.includes("/src/components");
    if (pagina === "admin.html") {
        window.location.href = isInComponents ? "admin.html" : "src/components/admin.html";
    } else if (pagina === "index.html") {
        window.location.href = isInComponents ? "../../index.html" : "index.html";
    } else if (pagina === "login.html") {
        window.location.href = isInComponents ? "login.html" : "src/components/login.html";
    } else if (pagina === "productos.html") {
        window.location.href = isInComponents ? "productos.html" : "src/components/productos.html";
    } else if (pagina === "carrito.html") {
        window.location.href = isInComponents ? "carrito.html" : "src/components/carrito.html";
    } else if (pagina === "blog.html") {
        window.location.href = isInComponents ? "blog.html" : "src/components/blog.html";
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inicializar la barra de navegación (badge, rol simulado y enlaces)
    inicializarNavbarComun();

    // 2. Ejecutar la lógica de la página correspondiente según la URL
    const path = window.location.pathname;
    
    if (path.includes("index.html") || path === "/" || path.endsWith("HuertoHogar/") || path.endsWith("HuertoHogar")) {
        if (typeof inicializarIndex === "function") inicializarIndex();
    } else if (path.includes("productos.html")) {
        if (typeof inicializarProductos === "function") inicializarProductos();
    } else if (path.includes("carrito.html")) {
        if (typeof inicializarCarrito === "function") inicializarCarrito();
    } else if (path.includes("login.html")) {
        if (typeof inicializarLoginRegistro === "function") inicializarLoginRegistro();
        // Si hay sesión activa, activar directamente la pestaña Mi Perfil
        const sesionActual = JSON.parse(localStorage.getItem("usuario_sesion"));
        if (sesionActual && sesionActual.run) {
            const perfilTabEl = document.getElementById("perfil-tab");
            if (perfilTabEl) {
                const bsPerfilTab = new bootstrap.Tab(perfilTabEl);
                bsPerfilTab.show();
                if (typeof cargarDatosPerfil === "function") cargarDatosPerfil();
            }
        }
    } else if (path.includes("admin.html")) {
        if (typeof inicializarAdmin === "function") inicializarAdmin();
    }
});

// Lógica común de navegación (Badge del carrito, simulador de rol docente y estilos activos)
function inicializarNavbarComun() {
    const path = window.location.pathname;
    const isInComponents = path.includes("/src/components/") || path.includes("/src/components");
    
    // Ajustar hrefs dinámicamente según la ubicación del archivo
    const inicioLink = document.getElementById("nav-inicio");
    const productosLink = document.getElementById("nav-productos");
    const carritoLink = document.getElementById("nav-carrito-btn");
    const loginLink = document.getElementById("nav-login-btn");
    const adminLink = document.getElementById("admin-nav-link");
    const blogLink = document.getElementById("nav-blog");
    
    const prefix = isInComponents ? "" : "src/components/";
    const indexLink = isInComponents ? "../../index.html" : "index.html";
    
    if (inicioLink) {
        inicioLink.href = indexLink;
        // Para los enlaces de scroll si estamos en subcarpetas
        const nosotrosLink = document.getElementById("nav-nosotros");
        const contactoLink = document.getElementById("nav-contacto");
        if (nosotrosLink) nosotrosLink.href = indexLink + "#nosotros";
        if (contactoLink) contactoLink.href = indexLink + "#contacto";
    }
    if (productosLink) productosLink.href = prefix + "productos.html";
    if (blogLink) blogLink.href = prefix + "blog.html";
    if (carritoLink) carritoLink.href = prefix + "carrito.html";
    if (loginLink) loginLink.href = prefix + "login.html";
    if (adminLink) adminLink.href = prefix + "admin.html";

    // Ajustar imagen del logo del navbar
    const logoImg = document.querySelector(".navbar-brand-hh img");
    if (logoImg) {
        logoImg.src = isInComponents ? "../assets/imagenes/logoHuerto.jpeg" : "src/assets/imagenes/logoHuerto.jpeg";
    }

    actualizarBadgeCarritoComun();
    resaltarEnlaceActivo();

    // Ajustar botón de Login / Cerrar Sesión según el estado de la sesión
    const usuarioSesion = JSON.parse(localStorage.getItem("usuario_sesion"));
    if (loginLink) {
        if (usuarioSesion) {
            loginLink.innerHTML = `<i class="fa-solid fa-right-from-bracket me-1"></i> Cerrar Sesión`;
            loginLink.href = "#";
            loginLink.className = "btn btn-outline-danger";
            loginLink.onclick = (e) => {
                e.preventDefault();
                localStorage.removeItem("usuario_sesion");
                localStorage.setItem("rol_simulado", "Cliente");
                alert("Sesión cerrada con éxito.");
                window.location.href = isInComponents ? "../../index.html" : "index.html";
            };
        } else {
            loginLink.innerHTML = `<i class="fa-solid fa-user me-1"></i> Mi Cuenta`;
            loginLink.href = prefix + "login.html";
            loginLink.className = "btn btn-primary-hh";
            loginLink.onclick = null;
        }
    }

    // Vaciar el simulador de roles para ocultarlo completamente de la vista pública
    const roleContainer = document.getElementById("role-selector-container");
    if (roleContainer) {
        roleContainer.innerHTML = "";
    }

    // Mostrar u ocultar el enlace de administración basado en el rol simulado
    if (adminLink) {
        const rol = obtenerRolSimulado();
        if (rol === "Cliente") {
            adminLink.style.display = "none";
        } else {
            adminLink.style.display = "block";
        }
    }
}

function resaltarEnlaceActivo() {
    const path = window.location.pathname;
    
    // Remover todas las clases active
    document.querySelectorAll(".nav-link-hh").forEach(el => el.classList.remove("active"));
    
    if (path.includes("productos.html")) {
        const el = document.getElementById("nav-productos");
        if (el) el.classList.add("active");
    } else if (path.includes("carrito.html")) {
        const el = document.getElementById("nav-carrito-btn");
        if (el) el.classList.add("active");
    } else if (path.includes("login.html")) {
        const el = document.getElementById("nav-login-btn");
        if (el) el.classList.add("active");
    } else if (path.includes("blog.html")) {
        const el = document.getElementById("nav-blog");
        if (el) el.classList.add("active");
    } else if (path.includes("index.html") || path === "/" || path.endsWith("HuertoHogar") || path.endsWith("HuertoHogar/")) {
        const el = document.getElementById("nav-inicio");
        if (el) el.classList.add("active");
    }
}

function getRolColorClass(rol) {
    if (rol === "Administrador") return "bg-danger";
    if (rol === "Vendedor") return "bg-primary";
    return "bg-success";
}

window.cambiarRolSimulado = function(nuevoRol) {
    localStorage.setItem("rol_simulado", nuevoRol);
    
    // Configurar sesión del usuario según el rol seleccionado
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioSimulado = usuarios.find(u => u.tipo === nuevoRol);
    if (usuarioSimulado) {
        localStorage.setItem("usuario_sesion", JSON.stringify(usuarioSimulado));
    } else {
        localStorage.setItem("usuario_sesion", null);
    }
    
    alert(`Rol simulado cambiado a: ${nuevoRol}`);
    location.reload();
}

function actualizarBadgeCarritoComun() {
    const badge = document.getElementById("cart-badge");
    if (badge) {
        let totalItems = 0;
        try {
            const raw = localStorage.getItem("carrito");
            const carrito = raw ? JSON.parse(raw) : [];
            if (Array.isArray(carrito)) {
                totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 0), 0);
            }
        } catch (e) {
            totalItems = 0;
        }
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? "inline-block" : "none";
    }
}

// =========================================================================
// SISTEMA DE NOTIFICACIONES PERSONALIZADAS (TOASTS EN FONDO BLANCO PREMIUM)
// =========================================================================

window.mostrarNotificacion = function(mensaje, tipo = "success") {
    let container = document.getElementById("toast-container-hh");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container-hh";
        container.style.position = "fixed";
        container.style.top = "20px";
        container.style.right = "20px";
        container.style.zIndex = "99999";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.gap = "10px";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast-hh toast-hh-${tipo}`;
    
    let icon = '<i class="fa-solid fa-circle-check"></i>';
    if (tipo === "error") {
        icon = '<i class="fa-solid fa-circle-xmark"></i>';
    } else if (tipo === "warning") {
        icon = '<i class="fa-solid fa-triangle-exclamation"></i>';
    } else if (tipo === "info") {
        icon = '<i class="fa-solid fa-circle-info"></i>';
    }

    toast.innerHTML = `
        <div class="toast-hh-content">
            <span class="toast-hh-icon">${icon}</span>
            <span class="toast-hh-message">${mensaje}</span>
        </div>
        <button class="toast-hh-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    container.appendChild(toast);

    // Auto-eliminar después de 4 segundos
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.add("toast-hh-fadeout");
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }
    }, 4000);
};

// Sobrescribir window.alert para usar el nuevo sistema
const originalAlert = window.alert;
window.alert = function(mensaje) {
    let tipo = "success";
    const msgLower = mensaje.toLowerCase();
    
    if (msgLower.includes("error") || msgLower.includes("incorrecto") || msgLower.includes("duplicado") || msgLower.includes("no puedes")) {
        tipo = "error";
    } else if (msgLower.includes("lo sentimos") || msgLower.includes("no hay") || msgLower.includes("stock") || msgLower.includes("vacío") || msgLower.includes("vacio") || msgLower.includes("advertencia")) {
        tipo = "warning";
    } else if (msgLower.includes("bienvenido") || msgLower.includes("éxito") || msgLower.includes("exitoso") || msgLower.includes("agregaron") || msgLower.includes("agregó") || msgLower.includes("guardado")) {
        tipo = "success";
    }

    // Guardar en sessionStorage para notificaciones persistentes ante redirecciones o recargas inmediatas
    sessionStorage.setItem("pending_toast", JSON.stringify({ message: mensaje, type: tipo }));
    setTimeout(() => {
        // Si no ha habido descarga ni redirección en 100ms, limpiamos para no repetir el toast en cargas futuras
        sessionStorage.removeItem("pending_toast");
    }, 100);

    // Mostrar inmediatamente si la página ya está lista
    if (document.body) {
        window.mostrarNotificacion(mensaje, tipo);
    } else {
        document.addEventListener("DOMContentLoaded", () => {
            window.mostrarNotificacion(mensaje, tipo);
        });
    }
};

// Verificar si hay alguna notificación pendiente al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
    const pending = sessionStorage.getItem("pending_toast");
    if (pending) {
        try {
            const data = JSON.parse(pending);
            window.mostrarNotificacion(data.message, data.type);
        } catch (e) {
            console.error("Error al procesar notificación pendiente:", e);
        }
        sessionStorage.removeItem("pending_toast");
    }
});

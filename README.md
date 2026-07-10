# HuertoHogar - Tienda y Mantenedor Online

HuertoHogar es una aplicación web responsiva e interactiva diseñada para la venta y distribución de productos frescos y orgánicos del campo chileno. El sistema consta de una tienda online pública orientada al cliente y un panel administrativo avanzado para vendedores y administradores, construido sobre **React 19** y **Vite**, utilizando persistencia local y geolocalización.

---

##  Tecnologías Utilizadas

*   **Framework y Construcción:** [React 19](https://react.dev/) y [Vite](https://vite.dev/) para un desarrollo ágil y bundles rápidos.
*   **Enrutamiento:** [React Router DOM v7](https://reactrouter.com/) para SPA (Single Page Application).
*   **Estructura y Estilos:** HTML5 Semántico, CSS3 Corporativo ([estilos.css](file:///c:/Users/allen/Desktop/HuertoHogar/src/css/estilos.css)) y **Bootstrap 5.3** para diseño responsivo moderno.
*   **Mapas y Geolocalización:** [Leaflet.js](https://leafletjs.com/) y `react-leaflet` para ubicar sucursales físicas y puntos de retiro.
*   **Persistencia de Datos:** `localStorage` mediante servicios desacoplados para simular una base de datos local persistente.
*   **Calidad de Código y Linter:** [Oxlint](https://github.com/oxc-project/oxc) para análisis estático ultrarrápido del código.

---

##  Estructura del Proyecto

La estructura real de archivos mapeada a partir del espacio de trabajo es la siguiente:

```text
HuertoHogar/
├── index.html                       ← Plantilla base de la SPA React
├── .gitignore
├── .oxlintrc.json                   ← Configuración de reglas de linter rápido (Oxlint)
├── package.json                     ← Dependencias del proyecto (React, Leaflet, Bootstrap)
├── package-lock.json
├── vite.config.js                   ← Configuración del empaquetador Vite
├── README.md                        ← Documentación del proyecto
└── src/
    ├── main.jsx                     ← Punto de entrada inicial de React
    ├── App.jsx                      ← Enrutador global de la aplicación (Vías de navegación)
    ├── assets/
    │   ├── hero.png                 ← Imagen del banner principal
    │   ├── react.svg
    │   ├── vite.svg
    │   └── imagenes/                ← Galería de fotos oficiales de los productos y logo
    │       ├── logoHuerto.jpeg      ← Logotipo oficial del huerto
    │       └── [productos].jpeg/png ← Imágenes de frutas y verduras reales
    ├── components/
    │   ├── AlertaStock.jsx          ← Alertas visuales sobre el stock crítico de productos
    │   ├── Footer.jsx               ← Pie de página corporativo común
    │   ├── Layout.jsx               ← Envoltura de diseño base con Navbar y Footer
    │   ├── MapaHuerto.jsx           ← Componente de mapas e interactivo (Leaflet.js)
    │   ├── Navbar.jsx               ← Barra de navegación reactiva y badge del carrito
    │   ├── TarjetaProducto.jsx      ← Card interactivo del catálogo de productos
    │   ├── ToastContainer.jsx       ← Manejador de notificaciones toast personalizadas
    │   └── admin/                   ← Subcomponentes del panel de control
    │       ├── AdminCategories.jsx  ← Gestión y CRUD de categorías
    │       ├── AdminDashboard.jsx   ← Panel de métricas y gráficos
    │       ├── AdminHeader.jsx
    │       ├── AdminOrderDetail.jsx ← Vista de detalle de órdenes administradas
    │       ├── AdminOrders.jsx      ← Monitoreo y cambio de estado de pedidos
    │       ├── AdminPanel.jsx       ← Núcleo y tabs de la interfaz administrativa
    │       ├── AdminProducts.jsx    ← CRUD completo del inventario de productos
    │       ├── AdminProfile.jsx     ← Visualización de perfil interno
    │       ├── AdminReports.jsx     ← Módulo de estadísticas visuales
    │       ├── AdminSectionPage.jsx
    │       ├── AdminSidebar.jsx     ← Menú lateral de navegación administrativa
    │       ├── AdminUserHistory.jsx
    │       └── AdminUsers.jsx       ← CRUD de usuarios (Clientes/Administradores/Vendedores)
    ├── context/
    │   ├── AppContext.jsx           ← Proveedor global de estados reactivos y persistencia
    │   └── seedData.js              ← Base de datos semilla (Productos, Regiones, Cuentas)
    ├── css/
    │   └── estilos.css              ← Reglas CSS corporativas, animaciones y glassmorphism
    ├── pages/                       ← Vistas de páginas o pantallas completas
    │   ├── AdminPanel.jsx           ← Panel superior administrativo (Ruta /admin)
    │   ├── Blog.jsx                 ← Feed interactivo y sección de comentarios
    │   ├── Carrito.jsx              ← Desglose de carrito, subtotales y envío
    │   ├── Categorias.jsx           ← Filtrado temático de colecciones
    │   ├── Checkout.jsx             ← Formulario de envío multi-paso y validación de RUN
    │   ├── CompraExitosa.jsx        ← Pantalla de confirmación y orden
    │   ├── CompraFallida.jsx        ← Pantalla de reintento de pago
    │   ├── Contacto.jsx             ← Formulario de contacto con mapa Leaflet integrado
    │   ├── DetalleProducto.jsx      ← Ficha detallada, stock disponible y galería
    │   ├── Home.jsx                 ← Landing page con hero banner y destacados
    │   ├── LoginRegistro.jsx        ← Sistema unificado de autenticación de usuarios
    │   ├── Nosotros.jsx             ← Misión, visión e historia corporativa
    │   ├── Ofertas.jsx              ← Muro de promociones y descuentos especiales
    │   └── Perfil.jsx               ← Dashboard del cliente, historial y repetir pedido
    ├── services/
    │   └── storageService.js        ← Abstracción genérica de operaciones CRUD de LocalStorage
    └── utils/
        └── validaciones.js          ← Validación matemática del RUN chileno (Módulo 11)
```

# Desarrolladores
# Jorge Silva
# Allen Navarrete


# HuertoHogar - Tienda y Mantenedor Online

HuertoHogar es una aplicación web responsiva e interactiva diseñada para la venta y distribución de productos frescos y orgánicos del campo chileno. El sistema consta de una tienda online pública orientada al cliente y un panel administrativo avanzado para vendedores y administradores, construido 100% sobre tecnologías nativas del lado del cliente.

---

##  Tecnologías Utilizadas

*   **Estructura y Contenido:** HTML5 Semántico.
*   **Diseño y Estética:** CSS3 (Estilos Propios Corporativos) y **Bootstrap 5.3** (diseño responsivo y componentes premium).
*   **Lógica de Negocio y UI:** Vanilla JavaScript (ES6+).
*   **Mapas y Geolocalización:** **Leaflet.js** (OpenStreetMap API) para geolocalización de sucursales.
*   **Persistencia:** `localStorage` (Persistencia local del navegador).

---

##  Estructura del Proyecto

```text
HuertoHogar/
├── index.html
├── .gitignore
├── README.md
└── src/
    ├── components/
    │   ├── admin.html               ← Panel administrativo (CRUD y gestión de órdenes)
    │   ├── blog.html                ← Feed del blog orgánico simplificado
    │   ├── carrito.html             ← Carrito de compras y pasarela de pago
    │   ├── detalle.html             ← Galería y ficha de detalle del producto
    │   ├── footer.html              ← Pie de página de compatibilidad local
    │   ├── login.html               ← Vista de ingreso e inicio de sesión
    │   ├── navbar.html              ← Barra de navegación dinámica
    │   └── productos.html           ← Catálogo de productos interactivo
    ├── css/
    │   └── estilos.css              ← Variables, animaciones y estilos corporativos
    ├── js/
    │   ├── admin.js                 ← Control de mantenedores y prompts de claves admin
    │   ├── carrito.js               ← Gestión de cantidades, stock y checkout
    │   ├── datos.js                 ← Infraestructura LocalStorage (DB helper)
    │   ├── main.js                  ← Inicializador, active links y badge común
    │   ├── tienda.js                ← Renderizado de catálogo, filtros y mapa Leaflet
    │   └── validaciones.js          ← Algoritmo RUN chileno y validaciones declarativas
    └── assets/
        └── imagenes/
            └── logoHuerto.jpeg      ← Logotipo oficial del huerto
```

##  Arquitectura del Código

La base de código está estructurada de manera modular y desacoplada aplicando los principios SOLID (Responsabilidad Única):

1.  **Capa de Infraestructura y Datos (`datos.js`):**
    *   Contiene el modelo semilla de datos (Productos, Comunas, Regiones, Usuarios y Órdenes).
    *   Encapsula el acceso al disco del navegador mediante el objeto **`DB`**, aislando la base de datos local del resto de la lógica de presentación.
2.  **Capa de Validaciones y Lógica Central (`validaciones.js`):**
    *   Implementa la validación matemática de RUN chileno (Módulo 11).
    *   Aloja la función centralizada **`validarFormulario()`**, la cual procesa la validación de cualquier formulario de forma declarativa mediante configuraciones de reglas.
3.  **Capa de Presentación y Controlador (`main.js`, `tienda.js`, `carrito.js`, `admin.js`):**
    *   Gestiona el renderizado dinámico de tarjetas de productos, tablas administrativas y modales.
    *   Controla la navegación activa, carrito de compras (badge), flujo de despacho, simulación de pasarelas de pago y las operaciones CRUD.

---


##  Equipo de Desarrollo

*   **Allen Navarrete**
*   **Jorge Silva** 
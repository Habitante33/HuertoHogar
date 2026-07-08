# Registro de Commits Colaborativo - HuertoHogar

Este documento contiene la guía paso a paso para emular el historial de commits colaborativo entre **Allen** y **Jorge** en vuestro repositorio de Git local.

Para simular la autoría de cada integrante en Git, se deben alternar los nombres y correos usando el parámetro `--author` en el comando `git commit` (por ejemplo: `git commit --author="Jorge <jorge@inacapmail.cl>"`).

---

## Mapeo de Sustitución de Archivos (HTML Estático ➔ React Component)

| Archivo Original Estático | Archivo Nuevo en React | Responsable |
| :--- | :--- | :--- |
| **Configuración inicial** | `package.json`, `vite.config.js`, `src/App.jsx` | Jorge |
| `src/js/init.js` | `src/context/AppContext.jsx` | Jorge |
| `src/css/estilos.css` | `src/index.css`, `src/css/estilos.css` | Allen |
| `index.html` (Main) | `src/pages/Home.jsx` | Allen |
| `src/components/productos.html` | `src/pages/Productos.jsx` | Jorge |
| `src/components/nosotros.html` | `src/pages/Nosotros.jsx` | Allen |
| `src/components/blog.html` | `src/pages/Blog.jsx` | Allen |
| `src/components/contacto.html` | `src/pages/Contacto.jsx` | Allen |
| `src/components/login.html` | `src/pages/LoginRegistro.jsx` | Jorge |
| `src/components/login.html` (Subperfil) | `src/pages/Perfil.jsx` | Allen |
| `src/components/carrito.html` | `src/pages/Carrito.jsx` | Jorge |
| **Nuevo (Checkout)** | `src/pages/Checkout.jsx` | Allen |
| `src/js/admin.js` | `src/pages/AdminPanel.jsx` | Allen |
| `src/js/admin.js` (Modularización) | `src/components/admin/` | Jorge |

---

## Historial Cronológico de Commits

Sigue esta secuencia para crear tu historial de commits. Para cada paso, copia los archivos correspondientes a su ubicación en el proyecto React antes de ejecutar los comandos Git.

### Commit 1: Inicialización del Entorno
*   **Autor:** Jorge `<jorge@inacapmail.cl>`
*   **Archivos a añadir:** `package.json`, `vite.config.js`, `src/main.jsx`, `src/App.jsx` (versión inicial sin rutas avanzadas) e `.gitignore`.
*   **Comando:**
    ```bash
    git add package.json vite.config.js src/main.jsx src/App.jsx .gitignore
    git commit --author="Jorge <jorge@inacapmail.cl>" -m "chore: inicializar configuracion de Vite, React y dependencias iniciales"
    ```

### Commit 2: Estilos Globales y Maquetación Base
*   **Autor:** Allen `<allen@inacapmail.cl>`
*   **Archivos a añadir/reemplazar:** `src/index.css`, `src/css/estilos.css`, `src/components/Layout.jsx`, `src/components/Navbar.jsx` (versión inicial), `src/components/Footer.jsx`.
*   **Comando:**
    ```bash
    git add src/index.css src/css/estilos.css src/components/Layout.jsx src/components/Navbar.jsx src/components/Footer.jsx
    git commit --author="Allen <allen@inacapmail.cl>" -m "feat: implementar hoja de estilos global, variables CSS y componente Layout"
    ```

### Commit 3: Estado Global y Persistencia en LocalStorage
*   **Autor:** Jorge `<jorge@inacapmail.cl>`
*   **Archivos a añadir:** `src/context/AppContext.jsx`.
*   **Comando:**
    ```bash
    git add src/context/AppContext.jsx
    git commit --author="Jorge <jorge@inacapmail.cl>" -m "feat: implementar AppContext para control de estados y persistencia LocalStorage"
    ```

### Commit 4: Migración de la Landing Page (Home)
*   **Autor:** Allen `<allen@inacapmail.cl>`
*   **Archivos a añadir:** `src/pages/Home.jsx`.
*   **Comando:**
    ```bash
    git add src/pages/Home.jsx
    git commit --author="Allen <allen@inacapmail.cl>" -m "feat: migrar landing page Home con integracion de mapa Leaflet"
    ```

### Commit 5: Catálogo de Productos
*   **Autor:** Jorge `<jorge@inacapmail.cl>`
*   **Archivos a añadir:** `src/pages/Productos.jsx`, `src/components/TarjetaProducto.jsx`.
*   **Comando:**
    ```bash
    git add src/pages/Productos.jsx src/components/TarjetaProducto.jsx
    git commit --author="Jorge <jorge@inacapmail.cl>" -m "feat: crear vista Productos con filtros reactivos de busqueda"
    ```

### Commit 6: Páginas Informativas (Nosotros, Blog y Contacto)
*   **Autor:** Allen `<allen@inacapmail.cl>`
*   **Archivos a añadir:** `src/pages/Nosotros.jsx`, `src/pages/Blog.jsx`, `src/pages/Contacto.jsx`.
*   **Comando:**
    ```bash
    git add src/pages/Nosotros.jsx src/pages/Blog.jsx src/pages/Contacto.jsx
    git commit --author="Allen <allen@inacapmail.cl>" -m "feat: migrar paginas institucionales y formulario de contacto reactivo"
    ```

### Commit 7: Formulario de Autenticación (Login y Registro)
*   **Autor:** Jorge `<jorge@inacapmail.cl>`
*   **Archivos a añadir:** `src/pages/LoginRegistro.jsx`, `src/utils/validaciones.js`.
*   **Comando:**
    ```bash
    git add src/pages/LoginRegistro.jsx src/utils/validaciones.js
    git commit --author="Jorge <jorge@inacapmail.cl>" -m "feat: crear formulario LoginRegistro con validaciones de RUT y correo"
    ```

### Commit 8: Vista de Perfil de Cliente
*   **Autor:** Allen `<allen@inacapmail.cl>`
*   **Archivos a añadir:** `src/pages/Perfil.jsx`.
*   **Comando:**
    ```bash
    git add src/pages/Perfil.jsx
    git commit --author="Allen <allen@inacapmail.cl>" -m "feat: implementar vista de Perfil con selector de comunas y repetir pedido"
    ```

### Commit 9: Carrito de Compras
*   **Autor:** Jorge `<jorge@inacapmail.cl>`
*   **Archivos a añadir:** `src/pages/Carrito.jsx`.
*   **Comando:**
    ```bash
    git add src/pages/Carrito.jsx
    git commit --author="Jorge <jorge@inacapmail.cl>" -m "feat: crear vista Carrito y logica de control de stock fisico"
    ```

### Commit 10: Formulario de Checkout y Pago
*   **Autor:** Allen `<allen@inacapmail.cl>`
*   **Archivos a añadir:** `src/pages/Checkout.jsx`.
*   **Comando:**
    ```bash
    git add src/pages/Checkout.jsx
    git commit --author="Allen <allen@inacapmail.cl>" -m "feat: implementar formulario de checkout y pasarela de pago simulada"
    ```

### Commit 11: Pantallas de Compra Exitosa y Fallida
*   **Autor:** Jorge `<jorge@inacapmail.cl>`
*   **Archivos a añadir:** `src/pages/CompraExitosa.jsx`, `src/pages/CompraFallida.jsx`.
*   **Comando:**
    ```bash
    git add src/pages/CompraExitosa.jsx src/pages/CompraFallida.jsx
    git commit --author="Jorge <jorge@inacapmail.cl>" -m "feat: crear vistas de CompraExitosa y CompraFallida con comprobante"
    ```

### Commit 12: Estructura del Panel Admin y Restricción por Roles
*   **Autor:** Allen `<allen@inacapmail.cl>`
*   **Archivos a añadir:** `src/pages/AdminPanel.jsx` (versión inicial monolítica).
*   **Comando:**
    ```bash
    git add src/pages/AdminPanel.jsx
    git commit --author="Allen <allen@inacapmail.cl>" -m "sec: restringir acceso al panel admin y configurar vistas seguras"
    ```

### Commit 13: CRUD de Productos en Panel Admin
*   **Autor:** Jorge `<jorge@inacapmail.cl>`
*   **Archivos a modificar:** `src/pages/AdminPanel.jsx` (sección CRUD de productos con carga Base64).
*   **Comando:**
    ```bash
    git add src/pages/AdminPanel.jsx
    git commit --author="Jorge <jorge@inacapmail.cl>" -m "feat: implementar CRUD de productos con carga de fotos locales a Base64"
    ```

### Commit 14: CRUD de Usuarios y Validación de Contraseña
*   **Autor:** Allen `<allen@inacapmail.cl>`
*   **Archivos a modificar:** `src/pages/AdminPanel.jsx` (sección CRUD de usuarios y protección por clave).
*   **Comando:**
    ```bash
    git add src/pages/AdminPanel.jsx
    git commit --author="Allen <allen@inacapmail.cl>" -m "feat: implementar CRUD de usuarios y validacion de contrasena de administrador"
    ```

### Commit 15: Modularización Completa del Panel Admin
*   **Autor:** Jorge `<jorge@inacapmail.cl>`
*   **Archivos a añadir/modificar:** `src/components/admin/` (los 9 archivos modularizados) y `src/pages/AdminPanel.jsx` (simplificado).
*   **Comando:**
    ```bash
    git add src/components/admin/ src/pages/AdminPanel.jsx
    git commit --author="Jorge <jorge@inacapmail.cl>" -m "refactor: modularizar el panel administrativo en componentes reusables"
    ```

### Commit 16: Pulido Final de Estilos y Filtro de Ofertas
*   **Autor:** Allen `<allen@inacapmail.cl>`
*   **Archivos a modificar:** `src/components/Navbar.jsx` (remoción del selector simulado docente y ajuste de ancho de Perfil) y `src/pages/Productos.jsx` (filtro reactivo `🏷️ Ofertas`).
*   **Comando:**
    ```bash
    git add src/components/Navbar.jsx src/pages/Productos.jsx
    git commit --author="Allen <allen@inacapmail.cl>" -m "style: pulir navbar sin selector de simulador y añadir filtro de Ofertas en catalogo"
    ```

---

## Cómo aplicar esta simulación en Git

1. Asegúrate de tener los archivos listos en las carpetas correspondientes.
2. Abre la consola en el directorio de tu proyecto.
3. Copia y ejecuta secuencialmente los comandos de cada commit.
4. Una vez realizados los 16 commits, ejecuta `git log --graph --oneline` para verificar que el historial quedó registrado perfectamente alternado entre ambos integrantes.

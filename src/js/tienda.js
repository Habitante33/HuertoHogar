// TIENDA.JS - LÓGICA DE CATÁLOGO, DETALLE DE PRODUCTOS Y HOME

// ==========================================
// 1. PÁGINA DE INICIO (INDEX.HTML)
// ==========================================
function inicializarIndex() {
    // 1.1 Cargar Mapa Leaflet.js
    const mapElement = document.getElementById("mapa-nosotros");
    if (mapElement && typeof L !== "undefined") {
        const mapa = L.map('mapa-nosotros').setView([-36.5, -72.0], 5);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapa);

        const sucursales = [
            { ciudad: "Santiago", lat: -33.4489, lng: -70.6693, desc: "Casa Matriz y Distribución Central" },
            { ciudad: "Viña del Mar", lat: -33.0245, lng: -71.5518, desc: "Sucursal Viña del Mar" },
            { ciudad: "Valparaíso", lat: -33.0472, lng: -71.6127, desc: "Punto de Reparto Orgánico" },
            { ciudad: "Concepción", lat: -36.8201, lng: -73.0444, desc: "Distribuidora Regional del Biobío" },
            { ciudad: "Nacimiento", lat: -37.5028, lng: -72.6781, desc: "Sucursal y Productores Locales" },
            { ciudad: "Villarrica", lat: -39.2789, lng: -72.2272, desc: "Sucursal Zona Sur Verde" },
            { ciudad: "Puerto Montt", lat: -41.4693, lng: -72.9424, desc: "Sucursal Austral HuertoHogar" }
        ];

        sucursales.forEach(s => {
            L.marker([s.lat, s.lng])
                .addTo(mapa)
                .bindPopup(`<b>HuertoHogar ${s.ciudad}</b><br>${s.desc}`);
        });
    }

    // 1.2 Validación de Formulario de Contacto
    const formContacto = document.getElementById("form-contacto");
    const inputComentario = document.getElementById("contacto-comentario");
    const charCounter = document.getElementById("char-counter");

    if (inputComentario && charCounter) {
        inputComentario.addEventListener("input", function() {
            const len = this.value.length;
            charCounter.textContent = `${len}/500`;
            this.classList.toggle("is-invalid", len > 500);
        });
    }

    if (formContacto) {
        formContacto.addEventListener("submit", function(e) {
            e.preventDefault();
            
            // REF-05: Validación del formulario de contacto declarativa
            const valido = validarFormulario({
                "contacto-nombre": { required: true, maxLength: 100 },
                "contacto-correo": { required: true, maxLength: 100, pattern: /^[a-zA-Z0-9._%+-]+@(?:inacap\.cl|profesor\.inacap\.cl|gmail\.com)$/ },
                "contacto-comentario": { required: true, maxLength: 500 }
            });

            if (valido) {
                const toast = new bootstrap.Toast(document.getElementById("toast-contacto-success"));
                toast.show();
                formContacto.reset();
                if (charCounter) charCounter.textContent = "0/500";
            }
        });
    }

    // 1.3 Cargar Productos Destacados
    renderizarProductosDestacados();
}

function renderizarProductosDestacados() {
    const grid = document.getElementById("productos-destacados-grid");
    if (!grid) return;

    // REF-06: Consulta de datos unificada
    const productos = DB.get("productos");
    const destacados = productos.slice(0, 3);
    grid.innerHTML = "";

    destacados.forEach(p => {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-4";
        col.innerHTML = crearTarjetaProductoHTML(p, true);
        grid.appendChild(col);
    });
}

// ==========================================
// 2. PÁGINA DE CATÁLOGO (PRODUCTOS.HTML)
// ==========================================
let catActiva = "Todos";

function inicializarProductos() {
    const catalogoGrid = document.getElementById("catalogo-grid");
    const buscador = document.getElementById("buscador-producto");
    const filterContainer = document.getElementById("categorias-filtro-container");

    if (!catalogoGrid) return;

    renderizarCatalogo(catActiva, buscador ? buscador.value : "");

    if (buscador) {
        buscador.addEventListener("input", () => {
            renderizarCatalogo(catActiva, buscador.value);
        });
    }

    if (filterContainer) {
        filterContainer.addEventListener("click", (e) => {
            if (e.target.classList.contains("category-filter-btn")) {
                document.querySelectorAll(".category-filter-btn").forEach(btn => {
                    btn.classList.remove("active");
                });
                e.target.classList.add("active");
                catActiva = e.target.getAttribute("data-categoria");
                renderizarCatalogo(catActiva, buscador ? buscador.value : "");
            }
        });
    }
}

function renderizarCatalogo(categoria, busqueda) {
    const catalogoGrid = document.getElementById("catalogo-grid");
    if (!catalogoGrid) return;

    const productos = DB.get("productos");
    catalogoGrid.innerHTML = "";

    const filtrados = productos.filter(p => {
        const matchesCat = (categoria === "Todos" || p.categoria === categoria);
        const matchesBusq = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                            p.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
                            p.id.toLowerCase().includes(busqueda.toLowerCase());
        return matchesCat && matchesBusq;
    });

    if (filtrados.length === 0) {
        catalogoGrid.innerHTML = `<div class="col-12 text-center my-5"><p class="fs-5 text-muted">No se encontraron productos.</p></div>`;
        return;
    }

    filtrados.forEach(p => {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-4";
        col.innerHTML = crearTarjetaProductoHTML(p, false);
        catalogoGrid.appendChild(col);
    });
}

// REF-04: Constructor de plantilla HTML para tarjetas de productos (DRY)
function crearTarjetaProductoHTML(p, isDestacado = false) {
    const linkPath = isDestacado ? `src/components/detalle.html?id=${p.id}` : `detalle.html?id=${p.id}`;
    const badgeAlign = isDestacado ? 'align-self-center' : 'align-self-start';
    const bodyClass = isDestacado ? 'card-body d-flex flex-column text-center' : 'card-body d-flex flex-column';
    
    const imageBlock = p.imagen ? `
        <img src="${ajustarRutaRecurso(p.imagen)}" alt="${p.nombre}" class="w-100 h-100 img-zoom" style="object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
    ` : '';

    // Badge de Oferta en Amarillo Mostaza (#FFD700)
    const badgePromo = p.esOferta ? `
        <span class="position-absolute top-0 end-0 badge text-dark fw-bold m-2 shadow-sm" style="background-color: var(--hh-accent-yellow); z-index: 2; font-size: 0.75rem; border-radius: 6px;">
            ¡OFERTA!
        </span>
    ` : '';

    const priceHtmlDestacado = p.esOferta ? `
        <div class="mb-3">
            <span class="fw-bold text-success fs-5">$${p.precio.toLocaleString("es-CL")} CLP</span>
            <span class="text-xs text-decoration-line-through text-muted ms-2">$${p.precioAnterior.toLocaleString("es-CL")}</span>
        </div>
    ` : `
        <p class="fw-bold text-success fs-5 mb-3">$${p.precio.toLocaleString("es-CL")} CLP</p>
    `;

    const contentDestacado = `
        ${priceHtmlDestacado}
        <div class="mt-auto">
            <a href="${linkPath}" class="btn btn-sm btn-outline-success w-100">Ver Detalle</a>
        </div>
    `;

    const priceHtmlCatalogo = p.esOferta ? `
        <div class="d-flex align-items-center gap-2">
            <span class="fw-bold fs-5 text-success">$${p.precio.toLocaleString("es-CL")} CLP</span>
            <span class="text-xs text-decoration-line-through text-muted">$${p.precioAnterior.toLocaleString("es-CL")}</span>
        </div>
    ` : `
        <span class="fw-bold fs-5 text-success">$${p.precio.toLocaleString("es-CL")} CLP</span>
    `;

    const contentCatalogo = `
        <p class="card-text text-muted text-truncate">${p.descripcion}</p>
        <div class="mt-auto">
            <div class="d-flex justify-content-between align-items-center mb-2">
                ${priceHtmlCatalogo}
                <span class="text-xs text-muted">Stock: ${p.stock}</span>
            </div>
            <div class="row g-2 mt-2">
                <div class="col-6">
                    <a class="btn btn-sm btn-outline-secondary w-100" href="${linkPath}">Ver Detalle</a>
                </div>
                <div class="col-6">
                    <button class="btn btn-sm btn-primary-hh w-100" onclick="agregarRapidoCarritoModal('${p.id}')">Añadir</button>
                </div>
            </div>
        </div>
    `;

    return `
        <div class="card h-100 card-product position-relative">
            ${badgePromo}
            <a href="${linkPath}">
                <div class="text-center bg-light rounded-top position-relative" style="overflow: hidden; height: 180px;">
                    ${imageBlock}
                    <div style="height: 180px; display: ${p.imagen ? 'none' : 'flex'};" class="align-items-center justify-content-center bg-light text-center w-100">
                        <span class="fs-1">${getEmojiPorCategoria(p.categoria)}</span>
                    </div>
                </div>
            </a>
            <div class="${bodyClass}">
                <span class="badge bg-secondary mb-2 ${badgeAlign}">${p.categoria}</span>
                <a href="${linkPath}" class="text-decoration-none text-dark hover-green">
                    <h5 class="card-title text-dark fw-bold mb-1">${p.nombre}</h5>
                </a>
                ${isDestacado ? contentDestacado : contentCatalogo}
            </div>
        </div>
    `;
}

window.agregarRapidoCarritoModal = function(id) {
    if (typeof agregarAlCarrito === "function") {
        agregarAlCarrito(id, 1);
    }
}

// ADMIN.JS - LOGICA DE MANTENEDORES, LOGIN Y CONTROL DE ROLES

// ==========================================
// 1. INICIAR LOGIN / REGISTRO
// ==========================================
function inicializarLoginRegistro() {
    if (typeof configurarRegionComuna === "function") {
        configurarRegionComuna("reg-region", "reg-comuna");
    }

    const loginConfig = {
        "login-correo": { 
            required: true, 
            maxLength: 100, 
            pattern: /^[a-zA-Z0-9._%+-]+@(?:inacap\.cl|inacapmail\.cl|gmail\.com)$/ 
        },
        "login-contrasena": { required: true, minLength: 4, maxLength: 10 }
    };

    const registroConfig = {
        "reg-run": { required: true, custom: val => typeof validarRUT === "function" && validarRUT(val) },
        "reg-nombre": { required: true, maxLength: 50 },
        "reg-apellidos": { required: true, maxLength: 100 },
        "reg-correo": { 
            required: true, 
            maxLength: 100, 
            pattern: /^[a-zA-Z0-9._%+-]+@(?:inacap\.cl|profesor\.inacap\.cl|gmail\.com)$/ 
        },
        "reg-region": { required: true },
        "reg-comuna": { required: true },
        "reg-direccion": { required: true, maxLength: 300 },
        "reg-contrasena": { required: true, minLength: 4, maxLength: 10 }
    };

    // Pre-vincular validaciones en tiempo real para remover el estado is-invalid inmediatamente al corregir
    if (typeof validarFormulario === "function") {
        validarFormulario(loginConfig, true);
        validarFormulario(registroConfig, true);
    }

    // Formulario Login
    const formLogin = document.getElementById("form-login");
    if (formLogin) {
        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();

            // REF-05: Validación del formulario de login declarativa
            const valido = validarFormulario(loginConfig);

            if (valido) {
                const correo = document.getElementById("login-correo").value.trim();
                const contrasena = document.getElementById("login-contrasena").value;
                const usuarios = DB.get("usuarios");
                const usuarioEncontrado = usuarios.find(u => u.correo === correo && u.contrasena === contrasena);

                if (usuarioEncontrado) {
                    DB.set("usuario_sesion", usuarioEncontrado);
                    localStorage.setItem("rol_simulado", usuarioEncontrado.tipo);
                    alert(`¡Bienvenido ${usuarioEncontrado.nombre}! Rol: ${usuarioEncontrado.tipo}.`);
                    
                    if (usuarioEncontrado.tipo === "Administrador" || usuarioEncontrado.tipo === "Vendedor") {
                        window.redireccionarA("admin.html");
                    } else {
                        window.redireccionarA("index.html");
                    }
                } else {
                    alert("Error: Correo o contraseña incorrectos.");
                }
            }
        });
    }

    // Formulario Registro Cliente
    const formRegistro = document.getElementById("form-registro");
    if (formRegistro) {
        formRegistro.addEventListener("submit", (e) => {
            e.preventDefault();

            // REF-05: Validación del formulario de registro declarativa
            const valido = validarFormulario(registroConfig);

            if (valido) {
                const run = document.getElementById("reg-run").value.trim().toUpperCase();
                const correo = document.getElementById("reg-correo").value.trim();
                const usuarios = DB.get("usuarios");

                if (usuarios.some(u => u.run === run || u.correo === correo)) {
                    alert("Error: El RUN o el Correo ya se encuentran registrados.");
                    return;
                }

                const nuevoUsuario = {
                    run: run,
                    nombre: document.getElementById("reg-nombre").value.trim(),
                    apellidos: document.getElementById("reg-apellidos").value.trim(),
                    correo: correo,
                    contrasena: document.getElementById("reg-contrasena").value,
                    tipo: "Cliente",
                    region: document.getElementById("reg-region").value,
                    comuna: document.getElementById("reg-comuna").value,
                    direccion: document.getElementById("reg-direccion").value.trim()
                };

                DB.insert("usuarios", nuevoUsuario);
                alert("¡Registro Exitoso! Inicia sesión.");
                formRegistro.reset();
                if (document.getElementById("reg-comuna")) {
                    document.getElementById("reg-comuna").innerHTML = '<option value="">Seleccione Comuna</option>';
                }
                // Limpiar clases de validación después del reset
                formRegistro.querySelectorAll(".is-invalid, .is-valid").forEach(el => el.classList.remove("is-invalid", "is-valid"));
            }
        });
    }

    // Cambio de pestañas (Tabs) con persistencia de milisegundos para limpiar datos y errores
    const loginTab = document.getElementById("login-tab");
    const registerTab = document.getElementById("register-tab");

    const limpiarFormulariosConPersistencia = () => {
        setTimeout(() => {
            if (formLogin) {
                formLogin.reset();
                formLogin.querySelectorAll(".is-invalid, .is-valid").forEach(el => el.classList.remove("is-invalid", "is-valid"));
            }
            if (formRegistro) {
                formRegistro.reset();
                formRegistro.querySelectorAll(".is-invalid, .is-valid").forEach(el => el.classList.remove("is-invalid", "is-valid"));
                const selectComuna = document.getElementById("reg-comuna");
                if (selectComuna) {
                    selectComuna.innerHTML = '<option value="">Seleccione Comuna</option>';
                }
            }
        }, 300); // 300ms de persistencia visual
    };

    if (loginTab) {
        loginTab.addEventListener("show.bs.tab", limpiarFormulariosConPersistencia);
    }
    if (registerTab) {
        registerTab.addEventListener("show.bs.tab", limpiarFormulariosConPersistencia);
    }
}

// ==========================================
// 2. INICIALIZAR VISTA ADMINISTRADOR
// ==========================================
let editandoProdId = null;
let editandoUsrRun = null;
let tempImagenBase64 = "";

function inicializarAdmin() {
    const rolActual = obtenerRolSimulado();

    if (rolActual === "Cliente") {
        document.getElementById("admin-authorized-view").style.display = "none";
        document.getElementById("admin-denied-view").style.display = "block";
        return;
    }

    document.getElementById("admin-authorized-view").style.display = "block";
    document.getElementById("admin-denied-view").style.display = "none";

    const tabUsuariosLink = document.getElementById("tab-usuarios-link");
    const btnAgregarProd = document.getElementById("btn-agregar-producto");

    if (rolActual === "Vendedor") {
        if (tabUsuariosLink) tabUsuariosLink.style.display = "none";
        if (btnAgregarProd) btnAgregarProd.style.display = "none";
        const tabProductos = new bootstrap.Tab(document.getElementById("tab-productos-link"));
        tabProductos.show();
    } else {
        if (tabUsuariosLink) tabUsuariosLink.style.display = "block";
        if (btnAgregarProd) btnAgregarProd.style.display = "block";
    }

    renderizarTablaProductos();
    renderizarTablaUsuarios();
    renderizarTablaOrdenes();

    // Sincronizar de forma manual el estado activo de los mantenedores y sus pestañas
    const allTabLinks = [
        document.getElementById("tab-productos-link"),
        document.getElementById("tab-ordenes-link"),
        document.getElementById("tab-clientes-link"),
        document.getElementById("tab-trabajadores-link")
    ];

    allTabLinks.forEach(link => {
        if (!link) return;
        link.addEventListener("click", function () {
            // Quitar clase active y aria-selected de todos los demás enlaces
            allTabLinks.forEach(otherLink => {
                if (otherLink && otherLink !== link) {
                    otherLink.classList.remove("active");
                    otherLink.setAttribute("aria-selected", "false");
                }
            });
            // Marcar el actual como activo
            link.classList.add("active");
            link.setAttribute("aria-selected", "true");

            // Quitar clase active y show de todas las demás pestañas de contenido
            const targetPaneId = link.getAttribute("data-bs-target");
            if (targetPaneId) {
                const targetPane = document.querySelector(targetPaneId);
                if (targetPane) {
                    allTabLinks.forEach(otherLink => {
                        if (otherLink && otherLink !== link) {
                            const otherPaneId = otherLink.getAttribute("data-bs-target");
                            if (otherPaneId) {
                                const otherPane = document.querySelector(otherPaneId);
                                if (otherPane) {
                                    otherPane.classList.remove("show", "active");
                                }
                            }
                        }
                    });
                    targetPane.classList.add("show", "active");
                }
            }
        });
    });

    // Guardado de Producto
    const formProducto = document.getElementById("form-admin-producto");
    if (formProducto) {
        const chkOferta = document.getElementById("prod-es-oferta");
        const containerPrecioAnterior = document.getElementById("container-precio-anterior");
        if (chkOferta && containerPrecioAnterior) {
            chkOferta.addEventListener("change", () => {
                containerPrecioAnterior.style.display = chkOferta.checked ? "block" : "none";
            });
        }

        const fileInput = document.getElementById("prod-foto-archivo");
        const urlInput = document.getElementById("prod-foto-url");
        const previewContainer = document.getElementById("prod-foto-preview-container");
        const previewImg = document.getElementById("prod-foto-preview");

        if (fileInput) {
            fileInput.addEventListener("change", function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(evt) {
                        const img = new Image();
                        img.onload = function() {
                            const canvas = document.createElement("canvas");
                            const max_width = 400;
                            let width = img.width;
                            let height = img.height;

                            if (width > max_width) {
                                height = Math.round((height * max_width) / width);
                                width = max_width;
                            }
                            canvas.width = width;
                            canvas.height = height;

                            const ctx = canvas.getContext("2d");
                            ctx.drawImage(img, 0, 0, width, height);
                            tempImagenBase64 = canvas.toDataURL("image/jpeg", 0.7);
                            
                            if (previewImg) {
                                previewImg.src = tempImagenBase64;
                                if (previewContainer) previewContainer.style.display = "block";
                            }
                        };
                        img.src = evt.target.result;
                    };
                    reader.readAsDataURL(file);
                } else {
                    tempImagenBase64 = "";
                    if (previewContainer) previewContainer.style.display = "none";
                }
            });
        }

        if (urlInput) {
            urlInput.addEventListener("input", function() {
                const url = this.value.trim();
                if (url) {
                    if (fileInput) fileInput.value = "";
                    tempImagenBase64 = "";
                    if (previewImg) {
                        previewImg.src = url;
                        if (previewContainer) previewContainer.style.display = "block";
                    }
                } else {
                    if (previewContainer) previewContainer.style.display = "none";
                }
            });
        }

        formProducto.addEventListener("submit", (e) => {
            e.preventDefault();

            // REF-05: Validación del formulario de productos declarativa
            const valido = validarFormulario({
                "prod-codigo": { required: true, minLength: 3 },
                "prod-nombre": { required: true, maxLength: 100 },
                "prod-descripcion": { maxLength: 500 },
                "prod-precio": { required: true, custom: val => {
                    const cleanVal = val.replace(/\./g, "").replace(/,/g, "").trim();
                    const p = parseFloat(cleanVal);
                    return !isNaN(p) && p >= 0 && /^\d+$/.test(cleanVal);
                }},
                "prod-stock": { required: true, custom: val => {
                    const s = parseInt(val);
                    return !isNaN(s) && s >= 0 && !val.includes(".");
                }},
                "prod-stock-critico": { custom: val => {
                    if (val.trim() === "") return true;
                    const sc = parseInt(val);
                    return !isNaN(sc) && sc >= 0 && !val.includes(".");
                }},
                "prod-categoria": { required: true },
                "prod-precio-anterior": { custom: val => {
                    const isChecked = document.getElementById("prod-es-oferta").checked;
                    if (!isChecked) return true;
                    const cleanVal = val.replace(/\./g, "").replace(/,/g, "").trim();
                    if (cleanVal === "") return false;
                    const pAnt = parseFloat(cleanVal);
                    
                    const precioRaw = document.getElementById("prod-precio").value.replace(/\./g, "").replace(/,/g, "").trim();
                    const pAct = parseFloat(precioRaw);
                    
                    return !isNaN(pAnt) && pAnt >= 0 && /^\d+$/.test(cleanVal) && (!isNaN(pAct) ? pAnt > pAct : true);
                }}
            });

            if (valido) {
                const codigoInput = document.getElementById("prod-codigo");
                const nombreInput = document.getElementById("prod-nombre");
                const descInput = document.getElementById("prod-descripcion");
                const precioInput = document.getElementById("prod-precio");
                const stockInput = document.getElementById("prod-stock");
                const stockCriticoInput = document.getElementById("prod-stock-critico");
                const categoriaInput = document.getElementById("prod-categoria");
                const esOfertaCheckbox = document.getElementById("prod-es-oferta");
                const precioAnteriorInput = document.getElementById("prod-precio-anterior");

                const productos = DB.get("productos");
                const nuevoCodigo = codigoInput.value.trim().toUpperCase();
                
                if (!editandoProdId) {
                    if (productos.some(p => p.id.toUpperCase() === nuevoCodigo)) {
                        alert("Error: Código duplicado.");
                        codigoInput.classList.add("is-invalid");
                        return;
                    }
                } else {
                    if (nuevoCodigo !== editandoProdId.toUpperCase() && productos.some(p => p.id.toUpperCase() === nuevoCodigo)) {
                        alert("Error: El nuevo código ya está en uso por otro producto.");
                        codigoInput.classList.add("is-invalid");
                        return;
                    }
                }

                let finalImagen = "";
                if (tempImagenBase64) {
                    finalImagen = tempImagenBase64;
                } else if (urlInput && urlInput.value.trim()) {
                    finalImagen = urlInput.value.trim();
                } else if (editandoProdId) {
                    const oldProd = productos.find(p => p.id === editandoProdId);
                    finalImagen = oldProd ? oldProd.imagen : "";
                }

                const prodData = {
                    id: nuevoCodigo,
                    nombre: nombreInput.value.trim(),
                    categoria: categoriaInput.value,
                    precio: parseFloat(precioInput.value.replace(/\./g, "").replace(/,/g, "").trim()),
                    stock: parseInt(stockInput.value),
                    stockCritico: parseInt(stockCriticoInput.value) || 0,
                    descripcion: descInput.value.trim() || "Sin descripción.",
                    origen: editandoProdId ? ((productos.find(p => p.id === editandoProdId) || {}).origen || "Nacional") : "Nacional",
                    imagen: finalImagen,
                    esOferta: esOfertaCheckbox.checked,
                    precioAnterior: esOfertaCheckbox.checked ? parseFloat(precioAnteriorInput.value.replace(/\./g, "").replace(/,/g, "").trim()) : null
                };

                // REF-12: Operaciones CRUD del Administrador (Guardar producto)
                if (editandoProdId) {
                    DB.update("productos", editandoProdId, prodData);
                } else {
                    DB.insert("productos", prodData);
                }

                try {
                    const modalEl = document.getElementById("modalProductoAdmin");
                    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                } catch (modalError) {
                    console.error("Error al cerrar el modal:", modalError);
                }

                renderizarTablaProductos();
                alert("Guardado exitoso.");
            }
        });
    }

    // Guardado de Usuario
    const formUsuario = document.getElementById("form-admin-usuario");
    if (formUsuario) {
        if (typeof configurarRegionComuna === "function") {
            configurarRegionComuna("usr-region", "usr-comuna");
        }

        formUsuario.addEventListener("submit", (e) => {
            e.preventDefault();

            // REF-05: Validación del formulario de usuarios declarativa
            const valido = validarFormulario({
                "usr-run": { required: !editandoUsrRun, custom: val => {
                    if (editandoUsrRun) return true;
                    return typeof validarRUT === "function" && validarRUT(val);
                }},
                "usr-nombre": { required: true, maxLength: 50 },
                "usr-apellidos": { required: true, maxLength: 100 },
                "usr-correo": { 
                    required: true, 
                    maxLength: 100, 
                    pattern: /^[a-zA-Z0-9._%+-]+@(?:inacap\.cl|profesor\.inacap\.cl|gmail\.com)$/ 
                },
                "usr-region": { required: true },
                "usr-comuna": { required: true },
                "usr-direccion": { required: true, maxLength: 300 },
                "usr-tipo": { required: true },
                "usr-contrasena": { required: true, minLength: 4, maxLength: 10 }
            });

            if (valido) {
                const runInput = document.getElementById("usr-run");
                const nombreInput = document.getElementById("usr-nombre");
                const apellidosInput = document.getElementById("usr-apellidos");
                const correoInput = document.getElementById("usr-correo");
                const regionInput = document.getElementById("usr-region");
                const comunaInput = document.getElementById("usr-comuna");
                const direccionInput = document.getElementById("usr-direccion");
                const tipoInput = document.getElementById("usr-tipo");
                const contrasenaInput = document.getElementById("usr-contrasena");

                const usuarios = DB.get("usuarios");
                const targetRun = editandoUsrRun ? editandoUsrRun : runInput.value.trim().toUpperCase();
                
                if (!editandoUsrRun) {
                    if (usuarios.some(u => u.run.toUpperCase() === targetRun || u.correo === correoInput.value.trim())) {
                        alert("Error: RUN o Correo duplicado.");
                        return;
                    }
                }

                const usrData = {
                    run: targetRun,
                    nombre: nombreInput.value.trim(),
                    apellidos: apellidosInput.value.trim(),
                    correo: correoInput.value.trim(),
                    contrasena: contrasenaInput.value,
                    tipo: tipoInput.value,
                    region: regionInput.value,
                    comuna: comunaInput.value,
                    direccion: direccionInput.value.trim()
                };

                // REF-12: Operaciones CRUD del Administrador (Guardar usuario)
                if (editandoUsrRun) {
                    DB.update("usuarios", editandoUsrRun, usrData, "run");
                } else {
                    DB.insert("usuarios", usrData);
                }

                try {
                    const modalEl = document.getElementById("modalUsuarioAdmin");
                    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                } catch (modalError) {
                    console.error("Error al cerrar el modal de usuario:", modalError);
                }

                renderizarTablaUsuarios();
                alert("Guardado exitoso.");
            }
        });
    }
}

// ==========================================
// 3. TABLAS DE MANTENEDORES
// ==========================================
function renderizarTablaProductos() {
    const listado = document.getElementById("admin-tabla-productos");
    if (!listado) return;

    const productos = DB.get("productos");
    const rolActual = obtenerRolSimulado();
    listado.innerHTML = "";

    productos.forEach(p => {
        const esCritico = p.stock <= p.stockCritico;
        const tr = document.createElement("tr");
        if (esCritico) tr.className = "table-warning";

        let accionesHtml = `<button class="btn btn-xs btn-outline-info py-0 px-2" onclick="abrirVerProducto('${p.id}')">Ver</button>`;
        if (rolActual === "Administrador") {
            accionesHtml += `
                <button class="btn btn-xs btn-outline-primary py-0 px-2 ms-1" onclick="abrirEditarProducto('${p.id}')">Editar</button>
                <button class="btn btn-xs btn-outline-danger py-0 px-2 ms-1" onclick="eliminarProductoAdmin('${p.id}')">Eliminar</button>
            `;
        }

        // REF-09: Componentización y plantilla para filas de administración (Productos)
        tr.innerHTML = crearFilaProductoHTML(p, esCritico, accionesHtml);
        listado.appendChild(tr);
    });
}

function crearFilaProductoHTML(p, esCritico, accionesHtml) {
    const precioHtml = p.esOferta && p.precioAnterior
        ? `<div>$${(p.precio || 0).toLocaleString("es-CL")}</div>
           <small class="text-warning fw-bold" style="font-size: 0.7rem;">🏷️ Oferta (Antes: $${p.precioAnterior.toLocaleString("es-CL")})</small>`
        : `$${(p.precio || 0).toLocaleString("es-CL")}`;

    return `
        <td><code>${p.id}</code></td>
        <td><b>${p.nombre}</b></td>
        <td><span class="badge bg-secondary">${p.categoria}</span></td>
        <td>${precioHtml}</td>
        <td>
            ${p.stock} 
            ${esCritico ? `<span class="badge bg-danger stock-critico-badge ms-1">⚠️ Crítico (Min: ${p.stockCritico})</span>` : ""}
        </td>
        <td>${accionesHtml}</td>
    `;
}

function renderizarTablaUsuarios() {
    const tablaClientes = document.getElementById("admin-tabla-clientes");
    const tablaTrabajadores = document.getElementById("admin-tabla-trabajadores");
    const usuarios = DB.get("usuarios");

    if (tablaClientes) {
        tablaClientes.innerHTML = "";
        const clientes = usuarios.filter(u => u.tipo === "Cliente");
        if (clientes.length === 0) {
            tablaClientes.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No hay clientes registrados.</td></tr>`;
        } else {
            clientes.forEach(u => {
                const tr = document.createElement("tr");
                // REF-09: Componentización y plantilla para filas de administración (Usuarios)
                tr.innerHTML = crearFilaUsuarioHTML(u);
                tablaClientes.appendChild(tr);
            });
        }
    }

    if (tablaTrabajadores) {
        tablaTrabajadores.innerHTML = "";
        const trabajadores = usuarios.filter(u => u.tipo === "Administrador" || u.tipo === "Vendedor");
        if (trabajadores.length === 0) {
            tablaTrabajadores.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No hay trabajadores registrados.</td></tr>`;
        } else {
            trabajadores.forEach(u => {
                const tr = document.createElement("tr");
                // REF-09: Componentización y plantilla para filas de administración (Usuarios)
                tr.innerHTML = crearFilaUsuarioHTML(u);
                tablaTrabajadores.appendChild(tr);
            });
        }
    }
}

function crearFilaUsuarioHTML(u) {
    return `
        <td><code>${u.run}</code></td>
        <td>${u.nombre} ${u.apellidos}</td>
        <td>${u.correo}</td>
        <td><span class="badge ${getRolColor(u.tipo)}">${u.tipo}</span></td>
        <td><small class="text-muted">${u.comuna}, ${u.region}</small></td>
        <td>
            <button class="btn btn-xs btn-outline-info py-0 px-2 me-1" onclick="abrirVerUsuario('${u.run}')">Ver</button>
            <button class="btn btn-xs btn-outline-primary py-0 px-2 me-1" onclick="abrirEditarUsuario('${u.run}')">Editar</button>
            <button class="btn btn-xs btn-outline-danger py-0 px-2" onclick="eliminarUsuarioAdmin('${u.run}')">Eliminar</button>
        </td>
    `;
}

function getRolColor(rol) {
    if (rol === "Administrador") return "bg-danger";
    if (rol === "Vendedor") return "bg-primary";
    return "bg-success";
}

// ==========================================
// 4. MÉTODOS CRUD INTERACTIVOS
// ==========================================
window.abrirCrearProducto = function() {
    editandoProdId = null;
    tempImagenBase64 = "";
    document.getElementById("modalProductoTitulo").textContent = "Nuevo Producto";
    
    const codeInput = document.getElementById("prod-codigo");
    codeInput.readOnly = false;
    codeInput.disabled = false;
    
    const form = document.getElementById("form-admin-producto");
    form.reset();

    const chkOferta = document.getElementById("prod-es-oferta");
    if (chkOferta) chkOferta.checked = false;
    const containerPrecioAnterior = document.getElementById("container-precio-anterior");
    if (containerPrecioAnterior) containerPrecioAnterior.style.display = "none";

    const previewContainer = document.getElementById("prod-foto-preview-container");
    if (previewContainer) previewContainer.style.display = "none";
    const previewImg = document.getElementById("prod-foto-preview");
    if (previewImg) previewImg.src = "";

    form.querySelectorAll("input, select, textarea").forEach(el => el.disabled = false);
    
    const tabs = document.querySelectorAll("#fotoTabs button");
    tabs.forEach(t => t.disabled = false);

    form.querySelector("button[type='submit']").style.display = "inline-block";
    document.querySelectorAll("#form-admin-producto .is-invalid").forEach(el => el.classList.remove("is-invalid"));
    bootstrap.Modal.getOrCreateInstance(document.getElementById("modalProductoAdmin")).show();
}

window.abrirEditarProducto = function(id) {
    editandoProdId = id;
    tempImagenBase64 = "";
    const productos = DB.get("productos");
    const p = productos.find(prod => prod.id === id);
    if (!p) return;

    document.getElementById("modalProductoTitulo").textContent = "Editar Producto";
    const codeInput = document.getElementById("prod-codigo");
    codeInput.value = p.id;
    codeInput.disabled = false;
    codeInput.readOnly = false;

    document.getElementById("prod-nombre").value = p.nombre || "";
    document.getElementById("prod-descripcion").value = p.descripcion || "";
    document.getElementById("prod-precio").value = (p.precio !== undefined && p.precio !== null) ? p.precio.toLocaleString("es-CL") : "";
    
    const chkOfertaEditar = document.getElementById("prod-es-oferta");
    const containerPrecioAnteriorEditar = document.getElementById("container-precio-anterior");
    const precioAnteriorInputEditar = document.getElementById("prod-precio-anterior");

    if (chkOfertaEditar) chkOfertaEditar.checked = !!p.esOferta;
    if (containerPrecioAnteriorEditar) containerPrecioAnteriorEditar.style.display = p.esOferta ? "block" : "none";
    if (precioAnteriorInputEditar) {
        precioAnteriorInputEditar.value = (p.esOferta && p.precioAnterior !== undefined && p.precioAnterior !== null) ? p.precioAnterior.toLocaleString("es-CL") : "";
    }

    document.getElementById("prod-stock").value = (p.stock !== undefined && p.stock !== null) ? p.stock : "";
    document.getElementById("prod-stock-critico").value = (p.stockCritico !== undefined && p.stockCritico !== null) ? p.stockCritico : "";
    document.getElementById("prod-categoria").value = p.categoria || "";

    const previewContainer = document.getElementById("prod-foto-preview-container");
    const previewImg = document.getElementById("prod-foto-preview");
    const urlInput = document.getElementById("prod-foto-url");
    const fileInput = document.getElementById("prod-foto-archivo");

    if (fileInput) fileInput.value = "";
    if (urlInput) urlInput.value = (p.imagen && !p.imagen.startsWith("data:")) ? p.imagen : "";

    if (p.imagen) {
        if (previewImg) previewImg.src = p.imagen.startsWith("data:") ? p.imagen : ajustarRutaRecurso(p.imagen);
        if (previewContainer) previewContainer.style.display = "block";
    } else {
        if (previewImg) previewImg.src = "";
        if (previewContainer) previewContainer.style.display = "none";
    }

    const form = document.getElementById("form-admin-producto");
    form.querySelectorAll("input, select, textarea").forEach(el => {
        if (el.id !== "prod-codigo") el.disabled = false;
    });

    const tabs = document.querySelectorAll("#fotoTabs button");
    tabs.forEach(t => t.disabled = false);

    form.querySelector("button[type='submit']").style.display = "inline-block";
    document.querySelectorAll("#form-admin-producto .is-invalid").forEach(el => el.classList.remove("is-invalid"));
    bootstrap.Modal.getOrCreateInstance(document.getElementById("modalProductoAdmin")).show();
}

window.abrirVerProducto = function(id) {
    abrirEditarProducto(id);
    document.getElementById("modalProductoTitulo").textContent = "Ver Producto (Solo Lectura)";
    const form = document.getElementById("form-admin-producto");
    form.querySelectorAll("input, select, textarea").forEach(el => el.disabled = true);
    
    const tabs = document.querySelectorAll("#fotoTabs button");
    tabs.forEach(t => t.disabled = true);
    const fileInput = document.getElementById("prod-foto-archivo");
    const urlInput = document.getElementById("prod-foto-url");
    if (fileInput) fileInput.disabled = true;
    if (urlInput) urlInput.disabled = true;

    form.querySelector("button[type='submit']").style.display = "none";
}

window.eliminarProductoAdmin = function(id) {
    if (confirm(`¿Eliminar producto ${id}?`)) {
        // REF-12: Operaciones CRUD del Administrador (Eliminar producto)
        DB.remove("productos", id);
        renderizarTablaProductos();
    }
}

window.abrirCrearUsuario = function() {
    editandoUsrRun = null;
    document.getElementById("modalUsuarioTitulo").textContent = "Nuevo Usuario";
    document.getElementById("usr-run").readOnly = false;
    const form = document.getElementById("form-admin-usuario");
    form.reset();
    form.querySelectorAll("input, select, textarea").forEach(el => el.disabled = false);
    form.querySelector("button[type='submit']").style.display = "inline-block";
    document.getElementById("usr-comuna").innerHTML = '<option value="">Seleccione Comuna</option>';
    document.querySelectorAll("#form-admin-usuario .is-invalid").forEach(el => el.classList.remove("is-invalid"));
    bootstrap.Modal.getOrCreateInstance(document.getElementById("modalUsuarioAdmin")).show();
}

window.abrirEditarUsuario = function(run, isVer = false) {
    const usuarios = DB.get("usuarios");
    const u = usuarios.find(usr => usr.run === run);
    if (!u) return;

    // REF-12: Operaciones CRUD del Administrador (Prompt de contraseña para Admin)
    if (!isVer && u.tipo === "Administrador") {
        const password = prompt("Por favor, ingrese la contraseña de este Administrador para confirmar la edición:");
        if (password === null) return;
        if (password !== u.contrasena) {
            alert("Error: Contraseña incorrecta. No se puede editar este administrador.");
            return;
        }
    }

    editandoUsrRun = run;

    document.getElementById("modalUsuarioTitulo").textContent = "Editar Usuario";
    const runInput = document.getElementById("usr-run");
    runInput.value = u.run;
    runInput.readOnly = true;

    document.getElementById("usr-nombre").value = u.nombre || "";
    document.getElementById("usr-apellidos").value = u.apellidos || "";
    document.getElementById("usr-correo").value = u.correo || "";
    document.getElementById("usr-tipo").value = u.tipo || "";
    document.getElementById("usr-direccion").value = u.direccion || "";
    document.getElementById("usr-contrasena").value = u.contrasena || "";

    if (typeof configurarRegionComuna === "function") {
        configurarRegionComuna("usr-region", "usr-comuna", u.region, u.comuna);
    }

    const form = document.getElementById("form-admin-usuario");
    form.querySelectorAll("input, select, textarea").forEach(el => {
        if (el.id !== "usr-run") el.disabled = false;
    });
    form.querySelector("button[type='submit']").style.display = "inline-block";

    document.querySelectorAll("#form-admin-usuario .is-invalid").forEach(el => el.classList.remove("is-invalid"));
    bootstrap.Modal.getOrCreateInstance(document.getElementById("modalUsuarioAdmin")).show();
}

window.abrirVerUsuario = function(run) {
    abrirEditarUsuario(run, true);
    document.getElementById("modalUsuarioTitulo").textContent = "Ver Usuario (Solo Lectura)";
    const form = document.getElementById("form-admin-usuario");
    form.querySelectorAll("input, select, textarea").forEach(el => el.disabled = true);
    form.querySelector("button[type='submit']").style.display = "none";
}

window.eliminarUsuarioAdmin = function(run) {
    const usuarioActivo = DB.get("usuario_sesion", null);
    if (usuarioActivo && usuarioActivo.run === run) {
        alert("Error: No puedes eliminarte a ti mismo.");
        return;
    }

    const usuarios = DB.get("usuarios");
    const u = usuarios.find(usr => usr.run === run);
    if (!u) return;

    // REF-12: Operaciones CRUD del Administrador (Prompt de contraseña para Admin)
    if (u.tipo === "Administrador") {
        const password = prompt("Por favor, ingrese la contraseña de este Administrador para confirmar la eliminación:");
        if (password === null) return;
        if (password !== u.contrasena) {
            alert("Error: Contraseña incorrecta. No se puede eliminar este administrador.");
            return;
        }
    }

    if (confirm(`¿Eliminar usuario ${run}?`)) {
        // REF-12: Operaciones CRUD del Administrador (Eliminar usuario)
        DB.remove("usuarios", run, "run");
        renderizarTablaUsuarios();
    }
}

window.renderizarTablaOrdenes = function() {
    const listado = document.getElementById("admin-tabla-ordenes");
    if (!listado) return;

    const ordenes = DB.get("ordenes");
    listado.innerHTML = "";

    if (ordenes.length === 0) {
        listado.innerHTML = `<tr><td colspan="6" class="text-center py-3 text-muted">No hay órdenes registradas.</td></tr>`;
        return;
    }

    ordenes.forEach(o => {
        const tr = document.createElement("tr");
        // REF-09: Componentización y plantilla para filas de administración (Órdenes)
        tr.innerHTML = crearFilaOrdenHTML(o);
        listado.appendChild(tr);
    });
}

function crearFilaOrdenHTML(o) {
    return `
        <td><code>${o.id}</code></td>
        <td><b>${o.cliente.nombre}</b></td>
        <td><small>${o.cliente.comuna}, ${o.cliente.region}</small></td>
        <td><small>${o.fecha}</small></td>
        <td class="text-success fw-bold">$${o.total.toLocaleString("es-CL")}</td>
        <td>
            <button class="btn btn-xs btn-outline-info py-0 px-2" onclick="abrirDetalleOrden('${o.id}')">Ver Detalle</button>
        </td>
    `;
}

window.abrirDetalleOrden = function(id) {
    const ordenes = DB.get("ordenes");
    const o = ordenes.find(ord => ord.id === id);
    if (!o) return;

    document.getElementById("ord-cli-nombre").textContent = o.cliente.nombre;
    document.getElementById("ord-cli-region").textContent = o.cliente.region;
    document.getElementById("ord-cli-comuna").textContent = o.cliente.comuna;
    document.getElementById("ord-cli-direccion").textContent = o.cliente.direccion;

    document.getElementById("ord-id").textContent = o.id;
    document.getElementById("ord-fecha").textContent = o.fecha;
    
    const totalMonto = (o.total !== undefined && !isNaN(o.total)) ? o.total : 0;
    document.getElementById("ord-total").textContent = `$${totalMonto.toLocaleString("es-CL")} CLP`;

    const tbody = document.getElementById("ord-productos-listado");
    tbody.innerHTML = "";

    const productos = DB.get("productos");

    o.items.forEach(item => {
        const prod = productos.find(p => p.id === item.id);
        const nombre = item.nombre || (prod ? prod.nombre : "Producto desconocido");
        const precio = item.precio !== undefined ? item.precio : (prod ? prod.precio : 0);
        const subtotal = precio * item.cantidad;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><code>${item.id}</code></td>
            <td>${nombre}</td>
            <td>$${precio.toLocaleString("es-CL")} CLP</td>
            <td>${item.cantidad}</td>
            <td class="fw-semibold">$${subtotal.toLocaleString("es-CL")} CLP</td>
        `;
        tbody.appendChild(tr);
    });

    bootstrap.Modal.getOrCreateInstance(document.getElementById("modalOrdenAdmin")).show();
}

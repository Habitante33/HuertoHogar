// CARRITO.JS - LÓGICA DE GESTIÓN DEL CARRITO Y PROCESAMIENTO DE DESPACHO

// ==========================================
// 1. INICIALIZADOR DE LA VISTA DEL CARRITO
// ==========================================
function inicializarCarrito() {
    renderizarCarrito();

    if (typeof configurarRegionComuna === "function") {
        configurarRegionComuna("cart-region", "cart-comuna");
    }

    const formDespacho = document.getElementById("form-despacho");
    if (formDespacho) {
        formDespacho.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const carrito = DB.get("carrito");
            if (carrito.length === 0) {
                alert("Tu carrito está vacío. Agrega productos antes de realizar el pago.");
                return;
            }

            // REF-07: Validación declarativa de envío en carrito
            const valido = validarFormulario({
                "cart-region": { required: true },
                "cart-comuna": { required: true },
                "cart-direccion": { required: true, maxLength: 300 }
            });

            if (valido) {
                const region = document.getElementById("cart-region");
                const comuna = document.getElementById("cart-comuna");
                const direccion = document.getElementById("cart-direccion");

                const usrSesion = DB.get("usuario_sesion", null);
                const nombreCliente = usrSesion ? (`${usrSesion.nombre} ${usrSesion.apellidos}`) : "Cliente Invitado";
                
                const productos = DB.get("productos");
                const orderItems = carrito.map(item => {
                    const prod = productos.find(p => p.id === item.id);
                    return {
                        id: item.id,
                        nombre: prod ? prod.nombre : "Producto desconocido",
                        precio: prod ? prod.precio : 0,
                        cantidad: item.cantidad
                    };
                });

                const total = orderItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
                const fechaActual = new Date();
                const fechaStr = fechaActual.toLocaleDateString("es-CL") + " " + fechaActual.toLocaleTimeString("es-CL", {hour: '2-digit', minute:'2-digit'});

                const nuevaOrden = {
                    id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
                    cliente: {
                        nombre: nombreCliente,
                        region: region.value,
                        comuna: comuna.value,
                        direccion: direccion.value.trim()
                    },
                    items: orderItems,
                    total: total,
                    fecha: fechaStr
                };

                // Descontar stock de los productos comprados
                carrito.forEach(item => {
                    const prod = productos.find(p => p.id === item.id);
                    if (prod) {
                        const nuevoStock = Math.max(0, prod.stock - item.cantidad);
                        DB.update("productos", prod.id, { stock: nuevoStock });
                    }
                });

                // Guardar la orden simulada
                DB.insert("ordenes", nuevaOrden);

                // Limpiar carrito
                DB.set("carrito", []);
                if (typeof actualizarBadgeCarritoComun === "function") {
                    actualizarBadgeCarritoComun();
                }

                bootstrap.Modal.getOrCreateInstance(document.getElementById("modalPagoExito")).show();
                formDespacho.reset();
            }
        });
    }
}

// ==========================================
// 2. RENDERIZADO DE TABLA EN CARRITO.HTML
// ==========================================
function renderizarCarrito() {
    const listado = document.getElementById("carrito-listado-items");
    const subtotalText = document.getElementById("cart-subtotal");
    const totalText = document.getElementById("cart-total");

    if (!listado) return;

    const carrito = DB.get("carrito");
    const productos = DB.get("productos");

    listado.innerHTML = "";

    if (carrito.length === 0) {
        listado.innerHTML = `<tr><td colspan="5" class="text-center py-4">No hay productos en tu carrito. <a href="productos.html" class="text-success fw-bold">Ir al catálogo</a></td></tr>`;
        if (subtotalText) subtotalText.textContent = "$0 CLP";
        if (totalText) totalText.textContent = "$0 CLP";
        return;
    }

    let subtotal = 0;

    carrito.forEach(item => {
        const prod = productos.find(p => p.id === item.id);
        if (!prod) return;

        const sub = prod.precio * item.cantidad;
        subtotal += sub;

        const tr = document.createElement("tr");
        tr.innerHTML = crearFilaCarritoHTML(item, prod, sub);
        listado.appendChild(tr);
    });

    if (subtotalText) subtotalText.textContent = `$${subtotal.toLocaleString("es-CL")} CLP`;
    if (totalText) totalText.textContent = `$${subtotal.toLocaleString("es-CL")} CLP`;
}

// REF-08: Constructor de filas HTML para la tabla del carrito (DRY)
function crearFilaCarritoHTML(item, prod, subtotal) {
    return `
        <td>
            <b>${prod.nombre}</b><br><small class="text-muted">Cód: ${prod.id}</small>
        </td>
        <td>$${prod.precio.toLocaleString("es-CL")} CLP</td>
        <td>
            <div class="input-group input-group-sm" style="width: 100px;">
                <button class="btn btn-outline-secondary" type="button" onclick="cambiarCantidadItem('${item.id}', -1)">-</button>
                <input type="text" class="form-control text-center bg-white" value="${item.cantidad}" readonly>
                <button class="btn btn-outline-secondary" type="button" onclick="cambiarCantidadItem('${item.id}', 1)">+</button>
            </div>
        </td>
        <td>$${subtotal.toLocaleString("es-CL")} CLP</td>
        <td>
            <button class="btn btn-sm btn-outline-danger" onclick="eliminarDelCarrito('${item.id}')">
                🗑️
            </button>
        </td>
    `;
}

// Reutilizar el emoji mapping centralizado
const getEmojiCategoria = window.getEmojiPorCategoria;

// ==========================================
// 3. OPERACIONES DEL CARRITO (GLOBALES)
// ==========================================
// REF-10: Gestión del estado del carrito
window.cambiarCantidadItem = function(id, cambio) {
    let carrito = DB.get("carrito");
    const item = carrito.find(i => i.id === id);
    const productos = DB.get("productos");
    const prod = productos.find(p => p.id === id);

    if (item && prod) {
        const nuevaCantidad = item.cantidad + cambio;
        if (nuevaCantidad > prod.stock) {
            alert(`Lo sentimos, no hay más stock disponible de este producto (Stock máximo: ${prod.stock} unidades).`);
            return;
        }
        if (nuevaCantidad <= 0) {
            eliminarDelCarrito(id);
            return;
        }
        item.cantidad = nuevaCantidad;
        DB.set("carrito", carrito);
        if (typeof actualizarBadgeCarritoComun === "function") {
            actualizarBadgeCarritoComun();
        }
        renderizarCarrito();
    }
}

window.eliminarDelCarrito = function(id) {
    let carrito = DB.get("carrito");
    carrito = carrito.filter(item => item.id !== id);
    DB.set("carrito", carrito);
    if (typeof actualizarBadgeCarritoComun === "function") {
        actualizarBadgeCarritoComun();
    }
    renderizarCarrito();
}

window.agregarAlCarrito = function(id, cantidad) {
    let carrito = DB.get("carrito");
    const productos = DB.get("productos");
    const prod = productos.find(p => p.id === id);

    if (!prod) return;

    const itemEnCarrito = carrito.find(i => i.id === id);
    const cantidadActual = itemEnCarrito ? itemEnCarrito.cantidad : 0;
    const cantidadSolicitada = cantidadActual + cantidad;

    if (cantidadSolicitada > prod.stock) {
        alert(`Lo sentimos, no hay suficiente stock disponible. (Stock disponible: ${prod.stock}, Solicitado: ${cantidadSolicitada}).`);
        return;
    }

    if (itemEnCarrito) {
        itemEnCarrito.cantidad = cantidadSolicitada;
    } else {
        carrito.push({ id: id, cantidad: cantidad });
    }

    DB.set("carrito", carrito);
    if (typeof actualizarBadgeCarritoComun === "function") {
        actualizarBadgeCarritoComun();
    }

    // Actualizar visualmente el stock en catálogo en tiempo real
    if (typeof renderizarProductosDestacados === "function") {
        renderizarProductosDestacados();
    }
    if (typeof renderizarCatalogo === "function") {
        const buscador = document.getElementById("buscador-producto");
        const cat = typeof catActiva !== "undefined" ? catActiva : "Todos";
        renderizarCatalogo(cat, buscador ? buscador.value : "");
    }

    // Actualizar visualmente el stock en la vista de detalle si existe el elemento
    const detStockEl = document.getElementById("det-stock");
    if (detStockEl) {
        const stockDisp = Math.max(0, prod.stock - cantidadSolicitada);
        detStockEl.textContent = `${stockDisp} unidades`;
        
        // Sincronizar alerta de stock crítico en detalle
        const alertaStock = document.getElementById("det-alerta-stock");
        if (alertaStock) {
            if (stockDisp <= prod.stockCritico) {
                alertaStock.innerHTML = `
                    <div class="alert alert-warning py-2 mb-3" role="alert" style="font-size: 0.85rem;">
                        ⚠️ <b>¡Advertencia de Stock Crítico!</b> Solo quedan ${stockDisp} unidades disponibles en inventario.
                    </div>
                `;
            } else {
                alertaStock.innerHTML = "";
            }
        }
    }

    alert(`¡Se agregaron ${cantidad} unidades de ${prod.nombre} al carrito!`);
}

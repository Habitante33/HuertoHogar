// DATOS SEMILLA - HUERTO HOGAR
// Este archivo actúa como nuestra base de datos local (localStorage)

// 1. Regiones y Comunas de Chile
const REGIONES_CHILE = [
    {
        id: "RM",
        nombre: "Región Metropolitana de Santiago",
        comunas: ["Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto", "Ñuñoa", "La Florida"]
    },
    {
        id: "VALPO",
        nombre: "Región de Valparaíso",
        comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio", "Quillota"]
    },
    {
        id: "ARAUCANIA",
        nombre: "Región de la Araucanía",
        comunas: ["Temuco", "Villarrica", "Pucón", "Angol", "Padre Las Casas"]
    },
    {
        id: "BIOBIO",
        nombre: "Región del Biobío",
        comunas: ["Concepción", "Talcahuano", "Chiguayante", "San Pedro de la Paz", "Nacimiento", "Chillán"]
    },
    {
        id: "LOS_LAGOS",
        nombre: "Región de Los Lagos",
        comunas: ["Puerto Montt", "Osorno", "Castro", "Puerto Varas", "Ancud"]
    }
];

// 2. Productos Iniciales (con rutas a las imágenes reales .jpeg aportadas)
const PRODUCTOS_INICIALES = [
    {
        id: "FR001",
        nombre: "Manzanas Fuji",
        precio: 1200,
        esOferta: true,
        precioAnterior: 1500,
        stock: 150,
        stockCritico: 20,
        categoria: "Frutas Frescas",
        origen: "Valle del Maule",
        descripcion: "Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas saludables o como ingrediente en postres. Estas manzanas son conocidas por su textura firme y su sabor equilibrado.",
        imagen: "src/assets/imagenes/FR001.jpeg"
    },
    {
        id: "FR002",
        nombre: "Naranjas Valencia",
        precio: 1000,
        stock: 200,
        stockCritico: 30,
        categoria: "Frutas Frescas",
        origen: "Valle del Cachapoal",
        descripcion: "Jugosas y ricas en vitamina C, estas naranjas Valencia son ideales para zumos frescos y refrescantes. Cultivadas en condiciones climáticas óptimas que aseguran su dulzura y jugosidad.",
        imagen: "src/assets/imagenes/FR002.jpeg"
    },
    {
        id: "FR003",
        nombre: "Plátanos Cavendish",
        precio: 800,
        stock: 250,
        stockCritico: 15,
        categoria: "Frutas Frescas",
        origen: "Valle de Quillota",
        descripcion: "Plátanos maduros y dulces, perfectos para el desayuno o como snack energético. Estos plátanos son ricos en potasio y vitaminas, ideales para mantener una dieta equilibrada.",
        imagen: "src/assets/imagenes/FR003.jpeg"
    },
    {
        id: "VR001",
        nombre: "Zanahorias Orgánicas",
        precio: 900,
        stock: 100,
        stockCritico: 15,
        categoria: "Verduras Orgánicas",
        origen: "Región de O'Higgins",
        descripcion: "Zanahorias crujientes cultivadas sin pesticidas en la Región de O'Higgins. Excelente fuente de vitamina A y fibra, ideales para ensaladas, jugos o como snack saludable.",
        imagen: "src/assets/imagenes/VR001.jpeg"
    },
    {
        id: "VR002",
        nombre: "Espinacas Frescas",
        precio: 700,
        stock: 80,
        stockCritico: 10,
        categoria: "Verduras Orgánicas",
        origen: "Valle de Casablanca",
        descripcion: "Espinacas frescas y nutritivas, perfectas para ensaladas y batidos verdes. Estas espinacas son cultivadas bajo prácticas orgánicas que garantizan su calidad y valor nutricional.",
        imagen: "src/assets/imagenes/VR002.jpeg"
    },
    {
        id: "VR003",
        nombre: "Pimientos Tricolores",
        precio: 1500,
        stock: 120,
        stockCritico: 25,
        categoria: "Verduras Orgánicas",
        origen: "Limache",
        descripcion: "Pimientos rojos, amarillos y verdes, ideales para salteados y platos coloridos. Ricos en antioxidantes y vitaminas, estos pimientos añaden un toque vibrante y saludable a cualquier receta.",
        imagen: "src/assets/imagenes/VR003.jpeg"
    },
    {
        id: "PO001",
        nombre: "Miel Orgánica",
        precio: 5000,
        esOferta: true,
        precioAnterior: 6500,
        stock: 50,
        stockCritico: 5,
        categoria: "Productos Orgánicos",
        origen: "Puerto Varas",
        descripcion: "Miel pura y orgánica producida por apicultores locales. Rica en antioxidantes y con un sabor inigualable, perfecta para endulzar de manera natural tus comidas y bebidas.",
        imagen: "src/assets/imagenes/PO001.jpeg"
    },
    {
        id: "PO003",
        nombre: "Quinua Orgánica",
        precio: 3500,
        stock: 60,
        stockCritico: 8,
        categoria: "Productos Orgánicos",
        origen: "Secano Costero de O'Higgins",
        descripcion: "Quinua orgánica de grano entero, un superalimento rico en proteínas, fibra y minerales. Ideal como base para ensaladas, acompañamientos o hamburguesas vegetarianas.",
        imagen: "src/assets/imagenes/PO003.png"
    },
    {
        id: "PL001",
        nombre: "Leche Entera",
        precio: 1100,
        stock: 180,
        stockCritico: 20,
        categoria: "Productos Lácteos",
        origen: "Osorno",
        descripcion: "Leche entera fresca pasteurizada, proveniente de vacas alimentadas libremente en praderas de Osorno. Conserva todo su sabor natural y nutrientes esenciales.",
        imagen: "src/assets/imagenes/PL001.png"
    }
];

// 3. Usuarios Iniciales (con RUNs chilenos válidos para pruebas)
const USUARIOS_INICIALES = [
    {
        run: "19011022K",
        nombre: "Jorge Antonio",
        apellidos: "Silva Guzmán",
        correo: "admin@inacap.cl",
        contrasena: "1234",
        tipo: "Administrador",
        region: "Región Metropolitana de Santiago",
        comuna: "Santiago",
        direccion: "Av. Vitacura 2500"
    },
    {
        run: "123456785",
        nombre: "Carlos",
        apellidos: "Pérez Soto",
        correo: "vendedor@inacap.cl",
        contrasena: "1234",
        tipo: "Vendedor",
        region: "Región de Valparaíso",
        comuna: "Viña del Mar",
        direccion: "Álvarez 450"
    },
    {
        run: "155555556",
        nombre: "Ana",
        apellidos: "Gómez Ruiz",
        correo: "cliente@gmail.com",
        contrasena: "1234",
        tipo: "Cliente",
        region: "Región del Biobío",
        comuna: "Nacimiento",
        direccion: "O'Higgins 321"
    }
];



// 4. Órdenes Iniciales Semilla para Simular Listados
const ORDENES_INICIALES = [
    {
        id: "ORD-8742",
        cliente: {
            nombre: "Ana Gómez Ruiz",
            region: "Región del Biobío",
            comuna: "Nacimiento",
            direccion: "O'Higgins 321"
        },
        items: [
            { id: "FR001", nombre: "Manzanas Fuji", precio: 1200, cantidad: 3 },
            { id: "VR001", nombre: "Zanahorias Orgánicas", precio: 900, cantidad: 2 }
        ],
        total: 5400,
        fecha: "13/06/2026 14:30"
    },
    {
        id: "ORD-1290",
        cliente: {
            nombre: "Juan Pérez",
            region: "Región Metropolitana de Santiago",
            comuna: "Providencia",
            direccion: "Av. Providencia 1245"
        },
        items: [
            { id: "PO001", nombre: "Miel Orgánica", precio: 5000, cantidad: 1 },
            { id: "PL001", nombre: "Leche Entera", precio: 1100, cantidad: 4 }
        ],
        total: 9400,
        fecha: "13/06/2026 16:15"
    }
];

// Control de versiones de base de datos local (evita esquemas antiguos corruptos)
const DB_VERSION_HH = "2.4";
const versionGuardada = localStorage.getItem("db_version");

if (versionGuardada !== DB_VERSION_HH) {
    // Guardar carrito antes del reset para no perder los productos del usuario
    const carritoRespaldo = localStorage.getItem("carrito");
    const sesionRespaldo  = localStorage.getItem("usuario_sesion");
    const rolRespaldo     = localStorage.getItem("rol_simulado");

    localStorage.removeItem("productos");
    localStorage.removeItem("usuarios");
    localStorage.removeItem("regiones");
    localStorage.removeItem("ordenes");
    localStorage.setItem("db_version", DB_VERSION_HH);

    // Restaurar datos que no deben perderse en la migración
    if (carritoRespaldo) localStorage.setItem("carrito", carritoRespaldo);
    if (sesionRespaldo)  localStorage.setItem("usuario_sesion", sesionRespaldo);
    if (rolRespaldo)     localStorage.setItem("rol_simulado", rolRespaldo);
}

// Inicialización de LocalStorage si no existen los datos
if (!localStorage.getItem("productos")) {
    localStorage.setItem("productos", JSON.stringify(PRODUCTOS_INICIALES));
}
if (!localStorage.getItem("usuarios")) {
    localStorage.setItem("usuarios", JSON.stringify(USUARIOS_INICIALES));
}
if (!localStorage.getItem("regiones")) {
    localStorage.setItem("regiones", JSON.stringify(REGIONES_CHILE));
}
if (!localStorage.getItem("carrito")) {
    localStorage.setItem("carrito", JSON.stringify([]));
}
if (!localStorage.getItem("usuario_sesion")) {
    localStorage.setItem("usuario_sesion", JSON.stringify(null));
}
if (!localStorage.getItem("rol_simulado")) {
    localStorage.setItem("rol_simulado", "Cliente");
}
if (!localStorage.getItem("ordenes")) {
    localStorage.setItem("ordenes", JSON.stringify(ORDENES_INICIALES));
}

// REF-01: Capa de acceso a datos unificada (DB Wrapper)
window.DB = {
    get: (key, defaultVal) => {
        if (defaultVal === undefined) defaultVal = [];
        try {
            const raw = localStorage.getItem(key);
            if (raw === null || raw === undefined) return defaultVal;
            const parsed = JSON.parse(raw);
            return (parsed !== null && parsed !== undefined) ? parsed : defaultVal;
        } catch (e) {
            console.error("Error reading localStorage key: " + key, e);
            return defaultVal;
        }
    },
    set: (key, val) => {
        try {
            localStorage.setItem(key, JSON.stringify(val));
        } catch (e) {
            console.error("Error writing localStorage key: " + key, e);
            alert("Error: Memoria local llena o no disponible.");
        }
    },
    insert: (key, item) => {
        const items = window.DB.get(key);
        items.push(item);
        window.DB.set(key, items);
    },
    update: (key, id, updatedData, idField = "id") => {
        const items = window.DB.get(key);
        const idx = items.findIndex(item => item[idField] === id);
        if (idx !== -1) {
            items[idx] = { ...items[idx], ...updatedData };
            window.DB.set(key, items);
        }
    },
    remove: (key, id, idField = "id") => {
        const items = window.DB.get(key);
        const filtered = items.filter(item => item[idField] !== id);
        window.DB.set(key, filtered);
    }
};

// REF-02: Mapeo centralizado de emojis para categorías de productos
window.getEmojiPorCategoria = function(cat) {
    const emojis = {
        "Frutas Frescas": "🍎",
        "Verduras Orgánicas": "🥬",
        "Productos Orgánicos": "🍯",
        "Productos Lácteos": "🥛"
    };
    return emojis[cat] || "📦";
};

// REF-02b: Obtener rol simulado limpiando cualquier residuo de formato de comillas JSON
window.obtenerRolSimulado = function() {
    let rol = localStorage.getItem("rol_simulado") || "Cliente";
    if (rol && rol.startsWith('"') && rol.endsWith('"')) {
        try {
            rol = JSON.parse(rol);
        } catch (e) {
            rol = rol.replace(/^"|"$/g, '');
        }
    }
    return rol;
};

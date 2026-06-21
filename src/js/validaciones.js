// VALIDACIONES.JS - ALGORITMOS DE VALIDACIÓN Y SELECTORES DINÁMICOS

// 1. Algoritmo de validación de RUN/RUT Chileno (Modulo 11) sin puntos ni guiones
function validarRUT(rut) {
    // Quitar espacios y convertir a mayúsculas
    rut = rut.replace(/\s+/g, '').toUpperCase();
    // Validar formato básico sin puntos ni guion: de 7 a 8 números seguidos de un dígito o K
    if (!/^[0-9]{7,8}[0-9K]$/.test(rut)) return false;
    
    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1);
    
    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i)) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }
    
    const resto = suma % 11;
    const dvEsperado = 11 - resto;
    let dvCalculado;
    if (dvEsperado === 11) dvCalculado = '0';
    else if (dvEsperado === 10) dvCalculado = 'K';
    else dvCalculado = dvEsperado.toString();
    
    return dv === dvCalculado;
}

// 2. Configuración de Selectores Dependientes de Región y Comuna (Con limpieza de comunas)
function configurarRegionComuna(regionId, comunaId, regionPreseleccionada = '', comunaPreseleccionada = '') {
    const selectRegion = document.getElementById(regionId);
    const selectComuna = document.getElementById(comunaId);
    if (!selectRegion || !selectComuna) return;

    // Inicializar vacíos
    selectRegion.innerHTML = '<option value="">Seleccione Región</option>';
    selectComuna.innerHTML = '<option value="">Seleccione Comuna</option>';

    const regiones = JSON.parse(localStorage.getItem("regiones")) || [];
    regiones.forEach(r => {
        const opt = document.createElement("option");
        opt.value = r.nombre;
        opt.textContent = r.nombre;
        if (r.nombre === regionPreseleccionada) opt.selected = true;
        selectRegion.appendChild(opt);
    });

    // Cargar comunas iniciales si hay preselección
    if (regionPreseleccionada) {
        const regionObj = regiones.find(r => r.nombre === regionPreseleccionada);
        if (regionObj) {
            regionObj.comunas.forEach(c => {
                const opt = document.createElement("option");
                opt.value = c;
                opt.textContent = c;
                if (c === comunaPreseleccionada) opt.selected = true;
                selectComuna.appendChild(opt);
            });
        }
    }

    // Evento de cambio (limpia y recarga)
    selectRegion.addEventListener("change", function() {
        const regionSeleccionada = this.value;
        
        // LIMPIEZA INMEDIATA de comunas al cambiar la región
        selectComuna.innerHTML = '<option value="">Seleccione Comuna</option>';
        selectComuna.classList.remove("is-invalid"); // Quitar clase inválido al resetear comunas
        
        if (!regionSeleccionada) return;

        const regionObj = regiones.find(r => r.nombre === regionSeleccionada);
        if (regionObj) {
            regionObj.comunas.forEach(c => {
                const opt = document.createElement("option");
                opt.value = c;
                opt.textContent = c;
                selectComuna.appendChild(opt);
            });
        }
    });
}

// Helper para validar un campo individual según sus reglas
function validarCampo(el, rules) {
    let elValido = true;
    const val = el.value.trim();
    
    if (rules.required && !val) {
        elValido = false;
    }
    if (rules.maxLength && val.length > rules.maxLength) {
        elValido = false;
    }
    if (rules.minLength && val.length < rules.minLength) {
        elValido = false;
    }
    if (rules.pattern && !rules.pattern.test(val)) {
        elValido = false;
    }
    if (rules.custom && !rules.custom(val)) {
        elValido = false;
    }
    return elValido;
}

// REF-03: Motor de validaciones central y declarativo con auto-limpieza al cambiar/digitar
window.validarFormulario = function(config, bindOnly = false) {
    let valido = true;
    for (const [id, rules] of Object.entries(config)) {
        const el = document.getElementById(id);
        if (!el) continue;
        
        // Registrar listener de auto-limpieza una sola vez para quitar el estado inválido al corregir el campo
        if (!el.dataset.validationBound) {
            el.dataset.validationBound = "true";
            const checkAndClear = () => {
                if (validarCampo(el, rules)) {
                    el.classList.remove("is-invalid");
                }
            };
            el.addEventListener("input", checkAndClear);
            el.addEventListener("change", checkAndClear);
        }
        
        if (!bindOnly) {
            if (validarCampo(el, rules)) {
                el.classList.remove("is-invalid");
            } else {
                el.classList.add("is-invalid");
                valido = false;
            }
        }
    }
    return valido;
};

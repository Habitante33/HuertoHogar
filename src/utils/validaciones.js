// VALIDACIONES - UTILS

// 1. Algoritmo de validación de RUN/RUT Chileno (Modulo 11) sin puntos ni guiones
export function validarRUT(rut) {
    if (!rut) return false;
    // Quitar espacios y convertir a mayúsculas
    rut = rut.replace(/\s+/g, '').toUpperCase();
    // Validar formato básico sin puntos ni guion: de 6 a 8 números seguidos de un dígito o K (total 7 a 9 caracteres)
    if (!/^[0-9]{6,8}[0-9K]$/.test(rut)) return false;
    
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

// 2. Validador individual de campo
export function validarCampo(valor, reglas) {
    const val = (valor || "").toString().trim();
    
    if (reglas.required && !val) {
        return false;
    }
    if (reglas.maxLength && val.length > reglas.maxLength) {
        return false;
    }
    if (reglas.minLength && val.length < reglas.minLength) {
        return false;
    }
    if (reglas.pattern && !reglas.pattern.test(val)) {
        return false;
    }
    if (reglas.custom && !reglas.custom(val)) {
        return false;
    }
    return true;
}

// 3. Motor de validación declarativo adaptado para React
// Recibe un objeto de valores { [key]: valor } y una configuración de reglas
// Retorna un objeto con los errores { [key]: boolean } (true si es inválido)
export function validarFormulario(valores, config) {
    const errores = {};
    let esValido = true;
    
    for (const [id, reglas] of Object.entries(config)) {
        const valor = valores[id];
        const campoValido = validarCampo(valor, reglas);
        if (!campoValido) {
            errores[id] = true;
            esValido = false;
        } else {
            errores[id] = false;
        }
    }
    
    return { errores, esValido };
}

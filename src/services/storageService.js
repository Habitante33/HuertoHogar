const STORAGE_KEYS = {
    products: 'productos_hh',
    users: 'usuarios_hh',
    orders: 'ordenes_hh',
    categories: 'categorias_hh'
};

const readCollection = (key) => {
    try {
        const raw = localStorage.getItem(key);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error(`Error al leer ${key}:`, error);
        return [];
    }
};

const writeCollection = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error al guardar ${key}:`, error);
        return false;
    }
};

const getEntityKey = (item) => String(item?.id ?? item?.run ?? item?.codigo ?? item?.uuid ?? '');

const buildCrudStore = (key) => ({
    getAll: () => readCollection(key),
    getById: (id) => {
        const items = readCollection(key);
        return items.find((item) => String(getEntityKey(item)) === String(id)) || null;
    },
    create: (entity) => {
        const items = readCollection(key);
        const nextItems = [...items, entity];
        writeCollection(key, nextItems);
        return entity;
    },
    update: (id, updates) => {
        const items = readCollection(key);
        const index = items.findIndex((item) => String(getEntityKey(item)) === String(id));

        if (index === -1) {
            return null;
        }

        const updatedItem = { ...items[index], ...updates };
        const nextItems = items.map((item) => String(getEntityKey(item)) === String(id) ? updatedItem : item);
        writeCollection(key, nextItems);
        return updatedItem;
    },
    delete: (id) => {
        const items = readCollection(key);
        const nextItems = items.filter((item) => String(getEntityKey(item)) !== String(id));
        const changed = nextItems.length !== items.length;
        if (changed) {
            writeCollection(key, nextItems);
        }
        return changed;
    }
});

const buildCategoryStore = () => ({
    getAll: () => readCollection(STORAGE_KEYS.categories),
    getById: (value) => {
        const categories = readCollection(STORAGE_KEYS.categories);
        return categories.find((item) => String(item) === String(value)) || null;
    },
    create: (value) => {
        const categories = readCollection(STORAGE_KEYS.categories);
        if (categories.includes(value)) {
            return null;
        }
        const next = [...categories, value];
        writeCollection(STORAGE_KEYS.categories, next);
        return value;
    },
    update: (oldValue, newValue) => {
        const categories = readCollection(STORAGE_KEYS.categories);
        const exists = categories.some((item) => String(item) === String(newValue));
        if (exists && String(oldValue) !== String(newValue)) {
            return null;
        }
        const next = categories.map((item) => String(item) === String(oldValue) ? newValue : item);
        writeCollection(STORAGE_KEYS.categories, next);
        return newValue;
    },
    delete: (value) => {
        const categories = readCollection(STORAGE_KEYS.categories);
        const next = categories.filter((item) => String(item) !== String(value));
        const changed = next.length !== categories.length;
        if (changed) {
            writeCollection(STORAGE_KEYS.categories, next);
        }
        return changed;
    }
});

const storageService = {
    products: buildCrudStore(STORAGE_KEYS.products),
    users: buildCrudStore(STORAGE_KEYS.users),
    orders: buildCrudStore(STORAGE_KEYS.orders),
    categories: buildCategoryStore()
};

export default storageService;

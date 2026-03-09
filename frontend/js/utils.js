/* ========================================
   UTILS.JS - Funções Utilitárias Globais
   ======================================== */

/**
 * Funções auxiliares reutilizáveis em toda a aplicação
 */

// Salvare recuperar dados do LocalStorage
const Storage = {
    save: (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Erro ao salvar no localStorage:', e);
            return false;
        }
    },
    
    get: (key, defaultValue = null) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('Erro ao recuperar do localStorage:', e);
            return defaultValue;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Erro ao remover do localStorage:', e);
            return false;
        }
    },
    
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Erro ao limpar localStorage:', e);
            return false;
        }
    }
};

// Formatação de datas
const DateFormatter = {
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    },
    
    formatTime: (date) => {
        return new Date(date).toLocaleTimeString('pt-BR');
    },
    
    formatDateTime: (date) => {
        const d = new Date(date);
        return `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR')}`;
    },
    
    getDaysAgo: (date) => {
        const now = new Date();
        const past = new Date(date);
        const diffTime = Math.abs(now - past);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }
};

// Validação
const Validator = {
    isEmail: (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    isNumber: (value) => {
        return !isNaN(value) && value !== '';
    },
    
    isEmpty: (value) => {
        return value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0);
    },
    
    minLength: (value, length) => {
        return value && value.length >= length;
    },
    
    maxLength: (value, length) => {
        return value && value.length <= length;
    }
};

// Notificações/Alertas
const Notification = {
    show: (message, type = 'info', duration = 3000) => {
        const id = 'notification-' + Date.now();
        const alertDiv = document.createElement('div');
        alertDiv.id = id;
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.remove();
        }, duration);
    },
    
    success: (message, duration = 3000) => {
        Notification.show(message, 'success', duration);
    },
    
    error: (message, duration = 3000) => {
        Notification.show(message, 'danger', duration);
    },
    
    info: (message, duration = 3000) => {
        Notification.show(message, 'info', duration);
    },
    
    warning: (message, duration = 3000) => {
        Notification.show(message, 'warning', duration);
    }
};

// Helper de URL
const URLHelper = {
    getQueryParam: (param) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },
    
    getAllQueryParams: () => {
        const urlParams = new URLSearchParams(window.location.search);
        const params = {};
        for (const [key, value] of urlParams) {
            params[key] = value;
        }
        return params;
    }
};

// Utilitários gerais
const Utils = {
    generateId: () => {
        return 'id-' + Math.random().toString(36).substr(2, 9);
    },
    
    sleep: (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    cloneObject: (obj) => {
        return JSON.parse(JSON.stringify(obj));
    },
    
    mergeObjects: (obj1, obj2) => {
        return { ...obj1, ...obj2 };
    }
};

// Log com styleAvançado (útil para debug)
const Logger = {
    log: (message, data = null) => {
        console.log('%c[INFO]%c ' + message, 'color: #2196F3; font-weight: bold;', 'color: auto;', data);
    },
    
    success: (message, data = null) => {
        console.log('%c[SUCCESS]%c ' + message, 'color: #4CAF50; font-weight: bold;', 'color: auto;', data);
    },
    
    warning: (message, data = null) => {
        console.warn('%c[WARNING]%c ' + message, 'color: #FF9800; font-weight: bold;', 'color: auto;', data);
    },
    
    error: (message, data = null) => {
        console.error('%c[ERROR]%c ' + message, 'color: #F44336; font-weight: bold;', 'color: auto;', data);
    }
};

/* ========================================
   APP.JS - Inicialização Principal
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    progressManager.loadProgress();
    updateUserDisplay();
}

function updateUserDisplay() {
    const userElements = document.querySelectorAll('#userName, #userNameDisplay');
    userElements.forEach(el => {
        el.textContent = progressManager.getUserName();
    });
}

function changeUserName() {
    const newName = prompt('Qual é o seu nome?');
    if (newName && newName.trim()) {
        progressManager.setUserName(newName.trim());
        updateUserDisplay();
    }
}

function exportUserData() {
    progressManager.exportProgress();
}

function importUserData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            progressManager.importProgress(file);
        }
    };
    input.click();
}

function clearAllData() {
    if (confirm('Tem certeza? Isso apagará todo o seu progresso!')) {
        progressManager.resetProgress();
        updateUserDisplay();
        setTimeout(() => location.reload(), 1000);
    }
}

function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

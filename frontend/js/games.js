/**
 * GAMES.JS - Scripts para a página de jogos
 * Manipula o carregamento de jogos, iframe, e interações
 */

// Configuração dos jogos
const games = {
    'logica': {
        url: 'https://jogo-de-logica-liart.vercel.app/',
        title: 'Jogo de Lógica'
    },
    'algoritmo': {
        url: 'https://example.com/jogo-algoritmo',
        title: 'Jogo de Algoritmo'
    },
    'estrutura': {
        url: 'https://example.com/jogo-estrutura',
        title: 'Estrutura de Dados'
    },
    'condicionais': {
        url: 'https://example.com/jogo-condicionais',
        title: 'Condicionais e Loops'
    }
};

/**
 * Carrega um jogo no iframe
 * @param {string} gameId - ID do jogo a carregar
 */
function loadGame(gameId) {
    const gameFrame = document.getElementById('game-frame-container');
    const game = games[gameId];

    if (!game) {
        console.error(`Jogo ${gameId} não encontrado`);
        return;
    }

    // Remove placeholder
    const placeholder = gameFrame.querySelector('.frame-placeholder');
    if (placeholder) {
        placeholder.remove();
    }

    // Cria iframe
    const iframe = document.createElement('iframe');
    iframe.src = game.url;
    iframe.title = game.title;
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');

    // Limpa o container e adiciona iframe
    gameFrame.innerHTML = '';
    gameFrame.appendChild(iframe);

    // Scroll para o frame
    gameFrame.parentElement.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Alterna menu mobile
 */
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

/**
 * Inicializa eventos dos botões de jogo
 */
document.addEventListener('DOMContentLoaded', function() {
    // Setup botões de jogar
    const playButtons = document.querySelectorAll('.btn-play');
    playButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const gameId = href.substring(1); // Remove #
            loadGame(gameId);
        });
    });

    // Carrega dados do usuário (se disponível)
    loadUserData();

    // Animações ao scroll
    observeElements();
});

/**
 * Carrega dados do usuário
 */
function loadUserData() {
    // Placeholder para carregar dados do usuário (localStorage ou API)
    const userName = localStorage.getItem('userName') || 'Aprendiz';
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = userName;
    }

    const profilePic = localStorage.getItem('userProfilePic');
    const profilePicElement = document.getElementById('profilePic');
    if (profilePic && profilePicElement) {
        profilePicElement.src = profilePic;
    }
}

/**
 * Observer para animações ao entrar na viewport
 */
function observeElements() {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, options);

    document.querySelectorAll('.game-card, .progress-card').forEach(el => {
        el.style.opacity = '0.8';
        el.style.transform = 'translateY(10px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/**
 * Atualiza progresso do usuário (placeholder)
 */
function updateProgress(gameId) {
    console.log(`Progresso atualizado para: ${gameId}`);
    // Integrar com localStorage ou API backend
}

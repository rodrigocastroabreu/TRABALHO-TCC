/**
 * SUMÁRIO.JS
 * Funcionalidade para a página central de sumário (capítulos)
 * - Busca e filtro dinâmicos
 * - Animações interativas
 * - Gerenciamento de categorias
 */

class CapitulosPage {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.chapterCards = document.querySelectorAll('.chapter-card');
        this.currentFilter = 'all';
        this.currentSearch = '';

        this.init();
    }

    /**
     * Inicialização do controlador
     */
    init() {
        this.setupEventListeners();
        this.setupAnimations();
        console.log('✅ CapitulosPage inicializado');
    }

    /**
     * Configurar listeners dos eventos
     */
    setupEventListeners() {
        // Listener de busca com debounce
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e));

        // Listeners dos botões de filtro
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });
    }

    /**
     * Handle de busca com debounce
     */
    handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase().trim();
        this.currentSearch = searchTerm;
        this.applyFilters();
    }

    /**
     * Handle de filtro por categoria
     */
    handleFilter(event) {
        const selectedFilter = event.target.dataset.filter;
        this.currentFilter = selectedFilter;

        // Atualizar botões ativos
        this.filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === selectedFilter);
        });

        // Aplicar filtros
        this.applyFilters();
    }

    /**
     * Aplicar filtros e busca
     */
    applyFilters() {
        this.chapterCards.forEach(card => {
            const category = card.dataset.category;
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const description = card.querySelector('.card-description').textContent.toLowerCase();

            // Verificar se passa no filtro de categoria
            const passesCategory = this.currentFilter === 'all' || category === this.currentFilter;

            // Verificar se passa na busca
            const passesSearch = !this.currentSearch || 
                                 title.includes(this.currentSearch) || 
                                 description.includes(this.currentSearch);

            // Aplicar visibilidade
            if (passesCategory && passesSearch) {
                this.showCard(card);
            } else {
                this.hideCard(card);
            }
        });

        // Contar e atualizar badge do filtro "Todos"
        this.updateFilterCount();
    }

    /**
     * Mostrar card com animação
     */
    showCard(card) {
        card.classList.remove('hidden');
        // Resetar animação
        card.style.animation = 'none';
        // Forçar reflow
        void card.offsetWidth;
        // Aplicar animação
        card.style.animation = 'slideInUp 0.5s ease-out forwards';
    }

    /**
     * Ocultar card
     */
    hideCard(card) {
        card.style.animation = 'slideOutDown 0.3s ease-in forwards';
        setTimeout(() => {
            card.classList.add('hidden');
        }, 300);
    }

    /**
     * Atualizar contagem de filtros
     */
    updateFilterCount() {
        const allBtn = Array.from(this.filterButtons).find(btn => btn.dataset.filter === 'all');
        if (allBtn) {
            const visibleCount = Array.from(this.chapterCards).filter(
                card => !card.classList.contains('hidden')
            ).length;
            const totalCount = this.chapterCards.length;
            allBtn.textContent = `Todos (${visibleCount}/${totalCount})`;
        }
    }

    /**
     * Configurar animações
     */
    setupAnimations() {
        // Adicionar estilos de animação se não existirem
        if (!document.getElementById('capitulos-animations')) {
            const style = document.createElement('style');
            style.id = 'capitulos-animations';
            style.textContent = `
                /* Animações para cards */
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideOutDown {
                    from {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                }

                /* Pulsação suave para elementos interativos */
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.8;
                    }
                }

                .filter-btn:hover {
                    animation: pulse 0.5s ease-in-out;
                }
            `;
            document.head.appendChild(style);
        }

        // Animação nos cards ao carregar a página
        this.chapterCards.forEach((card, index) => {
            card.style.animation = `slideInUp 0.5s ease-out ${index * 0.1}s forwards`;
            card.style.opacity = '0';
        });
    }
}

/**
 * Inicializar quando o DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', () => {
    new CapitulosPage();
});

/**
 * TOPICO LAYOUT - Sistema de Navegação de Capítulos com Sidebar Fixo
 * Gerencia:
 * - Highlight do tópico atual
 * - Progresso de tópicos visitados
 * - Marcar tópicos como lidos
 * - Persistência no localStorage
 */

class TopicoLayout {
    constructor() {
        this.topics = document.querySelectorAll('.lesson-topic');
        this.sidebar = document.querySelector('.lesson-sidebar');
        this.completeTopic = document.getElementById('completeTopic');
        this.progressFill = document.querySelector('.progress-fill');
        this.progressText = document.querySelector('.progress-text');
        
        this.storageKey = 'topico_progress';
        this.visitedTopics = new Set();
        this.currentTopic = null;
        
        this.init();
    }

    /**
     * Inicialização
     */
    init() {
        this.loadProgress();
        this.highlightCurrentTopic();
        this.setupEventListeners();
        this.updateProgressBar();
        
        console.log('✅ TopicoLayout inicializado');
        console.log(`   Tópicos encontrados: ${this.topics.length}`);
    }

    /**
     * Setup de listeners
     */
    setupEventListeners() {
        // Listener para marcar tópico como concluído
        // Só adiciona se o CapituloManager não estiver gerenciando
        if (this.completeTopic && !window.capituloManager) {
            this.completeTopic.addEventListener('click', () => {
                this.markTopicComplete();
            });
        }

        // Marcar tópico como visitado quando a página carrega
        this.markCurrentTopicVisited();
    }

    /**
     * Encontrar e destacar o tópico atual
     */
    highlightCurrentTopic() {
        // Obter o arquivo HTML atual
        const currentFile = this.getCurrentTopicFile();
        
        this.topics.forEach(topic => {
            const href = topic.getAttribute('href');
            
            // Remove 'active' de todos
            topic.classList.remove('active');
            topic.classList.remove('current');
            
            // Se o link coincide com o arquivo atual, marca como ativo
            if (href && href.includes(currentFile)) {
                topic.classList.add('active');
                topic.classList.add('current');
                this.currentTopic = topic;
            }
        });
    }

    /**
     * Obter nome do arquivo HTML atual (ex: topico1.html)
     */
    getCurrentTopicFile() {
        const pathname = window.location.pathname;
        return pathname.split('/').pop(); // Retorna "topico1.html"
    }

    /**
     * Marcar tópico atual como visitado
     */
    markCurrentTopicVisited() {
        if (this.currentTopic) {
            const file = this.currentTopic.getAttribute('href');
            if (file) {
                this.visitedTopics.add(file);
                this.currentTopic.classList.add('visited');
                this.saveProgress();
                this.updateProgressBar();
            }
        }
    }

    /**
     * Marcar tópico como completado
     */
    markTopicComplete() {
        if (this.currentTopic) {
            this.currentTopic.classList.add('visited');
            this.markCurrentTopicVisited();
            
            // Feedback visual
            const btn = this.completeTopic;
            btn.textContent = '✔ Concluído!';
            btn.style.opacity = '0.6';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.textContent = '✔ Marcar como Concluído';
                btn.style.opacity = '1';
                btn.disabled = false;
            }, 2000);
        }
    }

    /**
     * Obter capítulo do atributo data
     */
    getChapterId() {
        return this.completeTopic?.getAttribute('data-topic') || 'unknown';
    }

    /**
     * Salvar progresso no localStorage
     */
    saveProgress() {
        const progress = {
            visitedTopics: Array.from(this.visitedTopics),
            lastUpdated: new Date().toISOString()
        };
        
        Storage.save(`${this.storageKey}_${this.getChapterId()}`, progress);
    }

    /**
     * Carregar progresso do localStorage
     */
    loadProgress() {
        const saved = Storage.get(`${this.storageKey}_${this.getChapterId()}`, null);
        
        if (saved && saved.visitedTopics) {
            this.visitedTopics = new Set(saved.visitedTopics);
            
            // Aplicar visualmente
            this.topics.forEach(topic => {
                const href = topic.getAttribute('href');
                if (href && this.visitedTopics.has(href)) {
                    topic.classList.add('visited');
                }
            });
        }
    }

    /**
     * Atualizar barra de progresso
     */
    updateProgressBar() {
        if (!this.progressFill || !this.progressText) return;

        const totalTopics = this.topics.length;
        const visitedCount = this.visitedTopics.size;
        const percentage = totalTopics > 0 ? (visitedCount / totalTopics) * 100 : 0;

        this.progressFill.style.width = percentage + '%';
        this.progressText.textContent = Math.round(percentage) + '%';
    }

    /**
     * Obter listagem de tópicos completados
     */
    getCompletionStats() {
        return {
            total: this.topics.length,
            visited: this.visitedTopics.size,
            percentage: Math.round((this.visitedTopics.size / this.topics.length) * 100)
        };
    }

    /**
     * Resetar progresso
     */
    resetProgress() {
        this.visitedTopics.clear();
        this.topics.forEach(topic => {
            topic.classList.remove('visited');
        });
        Storage.remove(`${this.storageKey}_${this.getChapterId()}`);
        this.updateProgressBar();
    }
}

/**
 * Detector automático de tópico ativo (para footer)
 */
function setupTopicNavigation() {
    const topics = document.querySelectorAll('.lesson-topic');
    
    topics.forEach(topic => {
        topic.addEventListener('click', (e) => {
            // Se for um link simples, deixa o navegador fazer o trabalho
            // Se quiser interceptar: e.preventDefault();
        });
    });
}

// Instanciar quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.topicoLayout = new TopicoLayout();
        setupTopicNavigation();
    } catch (error) {
        console.error('Erro ao inicializar TopicoLayout:', error);
    }
});

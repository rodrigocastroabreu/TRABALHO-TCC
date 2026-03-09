/**
 * TABLE OF CONTENTS - INTERATIVIDADE 3D
 * Adiciona funcionalidades de expansão, scroll suave e eventos
 */

class TableOfContents {
    constructor() {
        this.tocItems = document.querySelectorAll('.toc-item-header');
        this.tocLinks = document.querySelectorAll('.toc-link');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.highlightCurrentPage();
        console.log('✅ Table of Contents inicializado');
    }

    setupEventListeners() {
        // Adiciona efeito smooth scroll aos links
        this.tocLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href') === '#') {
                    e.preventDefault();
                }
                this.addActiveState(link);
            });
        });

        // Adiciona feedback visual ao passar o mouse
        this.tocItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.highlightItem(item);
            });
            
            item.addEventListener('mouseleave', () => {
                this.removeHighlight(item);
            });
        });
    }

    highlightItem(item) {
        // Adiciona classe para efeito visual ao hover
        item.classList.add('toc-item-active');
    }

    removeHighlight(item) {
        item.classList.remove('toc-item-active');
    }

    addActiveState(link) {
        // Remove active state de outros links
        this.tocLinks.forEach(l => l.classList.remove('toc-link-active'));
        
        // Adiciona ao link clicado
        link.classList.add('toc-link-active');
    }

    highlightCurrentPage() {
        // Destaca o link da página atual (opcional)
        const currentPage = window.location.pathname;
        
        this.tocLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && currentPage.includes(href)) {
                link.classList.add('toc-link-active');
            }
        });
    }

    // Função para expandir/retrair capítulos (opcional)
    toggleChapter(chapterElement) {
        const sublist = chapterElement.querySelector('.toc-sublist');
        
        if (sublist) {
            sublist.style.display = 
                sublist.style.display === 'grid' ? 'none' : 'grid';
        }
    }

    // Função para scroll suave até um tópico
    scrollToTopic(topicSelector) {
        const element = document.querySelector(topicSelector);
        
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    // Função para gerar sumário automaticamente (utility)
    static generateTableOfContents(containerSelector) {
        const container = document.querySelector(containerSelector);
        
        if (!container) return;

        const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const toc = document.createElement('nav');
        toc.className = 'auto-toc';

        let currentLevel = 0;
        let list = document.createElement('ul');
        let listStack = [list];

        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName[1]);
            heading.id = heading.id || `heading-${index}`;

            if (level > currentLevel) {
                for (let i = currentLevel; i < level; i++) {
                    const newList = document.createElement('ul');
                    if (listStack[listStack.length - 1].lastChild?.tagName === 'LI') {
                        listStack[listStack.length - 1].lastChild.appendChild(newList);
                    } else {
                        const li = document.createElement('li');
                        li.appendChild(newList);
                        listStack[listStack.length - 1].appendChild(li);
                    }
                    listStack.push(newList);
                }
            } else if (level < currentLevel) {
                for (let i = level; i < currentLevel; i++) {
                    listStack.pop();
                }
            }

            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.textContent = heading.textContent;
            li.appendChild(link);
            listStack[listStack.length - 1].appendChild(li);

            currentLevel = level;
        });

        toc.appendChild(list);
        return toc;
    }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new TableOfContents();
});

// Exporta para uso em módulos (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TableOfContents;
}

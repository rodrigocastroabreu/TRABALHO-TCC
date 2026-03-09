/**
 * CAPITULO.JS
 * Gerencia a conclusão de capítulos e progresso
 * Módulo independente para páginas de capítulos
 */

class CapituloManager {
  constructor() {
    this.completBtn = null;
    this.chapterName = null;
    this.init();
  }

  /**
   * Inicializa o gerenciador
   */
  init() {
    this.completBtn = document.getElementById('completeTopic');
    if (!this.completBtn) return;

    this.chapterName = this.completBtn.getAttribute('data-chapter') || this.completBtn.getAttribute('data-topic') || this.extractChapterName();

    this.setupEventListeners();
    this.checkIfCompleted();

    console.log(`✔ Capítulo Manager inicializado para: ${this.chapterName}`);
  }

  /**
   * Extrai o nome do capítulo do título da página
   */
  extractChapterName() {
    const titleElement = document.querySelector('.tutorial-header h1');
    return titleElement?.textContent || 'Unknown Chapter';
  }

  /**
   * Retorna o nome do capítulo atual
   */
  getChapterName() {
    return this.chapterName || this.extractChapterName();
  }

  /**
   * Configura listeners dos eventos
   */
  setupEventListeners() {
    this.completBtn.addEventListener('click', () => this.completeChapter());
  }

  /**
   * Marca capítulo como concluído
   */
  completeChapter() {
    const progress = this.getProgressData();

    if (!progress.chapters) {
      progress.chapters = {};
    }

    progress.chapters[this.chapterName] = {
      completed: true,
      date: new Date().toISOString(),
      timeSpent: this.calculateTimeSpent()
    };

    // Adiciona pontos
    if (!progress.points) progress.points = 0;
    progress.points += 10;

    // Incrementa contador de capítulos completos
    if (!progress.chaptersCompleted) progress.chaptersCompleted = 0;
    progress.chaptersCompleted += 1;

    this.saveProgressData(progress);
    this.updateButtonState();

    console.log(`✔ ${this.chapterName} concluído! +10 pontos`);

    this.showCompletionMessage();
  }

  /**
   * Verifica se o capítulo já foi completo
   */
  checkIfCompleted() {
    const progress = this.getProgressData();
    const isCompleted = progress.chapters?.[this.chapterName]?.completed;

    if (isCompleted) {
      this.updateButtonState(true);
    }
  }

  /**
   * Atualiza o estado visual do botão
   */
  updateButtonState(isCompleted = true) {
    this.completBtn.textContent = '✔ Concluído!';
    this.completBtn.style.opacity = '0.7';
    this.completBtn.disabled = true;
    this.completBtn.classList.add('completed');
  }

  /**
   * Calcula tempo gasto no capítulo
   */
  calculateTimeSpent() {
    const sessionStart = sessionStorage.getItem('chapterStartTime');
    if (!sessionStart) return 0;

    const now = new Date().getTime();
    const start = parseInt(sessionStart);
    return Math.round((now - start) / 1000); // em segundos
  }

  /**
   * Recupera dados de progresso do localStorage
   */
  getProgressData() {
    const data = localStorage.getItem('progress');
    return data ? JSON.parse(data) : {};
  }

  /**
   * Salva dados de progresso no localStorage
   */
  saveProgressData(data) {
    localStorage.setItem('progress', JSON.stringify(data));
  }

  /**
   * Mostra mensagem de conclusão
   */
  showCompletionMessage() {
    const message = document.createElement('div');
    message.className = 'completion-toast';
    message.innerHTML = `
      <p>🎉 Parabéns! Capítulo concluído!</p>
      <small>Seu progresso foi salvo automaticamente.</small>
    `;

    document.body.appendChild(message);

    // Remover após 3 segundos
    setTimeout(() => {
      message.remove();
    }, 3000);
  }

  /**
   * Retorna o nome do capítulo
   */
  getChapterName() {
    return this.chapterName;
  }

  /**
   * Retorna dados do capítulo
   */
  getChapterData() {
    const progress = this.getProgressData();
    return progress.chapters?.[this.chapterName] || null;
  }
}

// Inicialização global
window.addEventListener('load', () => {
  // Registra tempo de início do capítulo
  sessionStorage.setItem('chapterStartTime', new Date().getTime());

  // Inicializa o gerenciador
  window.capituloManager = new CapituloManager();

  // Inicializa sistemas adicionais
  new RatingSystem();
  new ImageCarousel();
  new FlowSlider();
  new FlashcardNavigator();
});

// ========================================
// RATING SYSTEM (ESTRELAS)
// ========================================

class RatingSystem {
  constructor() {
    this.stars = document.querySelectorAll('.rating-stars .star');
    this.selectedRating = 0;
    this.ratingText = document.querySelector('.rating-text');
    this.init();
  }

  init() {
    if (this.stars.length === 0) {
      return;
    }

    // Garantir que todas as estrelas comecem sem classes ativas
    this.stars.forEach((star, index) => {
      star.classList.remove('hover', 'active');
      star.classList.add('inactive');
    });

    this.stars.forEach((star, index) => {
      star.addEventListener('click', (e) => {
        e.preventDefault();
        this.setRating(index + 1);
      });
      star.addEventListener('mouseenter', () => {
        this.hoverRating(index + 1);
      });
      star.addEventListener('mouseleave', () => {
        if (!this.selectedRating) {
          this.resetHover();
        }
      });
    });

    // Reset hover quando sair da área de estrelas
    const ratingContainer = document.querySelector('.rating-stars');
    if (ratingContainer) {
      ratingContainer.addEventListener('mouseleave', () => {
        if (!this.selectedRating) {
          this.resetHover();
        }
      });
    }

    this.loadRating();
  }

  hoverRating(rating) {
    if (this.selectedRating) return; // Não alterar se já há uma avaliação selecionada

    this.stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('hover');
      } else {
        star.classList.remove('hover');
      }
    });

    // Mostrar preview do texto
    this.showRatingText(rating, true);
  }

  resetHover() {
    if (this.selectedRating) return;

    this.stars.forEach(star => star.classList.remove('hover'));
    this.hideRatingText();
  }

  setRating(rating) {
    // Se clicou na mesma estrela que já está selecionada, desmarcar todas
    if (this.selectedRating === rating) {
      this.clearRating();
      return;
    }

    this.selectedRating = rating;

    // Reset all stars
    this.stars.forEach(star => {
      star.classList.remove('hover', 'active', 'inactive');
    });

    // Set active stars
    this.stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('active');
      }
    });

    // Show rating text
    this.showRatingText(rating, false);

    // Add success feedback
    this.showSuccessFeedback();
  }

  clearRating() {
    this.selectedRating = 0;

    // Reset all stars
    this.stars.forEach(star => {
      star.classList.remove('hover', 'active');
      star.classList.add('inactive');
    });

    // Hide rating text
    this.hideRatingText();
  }

  showRatingText(rating, isPreview = false) {
    const texts = {
      1: '😞 Não gostei',
      2: '😐 Mais ou menos',
      3: '😊 Gostei',
      4: '😄 Muito bom!',
      5: '🤩 Excelente!'
    };

    if (this.ratingText) {
      this.ratingText.textContent = texts[rating] || '';
      this.ratingText.classList.add('show');

      if (isPreview) {
        this.ratingText.style.opacity = '0.7';
      } else {
        this.ratingText.style.opacity = '1';
      }
    }
  }

  hideRatingText() {
    if (this.ratingText) {
      this.ratingText.classList.remove('show');
    }
  }

  saveRating(rating) {
    try {
      let data = JSON.parse(localStorage.getItem('chapterRatings') || '{}');
      const chapterName = window.capituloManager?.getChapterName() || 'Tópico 1';

      if (rating === 0) {
        delete data[chapterName]; // Remove a avaliação se for 0
      } else {
        data[chapterName] = rating;
      }

      localStorage.setItem('chapterRatings', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving rating:', error);
    }
  }

  loadRating() {
    // Desabilitado: avaliações sempre começam apagadas
    // Usuário deve escolher a avaliação a cada vez
  }

  showSuccessFeedback() {
    // Adicionar uma pequena animação de sucesso
    const ratingContainer = document.querySelector('.rating-container');
    if (ratingContainer) {
      ratingContainer.style.animation = 'none';
      setTimeout(() => {
        ratingContainer.style.animation = 'ratingSuccess 0.5s ease';
      }, 10);
    }

    // Adicionar efeito visual nas estrelas ativas
    this.stars.forEach((star, index) => {
      if (index < this.selectedRating) {
        star.style.animation = 'none';
        setTimeout(() => {
          star.style.animation = 'starPulse 0.6s ease';
        }, 100 * index); // Delay escalonado para cada estrela
      }
    });
  }
}

// ========================================
// IMAGE CAROUSEL
// ========================================

class ImageCarousel {
  constructor() {
    this.carousels = document.querySelectorAll('.image-carousel');
    this.init();
  }

  init() {
    this.carousels.forEach(carousel => {
      const cards = carousel.querySelectorAll('.image-card');
      cards.forEach(card => {
        card.addEventListener('click', () => this.expandImage(card));
      });
    });
  }

  expandImage(card) {
    const img = card.querySelector('img');
    if (img) {
      this.showImageModal(img.src, card.querySelector('.image-card-caption')?.textContent || '');
    }
  }

  showImageModal(src, caption) {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      cursor: pointer;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: white;
      border-radius: 12px;
      max-width: 90vw;
      max-height: 90vh;
      overflow: auto;
      position: relative;
    `;

    content.innerHTML = `
      <button style="
        position: absolute;
        top: 12px;
        right: 12px;
        background: white;
        border: none;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 24px;
        z-index: 1001;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      ">✕</button>
      <img src="${src}" style="max-width: 100%; max-height: 85vh; display: block;" />
      ${caption ? `<p style="padding: 16px; text-align: center; color: #666; margin: 0;">${caption}</p>` : ''}
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    content.querySelector('button').addEventListener('click', () => modal.remove());
  }
}

// ========================================
// IMAGE FLOW SLIDER - Galeria com Scroll Suave
// Recursos:
// - Scroll horizontal com roda do mouse
// - Snap automático com transições suaves
// - Suporte a toque/swipe completo
// - Responsivo e acessível
// ========================================

class FlowSlider {
  constructor() {
    this.flows = document.querySelectorAll('.image-flow');
    this.init();
  }

  init() {
    this.flows.forEach(flow => this.setupFlow(flow));
  }

  setupFlow(flow) {
    const container = flow.querySelector('.flow-container');
    if (!container) return;

    const slides = container.querySelectorAll('.flow-slide');
    if (slides.length === 0) return;

    flow.style.overflow = 'hidden';

    // Inicializar propriedades de controle
    flow.currentIndex = 0;
    flow.isAnimating = false;
    flow.touchStartX = 0;
    flow.touchEndX = 0;

    // Criar controles de navegação
    const prevBtn = document.createElement('button');
    prevBtn.className = 'flow-prev';
    prevBtn.innerHTML = '&#10094;';
    prevBtn.setAttribute('aria-label', 'Anterior');
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'flow-next';
    nextBtn.innerHTML = '&#10095;';
    nextBtn.setAttribute('aria-label', 'Próximo');
    
    flow.appendChild(prevBtn);
    flow.appendChild(nextBtn);

    // Criar paginação (dots)
    const pagination = document.createElement('div');
    pagination.className = 'flow-pagination';
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = 'flow-dot';
      dot.setAttribute('aria-label', `Ir para slide ${idx + 1}`);
      dot.addEventListener('click', () => this.goToSlide(flow, idx));
      pagination.appendChild(dot);
    });
    flow.appendChild(pagination);

    this.updateFlow(flow);

    // Listeners dos botões
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.navigate(flow, -1);
    });
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.navigate(flow, 1);
    });

    // Listener de scroll (native scroll snap)
    container.addEventListener('scroll', () => {
      if (!flow.isAnimating) {
        const newIndex = Math.round(container.scrollLeft / container.offsetWidth);
        if (newIndex !== flow.currentIndex) {
          flow.currentIndex = newIndex;
          this.updateFlow(flow);
        }
      }
    });

    // Suporte a scroll com roda do mouse
    container.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        // Ignorar scroll vertical
        return;
      }
      e.preventDefault();
      
      // Navegar com base na direção do scroll
      if (e.deltaX > 0) {
        this.navigate(flow, 1); // Scroll direita = próximo
      } else if (e.deltaX < 0) {
        this.navigate(flow, -1); // Scroll esquerda = anterior
      }
    }, { passive: false });

    // Suporte a touch/swipe
    container.addEventListener('touchstart', (e) => {
      flow.touchStartX = e.touches[0].clientX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      flow.touchEndX = e.changedTouches[0].clientX;
      const diffX = flow.touchStartX - flow.touchEndX;
      
      if (Math.abs(diffX) > 50) { // Mínimo 50px para detectar swipe
        if (diffX > 0) {
          this.navigate(flow, 1); // Swipe esquerda = próximo
        } else {
          this.navigate(flow, -1); // Swipe direita = anterior
        }
      }
    }, { passive: true });

    // Configurar slides
    slides.forEach(slide => {
      slide.style.flex = '0 0 100%';
      slide.style.maxWidth = '100%';

      // Click na imagem para expandir
      const img = slide.querySelector('img');
      if (img) {
        img.style.cursor = 'pointer';
        img.addEventListener('click', (e) => {
          e.stopPropagation();
          const credit = slide.querySelector('.image-credit')?.textContent || '';
          this.showImageModal(img.src, credit);
        });
      }
    });

    // Recalcular ao redimensionar
    window.addEventListener('resize', () => {
      if (!flow.isAnimating) {
        this.updateFlow(flow);
      }
    });
  }

  navigate(flow, direction) {
    if (flow.isAnimating) return;
    
    const container = flow.querySelector('.flow-container');
    const slides = container.querySelectorAll('.flow-slide');
    const newIndex = Math.max(0, Math.min(slides.length - 1, flow.currentIndex + direction));
    
    if (newIndex !== flow.currentIndex) {
      flow.currentIndex = newIndex;
      this.updateFlow(flow);
    }
  }

  goToSlide(flow, index) {
    if (flow.isAnimating) return;
    
    const container = flow.querySelector('.flow-container');
    const slides = container.querySelectorAll('.flow-slide');
    
    if (index >= 0 && index < slides.length) {
      flow.currentIndex = index;
      this.updateFlow(flow);
    }
  }

  updateFlow(flow) {
    const container = flow.querySelector('.flow-container');
    
    flow.isAnimating = true;
    
    // Scroll suave até o slide
    container.scrollTo({
      left: flow.currentIndex * container.offsetWidth,
      behavior: 'smooth'
    });

    // Atualizar dots (paginação)
    const dots = flow.querySelectorAll('.flow-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === flow.currentIndex);
    });

    // Resetar flag de animação após transição
    setTimeout(() => {
      flow.isAnimating = false;
    }, 500);
  }

  /**
   * Displays a modal with the given image src and optional caption.
   * Copied from ImageCarousel to keep the behaviour consistent.
   */
  showImageModal(src, caption) {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      cursor: pointer;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: white;
      border-radius: 12px;
      max-width: 90vw;
      max-height: 90vh;
      overflow: auto;
      position: relative;
    `;

    content.innerHTML = `
      <button style="
        position: absolute;
        top: 12px;
        right: 12px;
        background: white;
        border: none;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 24px;
        z-index: 1001;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      ">✕</button>
      <img src="${src}" style="max-width: 100%; max-height: 85vh; display: block;" />
      ${caption ? `<p style="padding: 16px; text-align: center; color: #666; margin: 0;">${caption}</p>` : ''}
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    content.querySelector('button').addEventListener('click', () => modal.remove());
  }
}

// ========================================
// FLASHCARD NAVIGATION
// ========================================

class FlashcardNavigator {
  constructor() {
    this.containers = document.querySelectorAll('.flashcard-container');
    this.init();
  }

  init() {
    this.containers.forEach(container => {
      const prevBtn = container.querySelector('.prev');
      const nextBtn = container.querySelector('.next');

      if (prevBtn) prevBtn.addEventListener('click', () => this.navigate(container, -1));
      if (nextBtn) nextBtn.addEventListener('click', () => this.navigate(container, 1));
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.navigate(this.containers[0], -1);
      if (e.key === 'ArrowRight') this.navigate(this.containers[0], 1);
    });
  }

  navigate(container, direction) {
    // A lógica de navegação já existe em flashcards.js
  }
}

// ===== ESTILOS DA NOTIFICAÇÃO (Toast) =====
// Añade estilos CSS para a notificação
const style = document.createElement('style');
style.textContent = `
  .completion-toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
    color: white;
    padding: 20px 25px;
    border-radius: 8px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    animation: slideIn 0.4s ease-out;
    max-width: 300px;
  }

  .completion-toast p {
    margin: 0 0 5px 0;
    font-weight: 600;
    font-size: 1rem;
  }

  .completion-toast small {
    display: block;
    opacity: 0.9;
    font-size: 0.85rem;
  }

  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @media (max-width: 480px) {
    .completion-toast {
      bottom: 15px;
      right: 15px;
      left: 15px;
      max-width: none;
    }
  }
`;

document.head.appendChild(style);
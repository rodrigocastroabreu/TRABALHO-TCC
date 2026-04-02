// Sidebar active state - Scroll Spy
function initScrollSpy() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Rating system com feedback
document.addEventListener('DOMContentLoaded', () => {
    initScrollSpy();

    const stars = document.querySelectorAll('.star');
    const feedback = document.getElementById('feedback');
    const nextButton = createNextTopicButton();
    const currentTopicId = getCurrentTopicId();

    const messages = {
        1: '😢 Que pena! Nos ajude a melhorar.',
        2: '😐 Podemos fazer melhor. Obrigado pelo feedback!',
        3: '👍 Bom! Continuaremos aprimorando.',
        4: '😊 Ótimo! Ficamos felizes que tenha gostado.',
        5: '🥳 Excelente! Muito obrigado! Você é incrível!'
    };

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = parseInt(star.getAttribute('data-value'));
            setRating(value, stars, feedback, currentTopicId, messages);
        });
    });

    if (currentTopicId) {
        const savedRating = progressManager.getTopicRating(currentTopicId);
        if (savedRating) {
            setRating(savedRating, stars, feedback, currentTopicId, messages, false);
        }
    }
});

function getCurrentTopicId() {
    const href = window.location.href;

    if (/topicos\.html$/i.test(href)) {
        return 'topicos';
    }

    const match = href.match(/topico(\d+)\.html/i);
    if (match) {
        return `topico${match[1]}`;
    }

    const path = window.location.pathname;
    const pathMatch = path.match(/topico(\d+)\.html/i);
    if (pathMatch) {
        return `topico${pathMatch[1]}`;
    }

    return null;
}

function getNextTopicInfo() {
    const current = getCurrentTopicId();
    if (!current) return null;

    if (current === 'topicos') {
        return {
            id: 'topico1',
            url: 'topico1.html'
        };
    }

    const match = current.match(/topico(\d+)/i);
    if (!match) return null;

    const index = parseInt(match[1], 10);
    const nextIndex = index + 1;
    const totalTopics = 8;

    if (nextIndex > totalTopics) return null;

    return {
        id: `topico${nextIndex}`,
        url: `topico${nextIndex}.html`
    };
}

function createNextTopicButton() {
    const nextButton = document.getElementById('nextTopicButton');
    if (!nextButton) return null;

    nextButton.addEventListener('click', (event) => {
        event.preventDefault();

        const currentTopicId = getCurrentTopicId();
        const rating = progressManager.getTopicRating(currentTopicId);
        const feedback = document.getElementById('feedback');

        if (!rating || rating < 1) {
            if (feedback) {
                feedback.textContent = 'Você precisa avaliar este conteúdo com as estrelas antes de avançar.';
                feedback.style.color = '#d97706';
                feedback.style.fontWeight = '700';
            }
            alert('Atenção: por favor, avalie este tópico usando as estrelas para liberar o próximo.');
            return;
        }

        if (feedback) {
            feedback.textContent = 'Avaliação registrada. Você pode seguir ao próximo tópico.';
            feedback.style.color = '#16a34a';
            feedback.style.fontWeight = '700';
            setTimeout(() => {
                feedback.textContent = '';
                feedback.style.color = '';
                feedback.style.fontWeight = '';
            }, 3000);
        }

        const nextTopic = getNextTopicInfo();
        if (!nextTopic) {
            alert('Parabéns! Você concluiu todos os tópicos disponíveis.');
            return;
        }

        window.location.href = nextTopic.url;
    });

    return nextButton;
}

function setRating(value, stars, feedback, topicId, messages, store = true) {
    stars.forEach(s => s.classList.remove('active'));
    for (let i = 0; i < value; i++) {
        stars[i].classList.add('active');
    }
    feedback.textContent = messages[value] || 'Obrigado pelo feedback!';

    if (store && topicId) {
        progressManager.recordTopicRating(topicId, value);
        progressManager.save();
    }

    // Enable the next button
    const nextButton = document.getElementById('nextTopicButton');
    if (nextButton) {
        nextButton.disabled = false;
        nextButton.style.opacity = '1';
        nextButton.style.cursor = 'pointer';
        nextButton.textContent = 'Próximo Tópico';
        nextButton.title = 'Clique para ir para o próximo tópico';
    }

    // Analytics: Log rating
    console.log(`Rating: ${value}/5 para ${topicId}`);
}

// Smooth scroll para links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

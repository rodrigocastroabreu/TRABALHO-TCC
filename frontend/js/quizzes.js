const QUIZ_STORAGE_KEY = 'quizPerformance';

const quizzes = {
    capitulo1: {
        title: 'Introdução',
        questions: [
            {
                question: 'O que é um "Sprite" em um jogo?',
                media: '',
                answers: ['Um tipo de cenário', 'Uma imagem de personagem', 'Um botão de comando', 'Uma trilha sonora'],
                correctIndex: 1
            },
            {
                question: 'Qual elemento faz a interface parecer mais interativa?',
                media: '',
                answers: ['Som', 'Animação', 'Bordas arredondadas', 'Ícones pequenos'],
                correctIndex: 2
            },
            {
                question: 'O que significa UI?',
                media: '',
                answers: ['Unidade de Informação', 'User Interface', 'Ultimate Interaction', 'Update Interval'],
                correctIndex: 1
            },
            {
                question: 'Qual é a função do feedback visual?',
                media: '',
                answers: ['Aumentar o download', 'Melhorar a experiência', 'Reduzir o código', 'Diminuir cores'],
                correctIndex: 1
            },
            {
                question: 'Como um botão deve se comportar para ser fácil de usar?',
                media: '',
                answers: ['Mudar de cor ao passar o mouse', 'Ter texto pequeno', 'Ficar invisível', 'Abrir várias janelas'],
                correctIndex: 0
            },
            {
                question: 'O que torna um layout mais organizado?',
                media: '',
                answers: ['Espaçamento consistente', 'Muitas fontes diferentes', 'Cores fortes demais', 'Textos centralizados demais'],
                correctIndex: 0
            },
            {
                question: 'Qual elemento ajuda a guiar o usuário?',
                media: '',
                answers: ['Animações suaves', 'Texto escondido', 'Janela pop-up constante', 'Som alto'],
                correctIndex: 0
            },
            {
                question: 'Qual combinação de cores costuma ser mais acessível?',
                media: '',
                answers: ['Alto contraste', 'Cores iguais', 'Somente cinza', 'Cores fluorescentes'],
                correctIndex: 0
            },
            {
                question: 'Por que a hierarquia visual é importante?',
                media: '',
                answers: ['Para destacar o conteúdo mais relevante', 'Para deixar o site lento', 'Para confundir o usuário', 'Para usar menos imagens'],
                correctIndex: 0
            },
            {
                question: 'Qual dos itens abaixo é um bom exemplo de microinteração?',
                media: '',
                answers: ['Efeito de clique em botão', 'Texto longo', 'Página em branco', 'Som automático'],
                correctIndex: 0
            }
        ]
    },
    capitulo2: {
        title: 'Conceitos básicos',
        questions: [
            {
                question: 'Qual comando verifica se duas coisas são iguais?',
                media: '',
                answers: ['if', 'repeat', 'move', 'delete'],
                correctIndex: 0
            },
            {
                question: 'O que é uma variável?',
                media: '',
                answers: ['Uma cor', 'Um valor que pode mudar', 'Uma imagem', 'Um botão'],
                correctIndex: 1
            },
            {
                question: 'Qual alternativa é um tipo de loop?',
                media: '',
                answers: ['if', 'for', 'say', 'touch'],
                correctIndex: 1
            },
            {
                question: 'Por que usamos o localStorage?',
                media: '',
                answers: ['Salvar dados no navegador', 'Salvar no servidor', 'Criar animações', 'Melhorar áudio'],
                correctIndex: 0
            }
        ]
    },
    capitulo3: {
        title: 'Avançado',
        questions: [
            {
                question: 'O que é otimização em jogos?',
                media: '',
                answers: ['Melhorar desempenho', 'Adicionar mais cores', 'Trocar jogadores', 'Fazer backup'],
                correctIndex: 0
            },
            {
                question: 'O que é um evento em game design?',
                media: '',
                answers: ['Uma condição e ação', 'Uma imagem', 'Um som', 'Uma variável'],
                correctIndex: 0
            },
            {
                question: 'Por que usar funções?',
                media: '',
                answers: ['Repetir código', 'Salvar som', 'Deixar botões maiores', 'Mudar o jogador'],
                correctIndex: 0
            },
            {
                question: 'Qual é um bom sinal de design avançado?',
                media: '',
                answers: ['Código confuso', 'Feedback claro', 'Tela preta', 'Som alto demais'],
                correctIndex: 1
            }
        ]
    }
};

const quizState = {
    chapterKey: null,
    currentQuestions: [],
    questionIndex: 0,
    answered: false,
    timer: 15,
    timerId: null,
    performance: {
        acertos: 0,
        erros: 0,
        total: 0,
        chapters: {
            capitulo1: { acertos: 0, erros: 0, total: 0 },
            capitulo2: { acertos: 0, erros: 0, total: 0 },
            capitulo3: { acertos: 0, erros: 0, total: 0 }
        },
        lastChapter: null
    }
};

function getDefaultPerformance() {
    return {
        acertos: 0,
        erros: 0,
        total: 0,
        chapters: {
            capitulo1: { acertos: 0, erros: 0, total: 0 },
            capitulo2: { acertos: 0, erros: 0, total: 0 },
            capitulo3: { acertos: 0, erros: 0, total: 0 }
        },
        lastChapter: null
    };
}

function loadPerformance() {
    const saved = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!saved) return getDefaultPerformance();

    try {
        const parsed = JSON.parse(saved);
        return {
            acertos: Number(parsed.acertos) || 0,
            erros: Number(parsed.erros) || 0,
            total: Number(parsed.total) || 0,
            chapters: {
                capitulo1: {
                    acertos: Number(parsed.chapters?.capitulo1?.acertos) || 0,
                    erros: Number(parsed.chapters?.capitulo1?.erros) || 0,
                    total: Number(parsed.chapters?.capitulo1?.total) || 0
                },
                capitulo2: {
                    acertos: Number(parsed.chapters?.capitulo2?.acertos) || 0,
                    erros: Number(parsed.chapters?.capitulo2?.erros) || 0,
                    total: Number(parsed.chapters?.capitulo2?.total) || 0
                },
                capitulo3: {
                    acertos: Number(parsed.chapters?.capitulo3?.acertos) || 0,
                    erros: Number(parsed.chapters?.capitulo3?.erros) || 0,
                    total: Number(parsed.chapters?.capitulo3?.total) || 0
                }
            },
            lastChapter: parsed.lastChapter || null
        };
    } catch (error) {
        console.error('Erro ao ler desempenho do localStorage:', error);
        return getDefaultPerformance();
    }
}

function savePerformance() {
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(quizState.performance));
}

function initQuiz() {
    quizState.performance = loadPerformance();
    document.querySelectorAll('.chapter-card').forEach(button => {
        button.addEventListener('click', () => selectChapter(button.dataset.chapter));
    });
    document.getElementById('nextButton').addEventListener('click', handleNextClick);
    document.getElementById('backButton').addEventListener('click', showChapterSelection);
    showChapterSelection();
}

function selectChapter(chapterKey) {
    quizState.chapterKey = chapterKey;
    quizState.currentQuestions = quizzes[chapterKey].questions;
    quizState.questionIndex = 0;
    quizState.answered = false;
    quizState.timer = 15;
    quizState.performance.lastChapter = chapterKey;

    document.getElementById('chapterTitle').textContent = quizzes[chapterKey].title;
    document.getElementById('chapterSelection').classList.add('hidden');
    document.getElementById('quizScreen').classList.remove('hidden');
    renderQuestion();
}

function renderQuestion() {
    stopTimer();
    quizState.answered = false;
    quizState.timer = 15;

    const current = quizState.currentQuestions[quizState.questionIndex];
    document.getElementById('questionText').textContent = current.question;
    document.getElementById('questionCounter').textContent = `${quizState.questionIndex + 1} / ${quizState.currentQuestions.length}`;
    document.getElementById('timerDisplay').textContent = quizState.timer;
    document.getElementById('nextButton').disabled = true;
    document.getElementById('nextButton').textContent = quizState.questionIndex === quizState.currentQuestions.length - 1 ? 'Finalizar quiz' : 'Próxima';

    const mediaContainer = document.getElementById('mediaContainer');
    if (current.media) {
        mediaContainer.innerHTML = `<img src="${current.media}" alt="Imagem da pergunta">`;
    } else {
        mediaContainer.innerHTML = '';
    }

    const optionsGrid = document.getElementById('optionsGrid');
    optionsGrid.innerHTML = current.answers.map((answer, index) => {
        return `
            <button type="button" class="option-button option-${index}" data-index="${index}">
                <span class="option-label">${String.fromCharCode(65 + index)}</span>
                <span>${answer}</span>
            </button>
        `;
    }).join('');

    document.getElementById('feedbackMessage').classList.add('hidden');
    document.getElementById('feedbackMessage').textContent = '';

    document.querySelectorAll('.option-button').forEach(button => {
        button.addEventListener('click', () => selectAnswer(Number(button.dataset.index)));
    });

    startTimer();
}

function selectAnswer(index) {
    if (quizState.answered) return;
    quizState.answered = true;
    stopTimer();

    const current = quizState.currentQuestions[quizState.questionIndex];
    const buttons = Array.from(document.querySelectorAll('.option-button'));
    const isCorrect = index === current.correctIndex;

    buttons.forEach((button, buttonIndex) => {
        button.disabled = true;
        if (buttonIndex === current.correctIndex) {
            button.classList.add('correct');
        }
        if (buttonIndex === index && buttonIndex !== current.correctIndex) {
            button.classList.add('incorrect');
        }
    });

    if (isCorrect) {
        quizState.performance.acertos += 1;
        quizState.performance.chapters[quizState.chapterKey].acertos += 1;
        showFeedback('Correto! Muito bem.', true);
    } else {
        quizState.performance.erros += 1;
        quizState.performance.chapters[quizState.chapterKey].erros += 1;
        showFeedback(`Errado! A resposta correta era: ${current.answers[current.correctIndex]}.`, false);
    }
    quizState.performance.total += 1;
    quizState.performance.chapters[quizState.chapterKey].total += 1;
    savePerformance();
    document.getElementById('nextButton').disabled = false;
}

function showFeedback(message, isCorrect) {
    const feedbackElement = document.getElementById('feedbackMessage');
    feedbackElement.textContent = message;
    feedbackElement.classList.remove('hidden', 'correct', 'incorrect');
    feedbackElement.classList.add(isCorrect ? 'correct' : 'incorrect');
}

function handleNextClick() {
    if (!quizState.answered) return;

    if (quizState.questionIndex === quizState.currentQuestions.length - 1) {
        showChapterSelection();
        return;
    }

    quizState.questionIndex += 1;
    renderQuestion();
}

function startTimer() {
    const timerDisplay = document.getElementById('timerDisplay');
    timerDisplay.textContent = quizState.timer;

    quizState.timerId = setInterval(() => {
        quizState.timer -= 1;
        timerDisplay.textContent = quizState.timer;

        if (quizState.timer <= 0) {
            clearInterval(quizState.timerId);
            handleTimeout();
        }
    }, 1000);
}

function stopTimer() {
    if (quizState.timerId) {
        clearInterval(quizState.timerId);
        quizState.timerId = null;
    }
}

function handleTimeout() {
    if (quizState.answered) return;
    quizState.answered = true;

    const current = quizState.currentQuestions[quizState.questionIndex];
    const buttons = Array.from(document.querySelectorAll('.option-button'));
    buttons.forEach((button, index) => {
        button.disabled = true;
        if (index === current.correctIndex) {
            button.classList.add('correct');
        }
    });

    quizState.performance.erros += 1;
    quizState.performance.total += 1;
    quizState.performance.chapters[quizState.chapterKey].erros += 1;
    quizState.performance.chapters[quizState.chapterKey].total += 1;
    savePerformance();
    showFeedback(`Tempo esgotado! A resposta correta era: ${current.answers[current.correctIndex]}.`, false);
    document.getElementById('nextButton').disabled = false;
}

function showChapterSelection() {
    stopTimer();
    document.getElementById('quizScreen').classList.add('hidden');
    document.getElementById('chapterSelection').classList.remove('hidden');
}

window.addEventListener('DOMContentLoaded', initQuiz);

/* ========================================
   QUIZ.JS - Sistema de Quizzes
   ======================================== */

const QUIZ_STORAGE_KEY = 'play_game_dev_quiz_performance';

const quizData = [
    {
        id: 'quiz-001',
        title: 'Conceitos Básicos do Desenvolvimento de Jogos',
        level: 'Iniciante',
        questions: [
            {
                id: 'q1',
                question: 'O que é um "Sprite" no desenvolvimento de jogos?',
                media: '',
                options: [
                    'Um efeito de som',
                    'Um objeto gráfico 2D que representa personagens ou itens',
                    'Um tipo de variável',
                    'Um layout do jogo'
                ],
                correctAnswer: 1,
                explanation: 'Um Sprite é um objeto gráfico 2D usado para representar personagens, itens e elementos visuais no jogo.'
            },
            {
                id: 'q2',
                question: 'Qual é a estrutura básica de um evento?',
                media: '',
                options: [
                    'Apenas ações',
                    'Apenas condições',
                    'Condições e ações',
                    'Variáveis e expressões'
                ],
                correctAnswer: 2,
                explanation: 'Um evento combina condições (quando) e ações (o que deve acontecer).'
            },
            {
                id: 'q3',
                question: 'Qual cor normalmente representa uma opção correta no quiz?',
                media: '',
                options: ['Vermelho', 'Azul', 'Verde', 'Amarelo'],
                correctAnswer: 2,
                explanation: 'No estilo Kahoot, o verde é frequentemente usado para indicar a resposta correta.'
            },
            {
                id: 'q4',
                question: 'Como você salva o desempenho do usuário no navegador?',
                media: '',
                options: ['XML', 'localStorage', 'Cookies apenas', 'Banco de dados externo'],
                correctAnswer: 1,
                explanation: 'O localStorage permite salvar dados simples no navegador e recuperá-los mesmo após fechar a aba.'
            }
        ]
    },
    {
        id: 'quiz-002',
        title: 'Variáveis e Lógica',
        level: 'Intermediário',
        questions: [
            {
                id: 'q1',
                question: 'O que é uma variável?',
                media: '',
                options: ['Uma função', 'Um valor que pode mudar', 'Um tipo de gráfico', 'Um botão'],
                correctAnswer: 1,
                explanation: 'Uma variável é um lugar onde você armazena dados que podem mudar durante a execução do programa.'
            },
            {
                id: 'q2',
                question: 'Qual operador é usado para testar igualdade?',
                media: '',
                options: ['+', '-', '==', '*'],
                correctAnswer: 2,
                explanation: 'O operador == é usado para comparar valores e verificar se são iguais.'
            },
            {
                id: 'q3',
                question: 'Qual estrutura de decisão permite executar código apenas quando uma condição é verdadeira?',
                media: '',
                options: ['Loop', 'Condição if', 'Função', 'Variável'],
                correctAnswer: 1,
                explanation: 'O if executa um bloco de código somente se a condição for verdadeira.'
            },
            {
                id: 'q4',
                question: 'Qual dessas opções representa um operador lógico?',
                media: '',
                options: ['+', '&&', '!=', '0'],
                correctAnswer: 1,
                explanation: '&& é um operador lógico que combina duas condições.'
            }
        ]
    },
    {
        id: 'quiz-003',
        title: 'Sistemas Avançados',
        level: 'Avançado',
        questions: [
            {
                id: 'q1',
                question: 'O que é um loop infinito?',
                media: '',
                options: ['Execução única', 'Repetição sem fim', 'Função matemática', 'Gráfico de desempenho'],
                correctAnswer: 1,
                explanation: 'Um loop infinito continua repetindo enquanto não for interrompido.'
            },
            {
                id: 'q2',
                question: 'Qual elemento ajuda a controlar a velocidade de um jogo?',
                media: '',
                options: ['Delta time', 'Sprite', 'Som', 'Link'],
                correctAnswer: 0,
                explanation: 'Delta time ajusta o tempo de execução para manter movimentos uniformes.'
            },
            {
                id: 'q3',
                question: 'Qual técnica reduz o processamento durante o jogo?',
                media: '',
                options: ['Overclock', 'Otimização', 'Duplicação de assets', 'Compressão de áudio'],
                correctAnswer: 1,
                explanation: 'Otimização é usada para tornar o jogo mais leve e rápido.'
            },
            {
                id: 'q4',
                question: 'O que é depuração (debug)?',
                media: '',
                options: ['Salvar jogo', 'Encontrar e corrigir erros', 'Criar arte', 'Adicionar som'],
                correctAnswer: 1,
                explanation: 'Depuração consiste em encontrar e corrigir erros no código.'
            }
        ]
    }
];

const quizState = {
    currentQuiz: null,
    currentQuestionIndex: 0,
    answered: false,
    timerId: null,
    timeRemaining: 15,
    correct: 0,
    wrong: 0,
    totalAnswered: 0,
    performance: Storage.get(QUIZ_STORAGE_KEY, { correct: 0, wrong: 0, total: 0, history: [] })
};

function initQuizPage() {
    updateUserDisplay();
    loadProfilePicture();
    renderQuizSelection();
    updateStatusPills();
}

function renderQuizSelection() {
    const list = document.querySelector('.quizzes-list');
    list.innerHTML = quizData.map(quiz => `
        <div class="quiz-card" onclick="startQuiz('${quiz.id}')">
            <div class="quiz-icon">${quiz.id === 'quiz-001' ? '⭐' : quiz.id === 'quiz-002' ? '🎯' : '🚀'}</div>
            <h3>${quiz.title}</h3>
            <p class="quiz-level">${quiz.level} • ${quiz.questions.length} perguntas</p>
        </div>
    `).join('');
}

function startQuiz(quizId) {
    const selectedQuiz = quizData.find(quiz => quiz.id === quizId);
    if (!selectedQuiz) return;

    quizState.currentQuiz = selectedQuiz;
    quizState.currentQuestionIndex = 0;
    quizState.answered = false;
    quizState.correct = 0;
    quizState.wrong = 0;
    quizState.totalAnswered = 0;
    quizState.timeRemaining = 15;

    document.getElementById('quizSelection').style.display = 'none';
    document.getElementById('quizPlaying').style.display = 'block';
    document.getElementById('quizResults').style.display = 'none';

    document.getElementById('questionTotal').textContent = selectedQuiz.questions.length;
    document.getElementById('nextQuestionBtn').textContent = 'Próxima';

    renderQuestion();
}

function renderQuestion() {
    stopTimer();
    quizState.answered = false;
    quizState.timeRemaining = 15;

    const question = quizState.currentQuiz.questions[quizState.currentQuestionIndex];
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('questionNumber').textContent = quizState.currentQuestionIndex + 1;
    document.getElementById('feedbackMessage').textContent = 'Selecione a alternativa correta.';
    document.getElementById('feedbackMessage').className = 'feedback-message';
    document.getElementById('nextQuestionBtn').disabled = true;

    const mediaElement = document.getElementById('questionMedia');
    if (question.media) {
        mediaElement.innerHTML = `<img src="${question.media}" alt="Imagem da pergunta">`;
        mediaElement.style.display = 'block';
    } else {
        mediaElement.innerHTML = '';
        mediaElement.style.display = 'none';
    }

    const optionsGrid = document.getElementById('optionsGrid');
    optionsGrid.innerHTML = question.options.map((option, index) => `
        <button type="button" class="option-button option-${index}" onclick="selectOption(${index})">
            <span class="option-label">${String.fromCharCode(65 + index)}</span>
            <span>${option}</span>
        </button>
    `).join('');

    if (quizState.currentQuestionIndex === quizState.currentQuiz.questions.length - 1) {
        document.getElementById('nextQuestionBtn').textContent = 'Ver Resultado';
    } else {
        document.getElementById('nextQuestionBtn').textContent = 'Próxima';
    }

    startTimer();
    updateStatusPills();
}

function selectOption(optionIndex) {
    if (quizState.answered) return;
    quizState.answered = true;
    stopTimer();

    const question = quizState.currentQuiz.questions[quizState.currentQuestionIndex];
    const buttons = Array.from(document.querySelectorAll('.option-button'));
    const selectedButton = buttons[optionIndex];
    const correctButton = buttons[question.correctAnswer];
    const isCorrect = optionIndex === question.correctAnswer;

    buttons.forEach(button => button.disabled = true);
    selectedButton.classList.add(isCorrect ? 'correct' : 'incorrect');
    correctButton.classList.add('correct');

    if (isCorrect) {
        quizState.correct += 1;
        showFeedback(true, 'Resposta correta! 🎉');
    } else {
        quizState.wrong += 1;
        showFeedback(false, 'Resposta incorreta. Tente na próxima!');
    }

    quizState.totalAnswered += 1;
    progressManager.recordQuizAnswer(quizState.currentQuiz.id, question.id, optionIndex, isCorrect);
    updateStatusPills();
    document.getElementById('nextQuestionBtn').disabled = false;
}

function handleTimeout() {
    if (quizState.answered) return;
    quizState.answered = true;
    const question = quizState.currentQuiz.questions[quizState.currentQuestionIndex];
    const buttons = Array.from(document.querySelectorAll('.option-button'));
    const correctButton = buttons[question.correctAnswer];

    buttons.forEach(button => button.disabled = true);
    correctButton.classList.add('correct');
    quizState.wrong += 1;
    quizState.totalAnswered += 1;
    progressManager.recordQuizAnswer(quizState.currentQuiz.id, question.id, -1, false);
    showFeedback(false, 'Tempo esgotado!');
    document.getElementById('nextQuestionBtn').disabled = false;
}

function nextQuestion() {
    if (!quizState.answered && quizState.timeRemaining > 0) return;

    if (quizState.currentQuestionIndex === quizState.currentQuiz.questions.length - 1) {
        showResults();
        return;
    }

    quizState.currentQuestionIndex += 1;
    renderQuestion();
}

function showResults() {
    stopTimer();
    document.getElementById('quizPlaying').style.display = 'none';
    document.getElementById('quizResults').style.display = 'block';

    const totalQuestions = quizState.currentQuiz.questions.length;
    const percentage = totalQuestions ? Math.round((quizState.correct / totalQuestions) * 100) : 0;

    document.getElementById('resultCorrect').textContent = quizState.correct;
    document.getElementById('resultWrong').textContent = quizState.wrong;
    document.getElementById('resultTotal').textContent = totalQuestions;
    document.getElementById('resultPercentage').textContent = `${percentage}%`;
    document.getElementById('resultSubtitle').textContent = percentage >= 70 ? 'Excelente trabalho! Continue assim.' : 'Ótimo esforço! Pratique mais e melhore sua pontuação.';

    progressManager.recordQuizAttempt(quizState.currentQuiz.id, quizState.correct, totalQuestions);
}

function goBackToSelection() {
    stopTimer();
    document.getElementById('quizResults').style.display = 'none';
    document.getElementById('quizPlaying').style.display = 'none';
    document.getElementById('quizSelection').style.display = 'block';
}

function cancelQuiz() {
    stopTimer();
    document.getElementById('quizPlaying').style.display = 'none';
    document.getElementById('quizResults').style.display = 'none';
    document.getElementById('quizSelection').style.display = 'block';
}

function showFeedback(isCorrect, message) {
    const feedback = document.getElementById('feedbackMessage');
    feedback.textContent = message;
    feedback.className = `feedback-message ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`;
}

function startTimer() {
    stopTimer();
    quizState.timeRemaining = 15;
    document.getElementById('timerDisplay').textContent = quizState.timeRemaining;
    quizState.timerId = setInterval(() => {
        quizState.timeRemaining -= 1;
        document.getElementById('timerDisplay').textContent = quizState.timeRemaining;
        if (quizState.timeRemaining <= 0) {
            stopTimer();
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

function updateStatusPills() {
    document.getElementById('quizCorrect').textContent = quizState.correct;
    document.getElementById('quizWrong').textContent = quizState.wrong;
}

function loadProfilePicture() {
    const savedPic = localStorage.getItem('userProfilePic');
    if (savedPic) {
        document.getElementById('profilePic').src = savedPic;
    }
}

function updateUserDisplay() {
    const userName = progressManager.getUserName();
    document.getElementById('userName').textContent = userName;
}

document.addEventListener('DOMContentLoaded', function() {
    initQuizPage();
});


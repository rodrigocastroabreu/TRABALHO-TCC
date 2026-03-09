/* ========================================
   QUIZ.JS - Sistema de Quizzes
   ======================================== */

class QuizzesManager {
    constructor() {
        this.quizzes = [];
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
    }

    async loadQuizzes() {
        try {
            this.initializeQuizzes();
            return this.quizzes;
        } catch (error) {
            console.error('Erro ao carregar quizzes', error);
            return [];
        }
    }

    initializeQuizzes() {
        this.quizzes = [
            {
                id: 'quiz-001',
                title: 'Conceitos Básicos do Desenvolvimento de Jogos',
                level: 'Iniciante',
                description: 'Teste seu conhecimento sobre os fundamentos do Desenvolvimento de Jogos',
                questions: [
                    {
                        id: 'q1',
                        question: 'O que é um "Sprite" no Desenvolvimento de Jogos?',
                        options: ['Um efeito de som', 'Um objeto gráfico 2D', 'Um tipo de variável', 'Um layout do jogo'],
                        correctAnswer: 1,
                        explanation: 'Um Sprite é um objeto gráfico 2D que representa personagens e itens.'
                    },
                    {
                        id: 'q2',
                        question: 'Qual é a estrutura básica de um evento?',
                        options: ['Apenas ações', 'Apenas condições', 'Condições e Ações', 'Variáveis'],
                        correctAnswer: 2,
                        explanation: 'Um evento consiste em Condições (quando) e Ações (o que fazer).'
                    }
                ]
            }
        ];
    }

    getQuiz(quizId) {
        return this.quizzes.find(q => q.id === quizId);
    }

    startQuiz(quizId) {
        const quiz = this.getQuiz(quizId);
        if (quiz) {
            this.currentQuiz = quiz;
            this.currentQuestionIndex = 0;
            this.userAnswers = new Array(quiz.questions.length).fill(-1);
            return quiz;
        }
        return null;
    }

    getCurrentQuestion() {
        if (this.currentQuiz && this.currentQuestionIndex < this.currentQuiz.questions.length) {
            return this.currentQuiz.questions[this.currentQuestionIndex];
        }
        return null;
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.currentQuiz.questions.length - 1) {
            this.currentQuestionIndex++;
            return true;
        }
        return false;
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            return true;
        }
        return false;
    }

    setAnswer(answerIndex) {
        this.userAnswers[this.currentQuestionIndex] = answerIndex;
    }

    submitQuiz() {
        if (!this.currentQuiz) return null;

        let correctCount = 0;
        const details = [];

        this.currentQuiz.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;

            if (isCorrect) {
                correctCount++;
            }

            details.push({
                questionId: question.id,
                question: question.question,
                userAnswer: userAnswer,
                correctAnswer: question.correctAnswer,
                isCorrect: isCorrect,
                explanation: question.explanation
            });
        });

        const result = {
            quizId: this.currentQuiz.id,
            quizTitle: this.currentQuiz.title,
            score: correctCount,
            totalQuestions: this.currentQuiz.questions.length,
            percentage: Math.round((correctCount / this.currentQuiz.questions.length) * 100),
            pass: correctCount / this.currentQuiz.questions.length >= 0.6,
            details: details,
            completedAt: new Date().toISOString()
        };

        progressManager.recordQuizAttempt(this.currentQuiz.id, correctCount, this.currentQuiz.questions.length);
        return result;
    }
}

const quizzesManager = new QuizzesManager();

document.addEventListener('DOMContentLoaded', async function() {
    await quizzesManager.loadQuizzes();
});


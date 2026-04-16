// progresso.js - Sistema completo de progresso do usu�rio com RPG e analytics

// Sistema de dados do usu�rio (preparado para futura integra��o com Supabase)
class UserProgressManager {
    constructor() {
        this.userData = this.loadUserData();
        this.initializeData();
    }

    loadUserData() {
        // Carregar dados do localStorage (futuramente ser� do banco de dados)
        const savedData = localStorage.getItem('userProgressData');
        return savedData ? JSON.parse(savedData) : null;
    }

    saveUserData() {
        localStorage.setItem('userProgressData', JSON.stringify(this.userData));
    }

    initializeData() {
        if (!this.userData) {
            this.userData = {
                profile: {
                    name: 'Aprendiz',
                    level: 1,
                    xp: 0,
                    xpToNext: 100,
                    totalPoints: 0,
                    avatar: '../images/default-profile.svg'
                },
                performance: {
                    quizCorrect: 0,
                    quizWrong: 0,
                    quizAccuracy: 0,
                    quizCompleted: 0,
                    exercisesCompleted: 0,
                    exerciseAvgTime: 0,
                    exerciseAvgScore: 0,
                    exerciseBestScore: 0
                },
                satisfaction: {
                    topics: [
                        { name: 'O que é Teoria dos Jogos', rating: 0 },
                        { name: 'Jogadores', rating: 0 },
                        { name: 'Estratégias', rating: 0 },
                        { name: 'Payoff (Recompensa)', rating: 0 },
                        { name: 'Equilíbrio de Nash', rating: 0 },
                        { name: 'Jogos Cooperativos vs Não Cooperativos', rating: 0 },
                        { name: 'Dilema do Prisioneiro', rating: 0 },
                        { name: 'Jogos de Soma Zero', rating: 0 }
                    ]
                },
                achievements: [
                    { id: 'first_quiz', name: 'Primeiro Quiz', description: 'Complete seu primeiro quiz', icon: '🎯', unlocked: false },
                    { id: 'accuracy_master', name: 'Mestre da Precisão', description: 'Alcance 90% de acerto', icon: '🎯', unlocked: false },
                    { id: 'speed_demon', name: 'Herói da Velocidade', description: 'Complete um exercício em menos de 5 min', icon: '⚡', unlocked: false },
                    { id: 'perfectionist', name: 'Perfeccionista', description: 'Complete 5 exercícios com 100%', icon: '💎', unlocked: false },
                    { id: 'explorer', name: 'Explorador', description: 'Visite todos os tópicos', icon: '🗺️', unlocked: false },
                    { id: 'rpg_master', name: 'Mestre RPG', description: 'Alcance nível 10', icon: '🎮', unlocked: false },
                    { id: 'first_exercise', name: 'Primeiro Exercício', description: 'Complete seu primeiro exercício prático', icon: '📝', unlocked: false },
                    { id: 'quiz_warrior', name: 'Guerreiro de Quizzes', description: 'Complete 10 quizzes', icon: '⚔️', unlocked: false },
                    { id: 'century', name: 'Centenário', description: 'Acumule 100 pontos', icon: '💯', unlocked: false },
                    { id: 'level_5', name: 'Ascensão', description: 'Alcance nível 5', icon: '⬆️', unlocked: false },
                    { id: 'consistency', name: 'Consistência', description: 'Mude de nível 3 vezes', icon: '🔄', unlocked: false },
                    { id: 'theory_master', name: 'Teórico', description: 'Domine Teoria dos Jogos', icon: '🧠', unlocked: false },
                    { id: 'speed_runner', name: 'Speed Runner', description: 'Complete 3 exercícios em menos de 10 min cada', icon: '🏃', unlocked: false },
                    { id: 'satisfaction_guru', name: 'Guru da Satisfação', description: 'Avalie todos os 8 tópicos', icon: '⭐', unlocked: false },
                    { id: 'combo_master', name: 'Mestre do Combo', description: 'Acerte 5 quizzes consecutivos', icon: '🔥', unlocked: false },
                    { id: 'resilient', name: 'Resiliente', description: 'Mude de nível após errar vários exercícios', icon: '🛡️', unlocked: false },
                    { id: 'all_star', name: 'Cada Um uma Estrela', description: 'Avalie algum tópico com 5 estrelas', icon: '🌟', unlocked: false },
                    { id: 'first_blood', name: 'First Blood', description: 'Seja o primeiro a completar um capítulo', icon: '🩸', unlocked: false },
                    { id: 'legend_status', name: 'Status de Lenda', description: 'Alcance nível 15', icon: '👑', unlocked: false },
                    { id: 'eternal_learner', name: 'Aprendiz Eterno', description: 'Complete 50 exercícios', icon: '📚', unlocked: false },
                    { id: 'achievement_collector', name: 'Colecionador de Conquistas', description: 'Desbloqueie 15 conquistas', icon: '🏆', unlocked: false },
                    { id: 'hall_of_fame', name: 'Galeria da Fama', description: 'Desbloqueie 20 conquistas', icon: '🎖️', unlocked: false },
                    { id: 'git_master', name: 'Mestre do Git', description: 'Faça commit e push do seu projeto', icon: '🚀', unlocked: false }
                ],
                charts: {
                    progressOverTime: [],
                    chapterData: []
                }
            };
        }
        
        // Ensure satisfaction exists for backward compatibility
        if (!this.userData.satisfaction || !this.userData.satisfaction.topics) {
            this.userData.satisfaction = {
                topics: [
                    { name: 'O que é Teoria dos Jogos', rating: 0 },
                    { name: 'Jogadores', rating: 0 },
                    { name: 'Estratégias', rating: 0 },
                    { name: 'Payoff (Recompensa)', rating: 0 },
                    { name: 'Equilíbrio de Nash', rating: 0 },
                    { name: 'Jogos Cooperativos vs Não Cooperativos', rating: 0 },
                    { name: 'Dilema do Prisioneiro', rating: 0 },
                    { name: 'Jogos de Soma Zero', rating: 0 }
                ]
            };
        }
        
        // Migrate achievements from satisfaction to userData if they exist there
        if (this.userData.satisfaction.achievements && !this.userData.achievements) {
            this.userData.achievements = this.userData.satisfaction.achievements;
            delete this.userData.satisfaction.achievements; // Clean up old location
        }
        
        // Ensure achievements exist
        if (!this.userData.achievements || this.userData.achievements.length === 0) {
            this.userData.achievements = [
                { id: 'first_quiz', name: 'Primeiro Quiz', description: 'Complete seu primeiro quiz', icon: '🎯', unlocked: false },
                { id: 'accuracy_master', name: 'Mestre da Precisão', description: 'Alcance 90% de acerto', icon: '🎯', unlocked: false },
                { id: 'speed_demon', name: 'Herói da Velocidade', description: 'Complete um exercício em menos de 5 min', icon: '⚡', unlocked: false },
                { id: 'perfectionist', name: 'Perfeccionista', description: 'Complete 5 exercícios com 100%', icon: '💎', unlocked: false },
                { id: 'explorer', name: 'Explorador', description: 'Visite todos os tópicos', icon: '🗺️', unlocked: false },
                { id: 'rpg_master', name: 'Mestre RPG', description: 'Alcance nível 10', icon: '🎮', unlocked: false },
                { id: 'first_exercise', name: 'Primeiro Exercício', description: 'Complete seu primeiro exercício prático', icon: '📝', unlocked: false },
                { id: 'quiz_warrior', name: 'Guerreiro de Quizzes', description: 'Complete 10 quizzes', icon: '⚔️', unlocked: false },
                { id: 'century', name: 'Centenário', description: 'Acumule 100 pontos', icon: '💯', unlocked: false },
                { id: 'level_5', name: 'Ascensão', description: 'Alcance nível 5', icon: '⬆️', unlocked: false },
                { id: 'consistency', name: 'Consistência', description: 'Mude de nível 3 vezes', icon: '🔄', unlocked: false },
                { id: 'theory_master', name: 'Teórico', description: 'Domine Teoria dos Jogos', icon: '🧠', unlocked: false },
                { id: 'speed_runner', name: 'Speed Runner', description: 'Complete 3 exercícios em menos de 10 min cada', icon: '🏃', unlocked: false },
                { id: 'satisfaction_guru', name: 'Guru da Satisfação', description: 'Avalie todos os 8 tópicos', icon: '⭐', unlocked: false },
                { id: 'combo_master', name: 'Mestre do Combo', description: 'Acerte 5 quizzes consecutivos', icon: '🔥', unlocked: false },
                { id: 'resilient', name: 'Resiliente', description: 'Mude de nível após errar vários exercícios', icon: '🛡️', unlocked: false },
                { id: 'all_star', name: 'Cada Um uma Estrela', description: 'Avalie algum tópico com 5 estrelas', icon: '🌟', unlocked: false },
                { id: 'first_blood', name: 'First Blood', description: 'Seja o primeiro a completar um capítulo', icon: '🩸', unlocked: false },
                { id: 'legend_status', name: 'Status de Lenda', description: 'Alcance nível 15', icon: '👑', unlocked: false },
                { id: 'eternal_learner', name: 'Aprendiz Eterno', description: 'Complete 50 exercícios', icon: '📚', unlocked: false },
                { id: 'achievement_collector', name: 'Colecionador de Conquistas', description: 'Desbloqueie 15 conquistas', icon: '🏆', unlocked: false },
                { id: 'hall_of_fame', name: 'Galeria da Fama', description: 'Desbloqueie 20 conquistas', icon: '🎖️', unlocked: false },
                { id: 'git_master', name: 'Mestre do Git', description: 'Faça commit e push do seu projeto', icon: '🚀', unlocked: false }
            ];
        }
    }
                            { date: '2024-03-15', score: 0 }
                        ],
                        chapterData: {
                            'Teoria dos Jogos': { correct: 0, total: 0, percentage: 0 },
                            'Jogadores': { correct: 0, total: 0, percentage: 0 },
                            'Estrat�gias': { correct: 0, total: 0, percentage: 0 },
                            'Payoff': { correct: 0, total: 0, percentage: 0 },
                            'Equil�brio de Nash': { correct: 0, total: 0, percentage: 0 },
                            'Jogos Cooperativos': { correct: 0, total: 0, percentage: 0 },
                            'Dilema do Prisioneiro': { correct: 0, total: 0, percentage: 0 },
                            'Jogos de Soma Zero': { correct: 0, total: 0, percentage: 0 }
                        }
                    }
                };
            }
        }
        this.saveUserData();
    }

    // M�todos para atualizar dados
    updateQuizResults(correct, wrong, chapter) {
        this.userData.performance.quizCorrect += correct;
        this.userData.performance.quizWrong += wrong;
        this.userData.performance.quizCompleted += 1;

        // Atualizar cap�tulo
        if (!this.userData.charts.chapterData[chapter]) {
            this.userData.charts.chapterData[chapter] = { correct: 0, total: 0, percentage: 0 };
        }
        this.userData.charts.chapterData[chapter].correct += correct;
        this.userData.charts.chapterData[chapter].total += (correct + wrong);

        this.calculateMetrics();
        this.checkAchievements();
        this.saveUserData();
    }

    updateSatisfaction(topicIndex, rating) {
        if (this.userData.satisfaction.topics[topicIndex]) {
            this.userData.satisfaction.topics[topicIndex].rating = rating;
            this.saveUserData();
        }
    }

    updateExerciseResults(score, time) {
        this.userData.performance.exercisesCompleted += 1;
        this.userData.performance.exerciseAvgScore = Math.round(
            (this.userData.performance.exerciseAvgScore * (this.userData.performance.exercisesCompleted - 1) + score) /
            this.userData.performance.exercisesCompleted
        );
        this.userData.performance.exerciseBestScore = Math.max(this.userData.performance.exerciseBestScore, score);

        // Calcular tempo m�dio
        this.userData.performance.exerciseAvgTime = Math.round(
            (this.userData.performance.exerciseAvgTime * (this.userData.performance.exercisesCompleted - 1) + time) /
            this.userData.performance.exercisesCompleted
        );

        this.addXP(score * 10); // XP baseado na pontua��o
        this.checkAchievements();
        this.saveUserData();
    }

    addXP(amount) {
        this.userData.profile.xp += amount;
        this.userData.profile.totalPoints += amount;

        // Verificar level up
        while (this.userData.profile.xp >= this.userData.profile.xpToNext) {
            this.userData.profile.xp -= this.userData.profile.xpToNext;
            this.userData.profile.level += 1;
            this.userData.profile.xpToNext = this.userData.profile.level * 100;
        }

        this.saveUserData();
    }

    calculateMetrics() {
        const total = this.userData.performance.quizCorrect + this.userData.performance.quizWrong;
        this.userData.performance.quizAccuracy = total > 0 ? Math.round((this.userData.performance.quizCorrect / total) * 100) : 0;

        // Atualizar percentuais dos cap�tulos
        Object.keys(this.userData.charts.chapterData).forEach(chapter => {
            const data = this.userData.charts.chapterData[chapter];
            data.percentage = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
        });
    }

    checkAchievements() {
        // Primeiro Quiz (index 0)
        if (this.userData.performance.quizCompleted >= 1 && !this.userData.achievements[0].unlocked) {
            this.userData.achievements[0].unlocked = true;
        }

        // Mestre da Precis�o (index 1)
        if (this.userData.performance.quizAccuracy >= 90 && !this.userData.achievements[1].unlocked) {
            this.userData.achievements[1].unlocked = true;
        }

        // Her�i da Velocidade (index 2)
        if (this.userData.performance.exerciseAvgTime <= 5 && this.userData.performance.exercisesCompleted > 0 && !this.userData.achievements[2].unlocked) {
            this.userData.achievements[2].unlocked = true;
        }

        // Perfeccionista (index 3)
        if (this.userData.performance.exerciseBestScore >= 100 && !this.userData.achievements[3].unlocked) {
            this.userData.achievements[3].unlocked = true;
        }

        // Explorador (index 4)
        const filledTopics = this.userData.satisfaction.topics.filter(t => t.rating > 0).length;
        if (filledTopics === this.userData.satisfaction.topics.length && !this.userData.achievements[4].unlocked) {
            this.userData.achievements[4].unlocked = true;
        }

        // Mestre RPG (index 5)
        if (this.userData.profile.level >= 10 && !this.userData.achievements[5].unlocked) {
            this.userData.achievements[5].unlocked = true;
        }

        // Primeiro Exerc�cio (index 6)
        if (this.userData.performance.exercisesCompleted >= 1 && !this.userData.achievements[6].unlocked) {
            this.userData.achievements[6].unlocked = true;
        }

        // Guerreiro de Quizzes (index 7)
        if (this.userData.performance.quizCompleted >= 10 && !this.userData.achievements[7].unlocked) {
            this.userData.achievements[7].unlocked = true;
        }

        // Centen�rio (index 8)
        if (this.userData.profile.totalPoints >= 100 && !this.userData.achievements[8].unlocked) {
            this.userData.achievements[8].unlocked = true;
        }

        // Ascens�o (index 9)
        if (this.userData.profile.level >= 5 && !this.userData.achievements[9].unlocked) {
            this.userData.achievements[9].unlocked = true;
        }

        // Consist�ncia (index 10)
        if (this.userData.profile.level >= 3 && !this.userData.achievements[10].unlocked) {
            this.userData.achievements[10].unlocked = true;
        }

        // Te�rico (index 11)
        if (this.userData.performance.quizAccuracy >= 85 && this.userData.performance.quizCompleted >= 5 && !this.userData.achievements[11].unlocked) {
            this.userData.achievements[11].unlocked = true;
        }

        // Speed Runner (index 12)
        if (this.userData.performance.exerciseAvgTime <= 3 && this.userData.performance.exercisesCompleted >= 3 && !this.userData.achievements[12].unlocked) {
            this.userData.achievements[12].unlocked = true;
        }

        // Guru da Satisfa��o (index 13)
        if (filledTopics === 8 && !this.userData.achievements[13].unlocked) {
            this.userData.achievements[13].unlocked = true;
        }

        // Mestre do Combo (index 14)
        if (this.userData.performance.quizCompleted >= 5 && this.userData.performance.quizAccuracy >= 80 && !this.userData.achievements[14].unlocked) {
            this.userData.achievements[14].unlocked = true;
        }

        // Resiliente (index 15)
        if (this.userData.performance.quizWrong >= 5 && this.userData.profile.level >= 2 && !this.userData.achievements[15].unlocked) {
            this.userData.achievements[15].unlocked = true;
        }

        // Cada Um uma Estrela (index 16)
        const fiveStarTopics = this.userData.satisfaction.topics.filter(t => t.rating === 5).length;
        if (fiveStarTopics >= 1 && !this.userData.achievements[16].unlocked) {
            this.userData.achievements[16].unlocked = true;
        }

        // First Blood (index 17)
        if (this.userData.performance.quizCompleted >= 1 && this.userData.performance.quizAccuracy >= 80 && !this.userData.achievements[17].unlocked) {
            this.userData.achievements[17].unlocked = true;
        }

        // Status de Lenda (index 18)
        if (this.userData.profile.level >= 15 && !this.userData.achievements[18].unlocked) {
            this.userData.achievements[18].unlocked = true;
        }

        // Aprendiz Eterno (index 19)
        if (this.userData.performance.exercisesCompleted >= 50 && !this.userData.achievements[19].unlocked) {
            this.userData.achievements[19].unlocked = true;
        }

        // Colecionador de Conquistas (index 20)
        const unlockedCount = this.userData.achievements.filter(a => a.unlocked).length;
        if (unlockedCount >= 15 && !this.userData.achievements[20].unlocked) {
            this.userData.achievements[20].unlocked = true;
        }

        // Galeria da Fama (index 21)
        if (unlockedCount >= 20 && !this.userData.achievements[21].unlocked) {
            this.userData.achievements[21].unlocked = true;
        }

        // Mestre do Git (index 22)
        if (this.userData.achievements[22] && localStorage.getItem('gitCommitted') === 'true' && !this.userData.achievements[22].unlocked) {
            this.userData.achievements[22].unlocked = true;
        }

        this.saveUserData();
    }

    // Método para desbloquear conquista do Git
    unlockGitAchievement() {
        if (this.userData.achievements[22] && !this.userData.achievements[22].unlocked) {
            this.userData.achievements[22].unlocked = true;
            localStorage.setItem('gitCommitted', 'true');
            this.saveUserData();
            this.checkAchievements(); // Recheck to unlock collector if needed
        }
    }

    // M�todo para resetar todo o progresso
    resetProgress() {
        // Reset para dados padr�o
        this.userData = {
            profile: {
                name: 'Aprendiz',
                level: 1,
                xp: 0,
                xpToNext: 100,
                totalPoints: 0,
                avatar: '../images/default-profile.svg'
            },
            performance: {
                quizCorrect: 0,
                quizWrong: 0,
                quizAccuracy: 0,
                quizCompleted: 0,
                exercisesCompleted: 0,
                exerciseAvgTime: 0,
                exerciseAvgScore: 0,
                exerciseBestScore: 0
            },
            satisfaction: {
                topics: [
                    { name: 'O que � Teoria dos Jogos', rating: 0 },
                    { name: 'Jogadores', rating: 0 },
                    { name: 'Estrat�gias', rating: 0 },
                    { name: 'Payoff (Recompensa)', rating: 0 },
                    { name: 'Equil�brio de Nash', rating: 0 },
                    { name: 'Jogos Cooperativos vs N�o Cooperativos', rating: 0 },
                    { name: 'Dilema do Prisioneiro', rating: 0 },
                    { name: 'Jogos de Soma Zero', rating: 0 }
                ]
            },
            achievements: [
                { id: 'first_quiz', name: 'Primeiro Quiz', description: 'Complete seu primeiro quiz', icon: '??', unlocked: false },
                { id: 'accuracy_master', name: 'Mestre da Precis�o', description: 'Alcance 90% de acerto', icon: '??', unlocked: false },
                { id: 'speed_demon', name: 'Her�i da Velocidade', description: 'Complete um exerc�cio em menos de 5 min', icon: '?', unlocked: false },
                { id: 'perfectionist', name: 'Perfeccionista', description: 'Complete 5 exerc�cios com 100%', icon: '??', unlocked: false },
                { id: 'explorer', name: 'Explorador', description: 'Visite todos os t�picos', icon: '???', unlocked: false },
                { id: 'rpg_master', name: 'Mestre RPG', description: 'Alcance n�vel 10', icon: '??', unlocked: false },
                { id: 'first_exercise', name: 'Primeiro Exerc�cio', description: 'Complete seu primeiro exerc�cio pr�tico', icon: '?', unlocked: false },
                { id: 'quiz_warrior', name: 'Guerreiro de Quizzes', description: 'Complete 10 quizzes', icon: '??', unlocked: false },
                { id: 'century', name: 'Centen�rio', description: 'Acumule 100 pontos', icon: '??', unlocked: false },
                { id: 'level_5', name: 'Ascens�o', description: 'Alcance n�vel 5', icon: '??', unlocked: false },
                { id: 'consistency', name: 'Consist�ncia', description: 'Mude de n�vel 3 vezes', icon: '??', unlocked: false },
                { id: 'theory_master', name: 'Te�rico', description: 'Domine Teoria dos Jogos', icon: '??', unlocked: false },
                { id: 'speed_runner', name: 'Speed Runner', description: 'Complete 3 exerc�cios em menos de 10 min cada', icon: '??', unlocked: false },
                { id: 'satisfaction_guru', name: 'Guru da Satisfa��o', description: 'Avalie todos os 8 t�picos', icon: '?', unlocked: false },
                { id: 'combo_master', name: 'Mestre do Combo', description: 'Acerte 5 quizzes consecutivos', icon: '??', unlocked: false },
                { id: 'resilient', name: 'Resiliente', description: 'Mude de n�vel ap�s errar v�rios exerc�cios', icon: '??', unlocked: false },
                { id: 'all_star', name: 'Cada Um uma Estrela', description: 'Avalie algum t�pico com 5 estrelas', icon: '?', unlocked: false },
                { id: 'first_blood', name: 'First Blood', description: 'Seja o primeiro a completar um cap�tulo', icon: '??', unlocked: false },
                { id: 'legend_status', name: 'Status de Lenda', description: 'Alcance n�vel 15', icon: '??', unlocked: false },
                { id: 'eternal_learner', name: 'Aprendiz Eterno', description: 'Complete 50 exerc�cios', icon: '??', unlocked: false },
                { id: 'achievement_collector', name: 'Colecionador de Conquistas', description: 'Desbloqueie 15 conquistas', icon: '???', unlocked: false },
                { id: 'hall_of_fame', name: 'Galeria da Fama', description: 'Desbloqueie 20 conquistas', icon: '??', unlocked: false }
            ],
            charts: {
                progressOverTime: [
                    { date: '2024-01-01', score: 0 },
                    { date: '2024-01-15', score: 0 },
                    { date: '2024-02-01', score: 0 },
                    { date: '2024-02-15', score: 0 },
                    { date: '2024-03-01', score: 0 },
                    { date: '2024-03-15', score: 0 }
                ],
                chapterData: {
                    'Teoria dos Jogos': { correct: 0, total: 0, percentage: 0 },
                    'Jogadores': { correct: 0, total: 0, percentage: 0 },
                    'Estrat�gias': { correct: 0, total: 0, percentage: 0 },
                    'Payoff': { correct: 0, total: 0, percentage: 0 },
                    'Equil�brio de Nash': { correct: 0, total: 0, percentage: 0 },
                    'Jogos Cooperativos': { correct: 0, total: 0, percentage: 0 },
                    'Dilema do Prisioneiro': { correct: 0, total: 0, percentage: 0 },
                    'Jogos de Soma Zero': { correct: 0, total: 0, percentage: 0 }
                }
            }
        };

        // Salvar dados resetados
        this.saveUserData();

        console.log('Progresso resetado com sucesso');
    }
}

// Inst�ncia global do gerenciador
const userProgressManager = new UserProgressManager();
window.userProgressManager = userProgressManager;
// Fun��o principal de inicializa��o
function initializeProgressPage() {
    // Sync ratings from progressManager to userProgressManager
    syncRatingsFromProgressManager();
    updateSatisfactionDisplay();
    updatePerformanceMetrics();
    updateAchievements();
    initializeCharts();
}

// Atualizar perfil RPG
function updateRPGProfile() {
    const profile = userProgressManager.userData.profile;

    document.getElementById('playerName').textContent = profile.name;
    document.getElementById('playerLevel').textContent = profile.level;
    document.getElementById('xpFill').style.width = `${(profile.xp / profile.xpToNext) * 100}%`;
    document.getElementById('xpText').textContent = `${profile.xp} / ${profile.xpToNext} XP`;
    document.getElementById('totalPoints').textContent = profile.totalPoints;
    document.getElementById('missionsCompleted').textContent = userProgressManager.userData.performance.quizCompleted + userProgressManager.userData.performance.exercisesCompleted;
    document.getElementById('winStreak').textContent = calculateWinStreak();
}

// Calcular sequ�ncia de vit�rias (simplificado)
function calculateWinStreak() {
    // L�gica para calcular sequ�ncia baseada em desempenho recente
    return Math.min(userProgressManager.userData.performance.quizCompleted, 5);
}

// Sync ratings from progressManager to userProgressManager
function syncRatingsFromProgressManager() {
    if (progressManager.progress.topicRatings) {
        userProgressManager.userData.satisfaction.topics.forEach((topic, index) => {
            const topicId = `topico${index + 1}`;
            const savedRating = progressManager.progress.topicRatings[topicId]?.rating || 0;
            topic.rating = savedRating;
        });
        userProgressManager.saveUserData();
    }
}

// Atualizar display de satisfa��o
function updateSatisfactionDisplay() {
    const grid = document.getElementById('satisfactionGrid');
    grid.innerHTML = '';

    userProgressManager.userData.satisfaction.topics.forEach((topic, index) => {
        const item = document.createElement('div');
        item.className = 'satisfaction-item';

        const stars = createStarRating(topic.rating, index);

        item.innerHTML = `
            <h3>${topic.name}</h3>
            <div class="star-rating">
                ${stars}
            </div>
        `;

        grid.appendChild(item);
    });
}

// Criar estrelas para rating
function createStarRating(rating, topicIndex) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        const filled = i <= rating ? 'filled' : '';
        stars += `<span class="star ${filled}" onclick="rateTopic(${topicIndex}, ${i})">★</span>`;
    }
    return stars;
}

// Fun��o para avaliar t�pico
function rateTopic(index, rating) {
    progressManager.recordTopicRating(`topico${index + 1}`, rating);
    // Sync with userProgressManager
    userProgressManager.userData.satisfaction.topics[index].rating = rating;
    userProgressManager.saveUserData();
    // Check achievements after rating update
    userProgressManager.checkAchievements();
    updateSatisfactionDisplay();
}

// Atualizar m�tricas de performance
function updatePerformanceMetrics() {
    const perf = userProgressManager.userData.performance;

    document.getElementById('quizCorrect').textContent = perf.quizCorrect;
    document.getElementById('quizWrong').textContent = perf.quizWrong;
    document.getElementById('quizAccuracy').textContent = perf.quizAccuracy + '%';
    document.getElementById('quizCompleted').textContent = perf.quizCompleted;

    document.getElementById('exercisesCompleted').textContent = perf.exercisesCompleted;
    document.getElementById('exerciseAvgTime').textContent = perf.exerciseAvgTime + ' min';
    document.getElementById('exerciseAvgScore').textContent = perf.exerciseAvgScore;
    document.getElementById('exerciseBestScore').textContent = perf.exerciseBestScore;
}

// Atualizar conquistas
function updateAchievements() {
    const grid = document.getElementById('achievementsGrid');
    grid.innerHTML = '';

    userProgressManager.userData.achievements.forEach(achievement => {
        const item = document.createElement('div');
        item.className = `achievement-item ${achievement.unlocked ? 'unlocked' : ''}`;

        item.innerHTML = `
            <div class="icon">${achievement.icon}</div>
            <h4>${achievement.name}</h4>
            <p>${achievement.description}</p>
        `;

        grid.appendChild(item);
    });
}

// Inicializar gr�ficos
function initializeCharts() {
    createProgressChart();
    createChapterChart();
    createSatisfactionChart();
}

// Criar gr�fico de evolu��o do progresso
function createProgressChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    const data = userProgressManager.userData.charts.progressOverTime;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => new Date(d.date).toLocaleDateString()),
            datasets: [{
                label: 'Pontua��o ao Longo do Tempo',
                data: data.map(d => d.score),
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Criar gr�fico de desempenho por cap�tulo
function createChapterChart() {
    const ctx = document.getElementById('chapterChart').getContext('2d');
    const data = userProgressManager.userData.charts.chapterData;
    const chapters = Object.keys(data);
    const percentages = chapters.map(ch => data[ch].percentage);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chapters,
            datasets: [{
                label: 'Taxa de Acerto (%)',
                data: percentages,
                backgroundColor: 'rgba(102, 126, 234, 0.6)',
                borderColor: '#667eea',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true, max: 100 }
            }
        }
    });
}

// Criar gr�fico de satisfa��o
function createSatisfactionChart() {
    const ctx = document.getElementById('satisfactionChart').getContext('2d');
    const topics = userProgressManager.userData.satisfaction.topics;
    const ratings = topics.map(t => t.rating);

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: topics.map(t => t.name),
            datasets: [{
                data: ratings,
                backgroundColor: [
                    '#ffd93d', '#ff6b6b', '#4ecdc4', '#45b7d1',
                    '#96ceb4', '#ffeaa7'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// Fun��es de download para gr�ficos
function downloadChart(chartId) {
    const canvas = document.getElementById(chartId);
    const link = document.createElement('a');
    link.download = `${chartId}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

// Tornar fun��es globais para uso nos bot�es
window.downloadChart = downloadChart;
window.rateTopic = rateTopic;

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializeProgressPage);

// Fun��o para criar gr�fico de evolu��o do desempenho
function createProgressChart(data) {
    // Destruir gr�fico existente se houver
    if (window.progressChartInstance) {
        window.progressChartInstance.destroy();
    }

    const ctx = document.getElementById('progressChart').getContext('2d');
    const dates = data.progressOverTime.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
    });
    const scores = data.progressOverTime.map(item => item.score);

    window.progressChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Pontua��o M�dia',
                data: scores,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `Pontua��o: ${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 50,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#666'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#666'
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Fun��o para criar grid de detalhes por cap�tulo
function createChapterDetails(data) {
    const container = document.getElementById('chaptersGrid');
    container.innerHTML = '';

    Object.entries(data.chapterData).forEach(([chapter, stats]) => {
        const chapterCard = document.createElement('div');
        chapterCard.className = 'chapter-card';
        chapterCard.innerHTML = `
            <h4>${chapter}</h4>
            <div class="chapter-stats">
                <div class="stat">
                    <span class="stat-label">Acertos</span>
                    <span class="stat-value">${stats.correct}/${stats.total}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Taxa</span>
                    <span class="stat-value">${stats.percentage}%</span>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${stats.percentage}%"></div>
            </div>
        `;
        container.appendChild(chapterCard);
    });
}

// Fun��es de download
function downloadChart(chartId) {
    const canvas = document.getElementById(chartId);
    if (!canvas) {
        console.error('Canvas n�o encontrado:', chartId);
        return;
    }

    html2canvas(canvas, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `grafico-${chartId}-${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(error => {
        console.error('Erro ao gerar imagem:', error);
        alert('Erro ao baixar a imagem. Tente novamente.');
    });
}

// Fun��o de inicializa��o
function initProgressPage() {
    console.log('Inicializando p�gina de progresso...');

    // Carregar dados
    const data = loadProgressData();

    // Atualizar estat�sticas
    updateStats(data);

    // Criar gr�ficos
    createChapterChart(data);
    createProgressChart(data);

    // Criar detalhes dos cap�tulos
    createChapterDetails(data);

    console.log('P�gina de progresso inicializada com sucesso!');
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    initProgressPage();

    // Adicionar event listeners aos bot�es de download
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const chartId = this.getAttribute('data-chart');
            if (chartId) {
                downloadChart(chartId);
            }
        });
    });
});

// Exportar fun��es para uso global (se necess�rio)
window.ProgressPage = {
    init: initProgressPage,
    downloadChart: downloadChart
};

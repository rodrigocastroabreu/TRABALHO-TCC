/* ========================================
   PROGRESS.JS - Sistema de Progresso
   ======================================== */

/**
 * Gerenciador de Progresso
 */
class ProgressManager {
    constructor() {
        this.storageKey = 'construct3_academy_progress';
        this.progress = this.loadProgress();
    }

    loadProgress() {
        const data = Storage.get(this.storageKey, this.getDefaultProgress());
        return data;
    }

    getDefaultProgress() {
        return {
            userName: 'Aprendiz',
            createdAt: new Date().toISOString(),
            lastAccess: new Date().toISOString(),
            totalPoints: 0,
            level: 1,
            completedTutorials: {},
            completedExercises: {},
            quizAttempts: [],
            achievements: [],
            statistics: {
                tutorialsCompleted: 0,
                exercisesCompleted: 0,
                quizzesCompleted: 0,
                totalHours: 0,
                studyStreak: 0
            }
        };
    }

    save() {
        this.progress.lastAccess = new Date().toISOString();
        Storage.save(this.storageKey, this.progress);
    }

    setUserName(name) {
        this.progress.userName = name;
        this.save();
    }

    getUserName() {
        return this.progress.userName || 'Aprendiz';
    }

    completeTutorial(tutorialId, points = 10) {
        if (!this.progress.completedTutorials[tutorialId]) {
            this.progress.completedTutorials[tutorialId] = {
                completedAt: new Date().toISOString(),
                points: points
            };
            this.progress.totalPoints += points;
            this.progress.statistics.tutorialsCompleted++;
            this.calculateLevel();
            this.save();
        }
    }

    isTutorialCompleted(tutorialId) {
        return !!this.progress.completedTutorials[tutorialId];
    }

    completeExercise(exerciseId, points = 20) {
        if (!this.progress.completedExercises[exerciseId]) {
            this.progress.completedExercises[exerciseId] = {
                completedAt: new Date().toISOString(),
                points: points
            };
            this.progress.totalPoints += points;
            this.progress.statistics.exercisesCompleted++;
            this.calculateLevel();
            this.save();
        }
    }

    recordQuizAttempt(quizId, score, totalQuestions) {
        const attempt = {
            quizId: quizId,
            score: score,
            totalQuestions: totalQuestions,
            percentage: Math.round((score / totalQuestions) * 100),
            attemptedAt: new Date().toISOString()
        };
        
        this.progress.quizAttempts.push(attempt);
        const points = Math.round((attempt.percentage / 100) * 50);
        this.progress.totalPoints += points;
        this.progress.statistics.quizzesCompleted++;
        
        this.calculateLevel();
        this.save();
    }

    recordQuizAnswer(quizId, questionId, selectedIndex, isCorrect) {
        if (!this.progress.quizHistory) {
            this.progress.quizHistory = [];
        }

        this.progress.quizHistory.push({
            quizId: quizId,
            questionId: questionId,
            selectedIndex: selectedIndex,
            isCorrect: isCorrect,
            attemptedAt: new Date().toISOString()
        });

        const historyLength = this.progress.quizHistory.length;
        this.progress.statistics.totalQuestionsAnswered = historyLength;
        this.save();
    }

    getQuizStatistics() {
        const attempts = this.progress.quizAttempts || [];
        const totalAnswers = this.progress.statistics.totalQuestionsAnswered || 0;
        const correctAnswers = (this.progress.quizHistory || []).filter(entry => entry.isCorrect).length;
        const wrongAnswers = totalAnswers - correctAnswers;
        const successRate = totalAnswers ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

        return {
            attempts,
            totalAnswers,
            correctAnswers,
            wrongAnswers,
            successRate,
            history: this.progress.quizHistory || []
        };
    }

    getQuizHistory() {
        return this.progress.quizHistory || [];
    }

    recordTopicRating(topicId, rating) {
        if (!this.progress.topicRatings) {
            this.progress.topicRatings = {};
        }

        this.progress.topicRatings[topicId] = {
            rating: rating,
            ratedAt: new Date().toISOString()
        };

        // Também marquem o tutorial como concluído ao avaliar (se ainda não estiver)
        this.completeTutorial(topicId, 10);

        this.save();

        // Atualizar snapshot global (por exemplo para comparativos de plataformas / TCC)
        const globalRecord = {
            userName: this.getUserName(),
            totalPoints: this.getTotalPoints(),
            completedTutorials: this.getCompletedCount(),
            averageRating: this.getAverageRating(),
            level: this.getLevel(),
            lastUpdate: new Date().toISOString()
        };

        this.addGlobalRecord(globalRecord);
    }

    getTopicRating(topicId) {
        if (!this.progress.topicRatings) return null;
        return this.progress.topicRatings[topicId]?.rating || null;
    }

    getTopicRatings() {
        return this.progress.topicRatings || {};
    }

    getAverageRating() {
        const ratings = this.getTopicRatings();
        const topicIds = Object.keys(ratings);
        if (topicIds.length === 0) return 0;

        const total = topicIds.reduce((sum, topicId) => sum + (ratings[topicId].rating || 0), 0);
        return parseFloat((total / topicIds.length).toFixed(2));
    }

    getStudyDays() {
        const createdAt = new Date(this.progress.createdAt);
        const now = new Date();
        const diff = now - createdAt;
        const days = Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)) + 1);
        return days;
    }

    calculateLevel() {
        this.progress.level = Math.floor(this.progress.totalPoints / 150) + 1;
    }

    getLevel() {
        return this.progress.level;
    }

    getTotalPoints() {
        return this.progress.totalPoints;
    }

    getCompletedCount() {
        return this.progress.statistics.tutorialsCompleted;
    }

    getStatistics() {
        return {
            ...this.progress.statistics,
            totalPoints: this.progress.totalPoints,
            level: this.progress.level,
            userName: this.progress.userName
        };
    }

    getGlobalRecords() {
        let records = Storage.get('globalProgressRecords', []);
        if (!Array.isArray(records)) {
            records = [];
        }

        if (records.length === 0) {
            records = [
                { userName: 'Aluno 1', totalPoints: 520, completedTutorials: 8, averageRating: 4.8, level: 4, lastUpdate: new Date().toISOString() },
                { userName: 'Aluno 2', totalPoints: 410, completedTutorials: 7, averageRating: 4.3, level: 3, lastUpdate: new Date().toISOString() },
                { userName: 'Aluno 3', totalPoints: 335, completedTutorials: 6, averageRating: 4.1, level: 3, lastUpdate: new Date().toISOString() }
            ];
            Storage.save('globalProgressRecords', records);
        }

        return records;
    }

    addGlobalRecord(record) {
        const records = this.getGlobalRecords();
        const index = records.findIndex(r => r.userName === record.userName);
        if (index === -1) {
            records.push(record);
        } else {
            records[index] = record;
        }
        Storage.save('globalProgressRecords', records);
    }

    getGlobalAverages() {
        const records = this.getGlobalRecords();
        if (records.length === 0) {
            return {
                averagePoints: 0,
                averageCompletedTutorials: 0,
                averageRating: 0,
                students: 0
            };
        }
        const totalPoints = records.reduce((sum, r) => sum + (r.totalPoints || 0), 0);
        const completedTutorials = records.reduce((sum, r) => sum + (r.completedTutorials || 0), 0);
        const ratings = records.reduce((sum, r) => sum + (r.averageRating || 0), 0);
        const count = records.length;
        return {
            averagePoints: (totalPoints / count).toFixed(1),
            averageCompletedTutorials: (completedTutorials / count).toFixed(1),
            averageRating: (ratings / count).toFixed(2),
            students: count
        };
    }

    resetProgress() {
        this.progress = this.getDefaultProgress();
        Storage.remove(this.storageKey);
    }

    exportProgress() {
        const dataStr = JSON.stringify(this.progress, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `construct3_progress_${Date.now()}.json`;
        link.click();
    }

    importProgress(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.progress = data;
                this.save();
            } catch (error) {
                console.error('Erro ao importar progresso', error);
            }
        };
        reader.readAsText(file);
    }
}

const progressManager = new ProgressManager();

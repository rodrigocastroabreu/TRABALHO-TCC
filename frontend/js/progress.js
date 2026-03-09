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

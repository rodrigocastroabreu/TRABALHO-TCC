// ======================================
// PERFIL.JS - Profile Page Functionality
// ======================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize profile data and picture
    loadProfileData();
    loadProfilePicture();
    loadAchievements();
});

function loadProfileData() {
    try {
        const manager = window.userProgressManager || userProgressManager;
        if (manager && manager.userData) {
            const profile = manager.userData.profile;
            const totalTutorials = 8; // 8 tópicos do Capítulo 1
            const progressPercent = profile.totalPoints >= 100 ? Math.min(100, Math.round((profile.totalPoints / 500) * 100)) : Math.round((profile.totalPoints / 100) * 100);

            document.getElementById('playerName').textContent = profile.name;
            document.getElementById('playerLevel').textContent = profile.level;
            document.getElementById('completedCourses').textContent = manager.userData.performance.quizCompleted;
            document.getElementById('totalPoints').textContent = profile.totalPoints;
            document.getElementById('overallProgress').textContent = progressPercent + '%';

            // Animate progress bar
            setTimeout(() => {
                const progressFill = document.getElementById('progressFill');
                if (progressFill) {
                    progressFill.style.width = progressPercent + '%';
                }
            }, 500);
        } else {
            // Fallback: set default values
            document.getElementById('playerName').textContent = 'Aprendiz';
            document.getElementById('playerLevel').textContent = '1';
            document.getElementById('completedCourses').textContent = '0';
            document.getElementById('totalPoints').textContent = '0';
            document.getElementById('overallProgress').textContent = '0%';
        }
    } catch (e) {
        console.error('Error loading profile data:', e);
        // Fallback: set default values
        document.getElementById('playerName').textContent = 'Aprendiz';
        document.getElementById('playerLevel').textContent = '1';
        document.getElementById('completedCourses').textContent = '0';
        document.getElementById('totalPoints').textContent = '0';
        document.getElementById('overallProgress').textContent = '0%';
    }
}

function loadProfilePicture() {
    try {
        const savedPic = localStorage.getItem('userProfilePic');
        if (savedPic) {
            const largePic = document.getElementById('largeProfilePic');
            if (largePic) largePic.src = savedPic;
        }
    } catch (e) {
        console.error('Error loading profile picture:', e);
    }
}

function changeProfilePhoto() {
    document.getElementById('profileInput').click();
}

document.getElementById('profileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            const largePic = document.getElementById('largeProfilePic');
            if (largePic) largePic.src = imageData;
            localStorage.setItem('userProfilePic', imageData);
            // Update profile pic in navbar if it exists on this page
            const navbarPic = document.getElementById('profilePic');
            if (navbarPic) {
                navbarPic.src = imageData;
            }
        };
        reader.readAsDataURL(file);
    }
});

function changeUserName() {
    const manager = window.userProgressManager || userProgressManager;
    if (manager && manager.userData) {
        const newName = prompt('Digite seu novo nome:', manager.userData.profile.name);
        if (newName && newName.trim()) {
            manager.userData.profile.name = newName.trim();
            document.getElementById('playerName').textContent = newName.trim();
            manager.saveUserData();
            // Update navbar name if it exists
            const navbarName = document.getElementById('userName');
            if (navbarName) {
                navbarName.textContent = newName.trim();
            }
        }
    } else {
        // Fallback for static display
        const currentName = document.getElementById('playerName').textContent;
        const newName = prompt('Digite seu novo nome:', currentName);
        if (newName && newName.trim()) {
            document.getElementById('playerName').textContent = newName.trim();
            const navbarName = document.getElementById('userName');
            if (navbarName) {
                navbarName.textContent = newName.trim();
            }
        }
    }
}

function loadAchievements() {
    try {
        const manager = window.userProgressManager || userProgressManager;

        // Check achievements to update their status
        if (manager && manager.checkAchievements) {
            manager.checkAchievements();
        }

        // Get all achievement elements
        const achievementElements = document.querySelectorAll('.achievement-item');

        achievementElements.forEach((element) => {
            const achievementId = element.getAttribute('data-achievement');
            let isUnlocked = false;

            // Check conditions for each achievement
            switch (achievementId) {
                case 'first_quiz':
                    isUnlocked = manager?.userData?.performance.quizCompleted >= 1;
                    break;
                case 'accuracy_master':
                    isUnlocked = manager?.userData?.performance.quizAccuracy >= 90;
                    break;
                case 'speed_demon':
                    isUnlocked = manager?.userData?.performance.exerciseAvgTime <= 5 && manager?.userData?.performance.exercisesCompleted > 0;
                    break;
                case 'perfectionist':
                    isUnlocked = manager?.userData?.performance.exerciseBestScore >= 100;
                    break;
                case 'explorer':
                    const filledTopics = manager?.userData?.satisfaction.topics.filter(t => t.rating > 0).length || 0;
                    isUnlocked = filledTopics === 8;
                    break;
                case 'rpg_master':
                    isUnlocked = manager?.userData?.profile.level >= 10;
                    break;
                case 'first_exercise':
                    isUnlocked = manager?.userData?.performance.exercisesCompleted >= 1;
                    break;
                case 'quiz_warrior':
                    isUnlocked = manager?.userData?.performance.quizCompleted >= 10;
                    break;
                case 'century':
                    isUnlocked = manager?.userData?.profile.totalPoints >= 100;
                    break;
                case 'level_5':
                    isUnlocked = manager?.userData?.profile.level >= 5;
                    break;
                case 'consistency':
                    isUnlocked = manager?.userData?.profile.level >= 3;
                    break;
                case 'theory_master':
                    isUnlocked = manager?.userData?.performance.quizAccuracy >= 85 && manager?.userData?.performance.quizCompleted >= 5;
                    break;
                case 'speed_runner':
                    isUnlocked = manager?.userData?.performance.exerciseAvgTime <= 3 && manager?.userData?.performance.exercisesCompleted >= 3;
                    break;
                case 'satisfaction_guru':
                    const guruTopics = manager?.userData?.satisfaction.topics.filter(t => t.rating > 0).length || 0;
                    isUnlocked = guruTopics === 8;
                    break;
                case 'combo_master':
                    isUnlocked = manager?.userData?.performance.quizCompleted >= 5 && manager?.userData?.performance.quizAccuracy >= 80;
                    break;
                case 'resilient':
                    isUnlocked = manager?.userData?.performance.quizWrong >= 5 && manager?.userData?.profile.level >= 2;
                    break;
                case 'all_star':
                    const fiveStarTopics = manager?.userData?.satisfaction.topics.filter(t => t.rating === 5).length || 0;
                    isUnlocked = fiveStarTopics >= 1;
                    break;
                case 'first_blood':
                    isUnlocked = manager?.userData?.performance.quizCompleted >= 1 && manager?.userData?.performance.quizAccuracy >= 80;
                    break;
                case 'legend_status':
                    isUnlocked = manager?.userData?.profile.level >= 15;
                    break;
                case 'eternal_learner':
                    isUnlocked = manager?.userData?.performance.exercisesCompleted >= 50;
                    break;
                case 'achievement_collector':
                    // Count unlocked achievements
                    const unlockedCount = Array.from(achievementElements).filter(el => !el.classList.contains('locked')).length;
                    isUnlocked = unlockedCount >= 15;
                    break;
                case 'hall_of_fame':
                    // Count unlocked achievements
                    const fameCount = Array.from(achievementElements).filter(el => !el.classList.contains('locked')).length;
                    isUnlocked = fameCount >= 20;
                    break;
                case 'git_master':
                    isUnlocked = localStorage.getItem('gitCommitted') === 'true';
                    break;
            }

            // Update CSS classes
            if (isUnlocked) {
                element.classList.remove('locked');
                element.classList.add('unlocked');
                // Add rarity badge for unlocked achievements
                if (!element.querySelector('.achievement-rarity')) {
                    const rarityBadge = document.createElement('span');
                    rarityBadge.className = 'achievement-rarity';
                    rarityBadge.textContent = '⭐ Desbloqueada';
                    element.querySelector('.achievement-content').appendChild(rarityBadge);
                }
            } else {
                element.classList.remove('unlocked');
                element.classList.add('locked');
                // Remove rarity badge if exists
                const rarityBadge = element.querySelector('.achievement-rarity');
                if (rarityBadge) {
                    rarityBadge.remove();
                }
            }
        });

        console.log('Achievements loaded successfully');
    } catch (e) {
        console.error('Error loading achievements:', e);
    }
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('mobile-menu-open');
}
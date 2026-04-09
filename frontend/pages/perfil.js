// ======================================
// PERFIL.JS - Profile Page Functionality
// ======================================

document.addEventListener('DOMContentLoaded', function() {
    loadProfileData();
    loadProfilePicture();
    loadAchievements();
});

function loadProfileData() {
    try {
        const profile = progressManager.userData.profile;
        const totalTutorials = 8; // 8 tópicos do Capítulo 1
        const progressPercent = profile.totalPoints >= 100 ? Math.min(100, Math.round((profile.totalPoints / 500) * 100)) : Math.round((profile.totalPoints / 100) * 100);

        document.getElementById('playerName').textContent = profile.name;
        document.getElementById('playerLevel').textContent = profile.level;
        document.getElementById('completedCourses').textContent = progressManager.userData.performance.quizCompleted;
        document.getElementById('totalPoints').textContent = profile.totalPoints;
        document.getElementById('overallProgress').textContent = progressPercent + '%';

        // Animate progress bar
        setTimeout(() => {
            const progressFill = document.getElementById('progressFill');
            if (progressFill) {
                progressFill.style.width = progressPercent + '%';
            }
        }, 500);
    } catch (e) {
        console.error('Error loading profile data:', e);
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

function loadAchievements() {
    const grid = document.getElementById('achievementsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    try {
        // Ensure we have achievements data
        if (typeof progressManager !== 'undefined' && progressManager.userData && progressManager.userData.achievements) {
            progressManager.checkAchievements();

            progressManager.userData.achievements.forEach((achievement) => {
                const item = document.createElement('div');
                item.className = `achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`;

                item.innerHTML = `
                    <div class="achievement-content">
                        <span class="icon">${achievement.icon}</span>
                        <h4>${achievement.name}</h4>
                        <p>${achievement.description}</p>
                        ${achievement.unlocked ? '<span class="achievement-rarity">⭐ Desbloqueada</span>' : ''}
                    </div>
                `;

                grid.appendChild(item);
            });
        } else {
            // Fallback: try to create progressManager if it doesn't exist
            if (typeof UserProgressManager !== 'undefined') {
                window.progressManager = new UserProgressManager();
                // Try again after creating
                setTimeout(() => {
                    if (window.progressManager && window.progressManager.userData) {
                        loadAchievements();
                    }
                }, 100);
            } else {
                grid.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">Erro ao carregar conquistas. Recarregue a página.</p>';
            }
        }
    } catch (e) {
        console.error('Error loading achievements:', e);
        grid.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">Erro ao carregar conquistas.</p>';
    }
}

function changeUserName() {
    const newName = prompt('Digite seu novo nome:', progressManager.userData.profile.name);
    if (newName && newName.trim()) {
        progressManager.userData.profile.name = newName.trim();
        progressManager.saveData();
        loadProfileData();
        // Update navbar name if it exists
        const navbarName = document.getElementById('userName');
        if (navbarName) {
            navbarName.textContent = newName.trim();
        }
    }
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('mobile-menu-open');
}
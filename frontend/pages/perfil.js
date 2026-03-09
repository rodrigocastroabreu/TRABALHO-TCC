// ======================================
// PERFIL.JS - Profile Page Functionality
// ======================================

document.addEventListener('DOMContentLoaded', function() {
    loadProfileData();
    loadProfilePicture();
});

function loadProfileData() {
    const userName = progressManager.getUserName();
    const level = progressManager.getLevel();
    const completedCount = progressManager.getCompletedCount();
    const totalPoints = progressManager.getTotalPoints();
    const totalTutorials = 6; // Assuming 6 tutorials
    const progressPercent = totalTutorials > 0 ? Math.round((completedCount / totalTutorials) * 100) : 0;

    document.getElementById('playerName').textContent = userName;
    document.getElementById('playerLevel').textContent = level;
    document.getElementById('completedCourses').textContent = completedCount;
    document.getElementById('totalPoints').textContent = totalPoints;
    document.getElementById('overallProgress').textContent = progressPercent + '%';
    
    // Animate progress bar
    setTimeout(() => {
        document.getElementById('progressFill').style.width = progressPercent + '%';
    }, 500);
}

function loadProfilePicture() {
    const savedPic = localStorage.getItem('userProfilePic');
    if (savedPic) {
        document.getElementById('largeProfilePic').src = savedPic;
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
            document.getElementById('largeProfilePic').src = imageData;
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
    const name = prompt("Qual é o seu nome?");
    if (name && name.trim()) {
        progressManager.setUserName(name.trim());
        loadProfileData(); // Reload data
    }
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('mobile-menu-open');
}
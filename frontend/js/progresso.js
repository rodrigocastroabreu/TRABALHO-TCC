const QUIZ_STORAGE_KEY = 'quizPerformance';

function loadPerformance() {
    const saved = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!saved) {
        return {
            acertos: 0,
            erros: 0,
            total: 0,
            chapters: {
                capitulo1: { acertos: 0, erros: 0, total: 0 },
                capitulo2: { acertos: 0, erros: 0, total: 0 },
                capitulo3: { acertos: 0, erros: 0, total: 0 }
            }
        };
    }

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
            }
        };
    } catch (error) {
        console.error('Erro ao ler desempenho do localStorage:', error);
        return {
            acertos: 0,
            erros: 0,
            total: 0,
            chapters: {
                capitulo1: { acertos: 0, erros: 0, total: 0 },
                capitulo2: { acertos: 0, erros: 0, total: 0 },
                capitulo3: { acertos: 0, erros: 0, total: 0 }
            }
        };
    }
}

function renderProgress() {
    const performance = loadPerformance();
    const totalCorrect = document.getElementById('totalCorrect');
    const totalIncorrect = document.getElementById('totalIncorrect');
    const totalAnswered = document.getElementById('totalAnswered');

    totalCorrect.textContent = performance.acertos;
    totalIncorrect.textContent = performance.erros;
    totalAnswered.textContent = performance.total;

    const chapterLabels = ['Capítulo 1', 'Capítulo 2', 'Capítulo 3'];
    const chapterTotals = [
        performance.chapters.capitulo1.total,
        performance.chapters.capitulo2.total,
        performance.chapters.capitulo3.total
    ];

    const ctxChapter = document.getElementById('chapterChart').getContext('2d');
    new Chart(ctxChapter, {
        type: 'bar',
        data: {
            labels: chapterLabels,
            datasets: [{
                label: 'Perguntas respondidas',
                data: chapterTotals,
                backgroundColor: ['#6366f1', '#22c55e', '#f59e0b'],
                borderRadius: 14,
                maxBarThickness: 48
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true, grid: { color: '#e2e8f0' } }
            }
        }
    });

    const ctxScore = document.getElementById('scoreChart').getContext('2d');
    new Chart(ctxScore, {
        type: 'doughnut',
        data: {
            labels: ['Acertos', 'Erros'],
            datasets: [{
                data: [performance.acertos, performance.erros],
                backgroundColor: ['#16a34a', '#dc2626'],
                hoverOffset: 12
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { usePointStyle: true, padding: 20 }
                }
            }
        }
    });
}

window.addEventListener('DOMContentLoaded', renderProgress);

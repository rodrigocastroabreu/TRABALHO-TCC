// Tópico 3 - Estratégias - Interactive Charts
// Requires Chart.js library

document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
});

function initializeCharts() {
    // Decision Tree Chart - Using Bar Chart instead of tree
    const decisionTreeCtx = document.getElementById('decisionTreeChart');
    if (decisionTreeCtx) {
        window.decisionTreeChart = new Chart(decisionTreeCtx, {
            type: 'bar',
            data: {
                labels: ['Decisão Inicial', 'Cooperar', 'Trair', 'Resultado'],
                datasets: [{
                    label: 'Payoff',
                    data: [0, 3, 0, 1],
                    backgroundColor: [
                        '#6366f1',
                        '#10b981',
                        '#ef4444',
                        '#f59e0b'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 2
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
                        callbacks: {
                            label: function(context) {
                                return 'Payoff: ' + context.parsed.y;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5
                    }
                }
            }
        });
    }

    // Rationality Scale Chart
    const rationalityCtx = document.getElementById('rationalityChart');
    if (rationalityCtx) {
        window.rationalityChart = new Chart(rationalityCtx, {
            type: 'radar',
            data: {
                labels: ['Análise', 'Antecipação', 'Otimização', 'Consistência', 'Adaptação'],
                datasets: [{
                    label: 'Racionalidade Estratégica',
                    data: [4, 3, 5, 4, 3],
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    borderColor: '#8b5cf6',
                    borderWidth: 3,
                    pointBackgroundColor: '#8b5cf6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Dominant Strategy Chart
    const dominantCtx = document.getElementById('dominantStrategyChart');
    if (dominantCtx) {
        window.dominantStrategyChart = new Chart(dominantCtx, {
            type: 'bar',
            data: {
                labels: ['Estratégia A', 'Estratégia B', 'Estratégia C'],
                datasets: [{
                    label: 'Payoff Médio',
                    data: [3.5, 2.8, 4.2],
                    backgroundColor: [
                        '#e5e7eb',
                        '#e5e7eb',
                        '#10b981'
                    ],
                    borderColor: [
                        '#9ca3af',
                        '#9ca3af',
                        '#059669'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    annotation: {
                        annotations: {
                            dominantLabel: {
                                type: 'label',
                                xValue: 2,
                                yValue: 4.5,
                                content: 'Dominante',
                                backgroundColor: '#10b981',
                                color: 'white',
                                font: {
                                    size: 12,
                                    weight: 'bold'
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    // Repeated Game Chart
    const repeatedCtx = document.getElementById('repeatedGameChart');
    if (repeatedCtx) {
        window.repeatedGameChart = new Chart(repeatedCtx, {
            type: 'line',
            data: {
                labels: ['Rodada 1', 'Rodada 2', 'Rodada 3', 'Rodada 4', 'Rodada 5'],
                datasets: [{
                    label: 'Cooperação (%)',
                    data: [60, 75, 85, 90, 95],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Applications Chart - Doughnut (Pizza)
    const applicationsCtx = document.getElementById('applicationsChart');
    if (applicationsCtx) {
        window.applicationsChart = new Chart(applicationsCtx, {
            type: 'doughnut',
            data: {
                labels: ['Desenvolvimento de Jogos', 'Economia', 'Política', 'Negócios', 'Ciência'],
                datasets: [{
                    data: [35, 25, 15, 15, 10],
                    backgroundColor: [
                        '#6366f1',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Strategy Pie Chart
    const strategyPieCtx = document.getElementById('strategyPieChart');
    if (strategyPieCtx) {
        window.strategyPieChart = new Chart(strategyPieCtx, {
            type: 'pie',
            data: {
                labels: ['Dominante', 'Mista', 'Segura', 'Agressiva', 'Defensiva'],
                datasets: [{
                    data: [30, 25, 20, 15, 10],
                    backgroundColor: [
                        '#10b981',
                        '#6366f1',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Strategy Line Chart
    const strategyLineCtx = document.getElementById('strategyLineChart');
    if (strategyLineCtx) {
        window.strategyLineChart = new Chart(strategyLineCtx, {
            type: 'line',
            data: {
                labels: ['Rodada 1', 'Rodada 2', 'Rodada 3', 'Rodada 4', 'Rodada 5', 'Rodada 6'],
                datasets: [{
                    label: 'Taxa de Sucesso',
                    data: [45, 55, 65, 75, 80, 85],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Efficiency Bar Chart
    const efficiencyCtx = document.getElementById('efficiencyChart');
    if (efficiencyCtx) {
        window.efficiencyChart = new Chart(efficiencyCtx, {
            type: 'bar',
            data: {
                labels: ['Estratégia A', 'Estratégia B', 'Estratégia C', 'Estratégia D'],
                datasets: [{
                    label: 'Eficiência (%)',
                    data: [85, 72, 90, 68],
                    backgroundColor: [
                        '#10b981',
                        '#f59e0b',
                        '#6366f1',
                        '#ef4444'
                    ],
                    borderColor: [
                        '#059669',
                        '#d97706',
                        '#4f46e5',
                        '#dc2626'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Risk vs Reward Scatter Chart
    const riskRewardCtx = document.getElementById('riskRewardChart');
    if (riskRewardCtx) {
        window.riskRewardChart = new Chart(riskRewardCtx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Estratégias',
                    data: [
                        {x: 2, y: 3}, {x: 5, y: 8}, {x: 3, y: 5}, {x: 7, y: 9},
                        {x: 4, y: 6}, {x: 6, y: 7}, {x: 1, y: 2}, {x: 8, y: 10}
                    ],
                    backgroundColor: '#6366f1',
                    borderColor: '#4f46e5',
                    borderWidth: 2,
                    pointRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Risco'
                        },
                        beginAtZero: true,
                        max: 10
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Recompensa'
                        },
                        beginAtZero: true,
                        max: 12
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Strategy Trends Area Chart
    const strategyTrendsCtx = document.getElementById('strategyTrendsChart');
    if (strategyTrendsCtx) {
        window.strategyTrendsChart = new Chart(strategyTrendsCtx, {
            type: 'line',
            data: {
                labels: ['2010', '2012', '2014', '2016', '2018', '2020', '2022', '2024'],
                datasets: [{
                    label: 'Estratégias Cooperativas',
                    data: [20, 25, 30, 35, 40, 50, 60, 70],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Estratégias Competitivas',
                    data: [80, 75, 70, 65, 60, 50, 40, 30],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        stacked: true
                    },
                    x: {
                        stacked: true
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Interactive Functions

function updateDecisionTree(strategy) {
    if (!window.decisionTreeChart) return;

    let newData;
    if (strategy === 'cooperar') {
        newData = [0, 3, 0, 3]; // Cooperar leva a cooperação mútua
    } else {
        newData = [0, 0, 1, 1]; // Trair leva a traição mútua
    }

    window.decisionTreeChart.data.datasets[0].data = newData;
    window.decisionTreeChart.update();
}

function resetDecisionTree() {
    if (!window.decisionTreeChart) return;

    window.decisionTreeChart.data.datasets[0].data = [0, 3, 0, 1];
    window.decisionTreeChart.update();
}

function highlightCell(cell) {
    // Remove previous highlights
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('highlighted'));

    // Add highlight to clicked cell
    cell.classList.add('highlighted');

    // Update explanation based on cell
    const explanation = document.querySelector('.chart-explanation p');
    if (cell.classList.contains('cooperar-cooperar')) {
        explanation.textContent = 'Ambos cooperam: resultado mutuamente benéfico (3, 3)';
    } else if (cell.classList.contains('cooperar-trair')) {
        explanation.textContent = 'Um coopera, outro trai: o traidor ganha mais (0, 5)';
    } else if (cell.classList.contains('trair-cooperar')) {
        explanation.textContent = 'Um trai, outro coopera: o traidor ganha mais (5, 0)';
    } else if (cell.classList.contains('trair-trair')) {
        explanation.textContent = 'Equilíbrio de Nash: ambos traem, pior resultado para todos (1, 1)';
    }
}

function showDominantStrategy() {
    if (!window.dominantStrategyChart) return;

    window.dominantStrategyChart.data.datasets[0].backgroundColor = [
        '#e5e7eb',
        '#e5e7eb',
        '#10b981'
    ];
    window.dominantStrategyChart.data.datasets[0].borderColor = [
        '#9ca3af',
        '#9ca3af',
        '#059669'
    ];
    window.dominantStrategyChart.update();
}

function showDominatedStrategy() {
    if (!window.dominantStrategyChart) return;

    window.dominantStrategyChart.data.datasets[0].backgroundColor = [
        '#fca5a5',
        '#e5e7eb',
        '#e5e7eb'
    ];
    window.dominantStrategyChart.data.datasets[0].borderColor = [
        '#dc2626',
        '#9ca3af',
        '#9ca3af'
    ];
    window.dominantStrategyChart.update();
}

function resetDominantChart() {
    if (!window.dominantStrategyChart) return;

    window.dominantStrategyChart.data.datasets[0].backgroundColor = [
        '#e5e7eb',
        '#e5e7eb',
        '#10b981'
    ];
    window.dominantStrategyChart.data.datasets[0].borderColor = [
        '#9ca3af',
        '#9ca3af',
        '#059669'
    ];
    window.dominantStrategyChart.update();
}

let roundCount = 5;
function simulateRound() {
    if (!window.repeatedGameChart) return;

    if (roundCount < 10) {
        roundCount++;
        const newLabel = 'Rodada ' + roundCount;
        const newValue = Math.min(95 + (roundCount - 5) * 1, 100);

        window.repeatedGameChart.data.labels.push(newLabel);
        window.repeatedGameChart.data.datasets[0].data.push(newValue);
        window.repeatedGameChart.update();
    }
}

function resetRepeatedGame() {
    if (!window.repeatedGameChart) return;

    roundCount = 5;
    window.repeatedGameChart.data.labels = ['Rodada 1', 'Rodada 2', 'Rodada 3', 'Rodada 4', 'Rodada 5'];
    window.repeatedGameChart.data.datasets[0].data = [60, 75, 85, 90, 95];
    window.repeatedGameChart.update();
}

function changeChartValues(chartId) {
    const chart = window[chartId];
    if (!chart) {
        alert('Gráfico não encontrado.');
        return;
    }

    switch (chartId) {
        case 'decisionTreeChart': {
            const choice = prompt('Digite o tipo de caminho: cooperar ou trair', 'cooperar');
            if (!choice) {
                alert('Operação cancelada.');
                return;
            }
            const strategy = choice.trim().toLowerCase();
            const valueInput = prompt('Digite o valor de payoff final para o caminho escolhido (0 a 10)', '4');
            const value = Number(valueInput);
            if (Number.isNaN(value) || value < 0 || value > 10) {
                alert('Valor inválido. Use um número entre 0 e 10.');
                return;
            }
            if (strategy === 'cooperar') {
                chart.data.datasets[0].data = [0, 3, 0, value];
            } else if (strategy === 'trair') {
                chart.data.datasets[0].data = [0, 0, 1, value];
            } else {
                alert('Escolha inválida. Use "cooperar" ou "trair".');
                return;
            }
            break;
        }
        case 'strategyPieChart':
            chart.data.datasets[0].data = [20, 30, 15, 25, 10];
            break;
        case 'strategyLineChart':
            chart.data.labels = ['Rodada 1', 'Rodada 2', 'Rodada 3', 'Rodada 4', 'Rodada 5', 'Rodada 6'];
            chart.data.datasets[0].data = [50, 60, 70, 80, 90, 95];
            break;
        case 'rationalityChart':
            chart.data.datasets[0].data = [5, 4, 4, 5, 4];
            break;
        case 'dominantStrategyChart':
            chart.data.datasets[0].data = [4.2, 3.4, 4.8];
            break;
        case 'repeatedGameChart':
            chart.data.labels = ['Rodada 1', 'Rodada 2', 'Rodada 3', 'Rodada 4', 'Rodada 5', 'Rodada 6'];
            chart.data.datasets[0].data = [60, 70, 80, 90, 96, 98];
            break;
        case 'applicationsChart':
            chart.data.datasets[0].data = [30, 20, 20, 20, 10];
            break;
        case 'efficiencyChart':
            chart.data.datasets[0].data = [88, 75, 92, 70];
            break;
        case 'riskRewardChart':
            chart.data.datasets[0].data = [
                {x: 1, y: 2}, {x: 4, y: 7}, {x: 3, y: 6}, {x: 6, y: 9}, {x: 5, y: 8}, {x: 8, y: 11}
            ];
            break;
        case 'strategyTrendsChart':
            chart.data.datasets[0].data = [25, 30, 35, 45, 55, 65, 75, 85];
            chart.data.datasets[1].data = [75, 70, 65, 60, 55, 45, 35, 25];
            break;
        default:
            alert('Este gráfico não suporta mudança de valores.');
            return;
    }

    chart.update();
    alert('Valores do gráfico foram atualizados.');
}

function showChartInstructions(chartId) {
    const instructions = {
        decisionTreeChart: 'Este gráfico mostra possíveis decisões no Dilema do Prisioneiro. Use os botões para aprender a interpretar o gráfico e retornar ao estado inicial.',
        strategyPieChart: 'Este gráfico pizza mostra a distribuição das estratégias. Clique em Resetar gráfico para restaurar os valores originais.',
        strategyLineChart: 'Este gráfico de linha mostra a evolução de desempenho ao longo de rodadas. Use as instruções para comparar tendências facilmente.',
        rationalityChart: 'Este gráfico radar mostra níveis de racionalidade em diferentes habilidades estratégicas. Observe cada ponto para entender melhor.',
        dominantStrategyChart: 'Este gráfico de barras mostra opções dominantes e dominadas. Use Resetar gráfico para retornar aos valores iniciais.',
        repeatedGameChart: 'Este gráfico de linha mostra cooperação em rodadas repetidas. Use Resetar gráfico para voltar à sequência inicial.',
        applicationsChart: 'Este gráfico pizza mostra aplicações da Teoria dos Jogos em diferentes áreas. Use os botões para assistir às instruções.',
        efficiencyChart: 'Este gráfico de barras compara a eficiência de estratégias. Clique em Resetar gráfico para restaurar as barras originais.',
        riskRewardChart: 'Este gráfico de dispersão mostra risco versus recompensa. As instruções ajudam a entender o posicionamento de cada ponto.',
        strategyTrendsChart: 'Este gráfico de área mostra tendências de adoção de estratégias ao longo do tempo. Use os comandos para aprender a interpretar as séries.'
    };

    alert(instructions[chartId] || 'Clique no gráfico para ver instruções de uso.');
}

function resetChart(chartId) {
    alert('Resetando o gráfico: a exibição retorna ao estado inicial.');
}
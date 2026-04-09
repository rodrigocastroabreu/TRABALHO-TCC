// progresso_simulacao.js - JavaScript limpo para a página de simulação de Learning Analytics

// Função para destruir todos os gráficos existentes
function destroyAllCharts() {
    const chartInstances = [
        'desempenhoChartInstance',
        'evolucaoChartInstance',
        'avaliacaoChartInstance',
        'habilidadesChartInstance'
    ];

    chartInstances.forEach(instanceName => {
        if (window[instanceName]) {
            try {
                window[instanceName].destroy();
                window[instanceName] = null;
            } catch (error) {
                console.warn(`Erro ao destruir gráfico ${instanceName}:`, error);
            }
        }
    });
}

// Dados mockados para 30 alunos com dados realistas baseados na seção diferencial
function generateMockData() {
    const alunos = [];

    // Distribuição ajustada para média de 4.6 estrelas (depois da gamificação)
    // 30 usuários: distribuição que resulta em média 4.6
    const avaliacaoCounts = [0, 0, 2, 15, 13]; // 0★, 1★, 2★, 3★, 4★, 5★ -> média ~4.6
    const avaliacaoPool = [];

    avaliacaoCounts.forEach((count, index) => {
        for (let i = 0; i < count; i++) {
            avaliacaoPool.push(index + 1);
        }
    });

    // Embaralhar para simular distribuição real de usuários
    for (let i = avaliacaoPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [avaliacaoPool[i], avaliacaoPool[j]] = [avaliacaoPool[j], avaliacaoPool[i]];
    }

    for (let i = 1; i <= 30; i++) {
        // Status baseado na taxa de conclusão de 78% (depois da gamificação)
        const statusRandom = Math.random();
        let status = "Inativo";
        if (statusRandom <= 0.78) { // 78% conclusão
            status = "Concluído";
        } else if (statusRandom <= 0.88) { // 10% ativos
            status = "Ativo";
        } // 12% inativos

        // Determinar avaliação baseada na distribuição ajustada
        const avaliacao = avaliacaoPool[i - 1];

        // Progresso baseado no status - ajustado para gamificação
        let progresso;
        if (status === "Concluído") {
            progresso = Math.floor(Math.random() * 15) + 85; // 85-100% para concluídos
        } else if (status === "Ativo") {
            progresso = Math.floor(Math.random() * 40) + 50; // 50-90% para ativos
        } else {
            progresso = Math.floor(Math.random() * 40) + 10; // 10-50% para inativos
        }

        // Nota média ajustada para média de 8.4 (depois da gamificação)
        const baseNota = 6.0 + (progresso / 100) * 3; // 6.0-9.0 base
        const avaliacaoBonus = (avaliacao - 3) * 0.3; // +/- 0.6 baseado na avaliação
        const variacaoAleatoria = (Math.random() - 0.5) * 0.6; // +/- 0.3 para variabilidade
        const notaMedia = Math.min(10, Math.max(0, baseNota + avaliacaoBonus + variacaoAleatoria)).toFixed(1);

        // Engajamento ajustado para média de 110 minutos (depois da gamificação)
        let engajamento;
        if (status === "Concluído") {
            engajamento = Math.floor(Math.random() * 40) + 95; // 95-135 min
        } else if (status === "Ativo") {
            engajamento = Math.floor(Math.random() * 50) + 80; // 80-130 min
        } else {
            engajamento = Math.floor(Math.random() * 40) + 50; // 50-90 min
        }

        // Habilidades correlacionadas com nota e progresso - ajustadas para gamificação
        const habilidadeBase = 7 + (parseFloat(notaMedia) - 6) * 0.6;
        const habilidades = {
            logica: Math.floor(Math.random() * 2) + Math.floor(habilidadeBase),
            estrategia: Math.floor(Math.random() * 2) + Math.floor(habilidadeBase),
            pratica: Math.floor(Math.random() * 2) + Math.floor(habilidadeBase)
        };

        alunos.push({
            nome: `Usuário ${i}`,
            progresso: progresso,
            notaMedia: notaMedia,
            avaliacao: avaliacao,
            status: status,
            engajamento: engajamento,
            habilidades: habilidades
        });
    }

    return alunos;
}

// Função para calcular métricas gerais
function calculateMetrics(alunos) {
    const totalAlunos = alunos.length;
    const mediaDesempenho = (alunos.reduce((sum, a) => sum + parseFloat(a.notaMedia), 0) / totalAlunos).toFixed(1);
    const taxaConclusao = ((alunos.filter(a => a.progresso >= 80).length / totalAlunos) * 100).toFixed(1) + '%';
    const engajamentoMedio = Math.round(alunos.reduce((sum, a) => sum + a.engajamento, 0) / totalAlunos);

    return {
        totalAlunos,
        mediaDesempenho,
        taxaConclusao,
        engajamentoMedio
    };
}

// Função para atualizar métricas na interface
function updateMetricsDisplay(metrics) {
    document.getElementById('totalAlunos').textContent = metrics.totalAlunos;
    document.getElementById('mediaDesempenho').textContent = metrics.mediaDesempenho;
    document.getElementById('taxaConclusao').textContent = metrics.taxaConclusao;
    document.getElementById('engajamentoMedio').textContent = metrics.engajamentoMedio + ' min';
}

// Função para criar gráfico de desempenho individual (histograma)
function createDesempenhoChart(alunos) {
    const canvas = document.getElementById('desempenhoChart');
    if (!canvas) {
        console.error('Canvas desempenhoChart não encontrado');
        return;
    }

    // Destruir gráfico existente se houver
    if (window.desempenhoChartInstance) {
        try {
            window.desempenhoChartInstance.destroy();
            window.desempenhoChartInstance = null;
        } catch (error) {
            console.warn('Erro ao destruir gráfico de desempenho:', error);
        }
    }

    const ctx = canvas.getContext('2d');

    // Criar histograma das notas (distribuição por faixas)
    const faixas = ['0-2', '2-4', '4-6', '6-8', '8-10'];
    const contagens = [0, 0, 0, 0, 0];

    alunos.forEach(aluno => {
        const nota = parseFloat(aluno.notaMedia);
        if (nota < 2) contagens[0]++;
        else if (nota < 4) contagens[1]++;
        else if (nota < 6) contagens[2]++;
        else if (nota < 8) contagens[3]++;
        else contagens[4]++;
    });

    const maxCount = Math.max(...contagens);

    try {
        window.desempenhoChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: faixas,
                datasets: [{
                    label: 'Número de Alunos',
                    data: contagens,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(255, 205, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(54, 162, 235, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 205, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
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
                                return `Alunos: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: maxCount + 2,
                        min: 0,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            color: '#666',
                            stepSize: 1,
                            precision: 0,
                            callback: function(value) {
                                return Math.floor(value);
                            }
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
                    duration: 1000,
                    easing: 'easeOutCubic'
                }
            }
        });
    } catch (error) {
        console.error('Erro ao criar gráfico de desempenho:', error);
    }
}

// Função para criar gráfico de evolução temporal
function createEvolucaoChart(alunos) {
    const canvas = document.getElementById('evolucaoChart');
    if (!canvas) {
        console.error('Canvas evolucaoChart não encontrado');
        return;
    }

    // Destruir gráfico existente se houver
    if (window.evolucaoChartInstance) {
        try {
            window.evolucaoChartInstance.destroy();
            window.evolucaoChartInstance = null;
        } catch (error) {
            console.warn('Erro ao destruir gráfico de evolução:', error);
        }
    }

    const ctx = canvas.getContext('2d');

    // Calcular evolução baseada no engajamento médio
    const engajamentoMedio = alunos.reduce((sum, a) => sum + a.engajamento, 0) / alunos.length;
    const meses = ['Jan', 'Fev', 'Mar'];

    // Evolução baseada no engajamento: mais engajamento = melhor evolução
    const baseMelhoria = Math.min(engajamentoMedio / 20, 1);
    const evolucaoData = [
        Math.min(95, 65 + (Math.random() - 0.5) * 5),
        Math.min(95, 70 + baseMelhoria * 6 + (Math.random() - 0.5) * 3),
        Math.min(95, 75 + baseMelhoria * 8 + (Math.random() - 0.5) * 3)
    ];

    try {
        window.evolucaoChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: meses,
                datasets: [{
                    label: 'Média de Desempenho (%)',
                    data: evolucaoData,
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
                                return `Desempenho: ${context.parsed.y.toFixed(1)}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 60,
                        max: 95,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            color: '#666',
                            callback: function(value) {
                                return value + '%';
                            }
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
                    duration: 1000,
                    easing: 'easeOutCubic'
                }
            }
        });
    } catch (error) {
        console.error('Erro ao criar gráfico de evolução:', error);
    }
}

// Função para criar gráfico de distribuição de satisfação
function createAvaliacaoChart(alunos) {
    const canvas = document.getElementById('avaliacaoChart');
    if (!canvas) {
        console.error('Canvas avaliacaoChart não encontrado');
        return;
    }

    // Destruir gráfico existente se houver
    if (window.avaliacaoChartInstance) {
        try {
            window.avaliacaoChartInstance.destroy();
            window.avaliacaoChartInstance = null;
        } catch (error) {
            console.warn('Erro ao destruir gráfico de avaliação:', error);
        }
    }

    const ctx = canvas.getContext('2d');
    const avaliacaoCounts = [0, 0, 0, 0, 0];
    alunos.forEach(a => avaliacaoCounts[a.avaliacao - 1]++);

    try {
        window.avaliacaoChartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['1 estrela', '2 estrelas', '3 estrelas', '4 estrelas', '5 estrelas'],
                datasets: [{
                    data: avaliacaoCounts,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(255, 205, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(54, 162, 235, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 205, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 2
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
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true,
                    duration: 1000,
                    easing: 'easeOutCubic'
                }
            }
        });
    } catch (error) {
        console.error('Erro ao criar gráfico de avaliação:', error);
    }
}

// Função para criar gráfico de desenvolvimento de habilidades
function createHabilidadesChart(alunos) {
    const canvas = document.getElementById('habilidadesChart');
    if (!canvas) {
        console.error('Canvas habilidadesChart não encontrado');
        return;
    }

    // Destruir gráfico existente se houver
    if (window.habilidadesChartInstance) {
        try {
            window.habilidadesChartInstance.destroy();
            window.habilidadesChartInstance = null;
        } catch (error) {
            console.warn('Erro ao destruir gráfico de habilidades:', error);
        }
    }

    const ctx = canvas.getContext('2d');
    const totalAlunos = alunos.length;
    const habilidadesMedias = {
        logica: alunos.reduce((sum, a) => sum + a.habilidades.logica, 0) / totalAlunos,
        estrategia: alunos.reduce((sum, a) => sum + a.habilidades.estrategia, 0) / totalAlunos,
        pratica: alunos.reduce((sum, a) => sum + a.habilidades.pratica, 0) / totalAlunos
    };

    try {
        window.habilidadesChartInstance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Lógica', 'Estratégia', 'Prática'],
                datasets: [{
                    label: 'Habilidades Desenvolvidas',
                    data: [habilidadesMedias.logica, habilidadesMedias.estrategia, habilidadesMedias.pratica],
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(153, 102, 255, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(153, 102, 255, 1)'
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
                        cornerRadius: 8
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 10,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        angleLines: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        pointLabels: {
                            color: '#666',
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        },
                        ticks: {
                            color: '#666',
                            backdropColor: 'transparent'
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutCubic'
                }
            }
        });
    } catch (error) {
        console.error('Erro ao criar gráfico de habilidades:', error);
    }
}

// Função para criar tabela de alunos
function createAlunosTable(alunos) {
    const tableBody = document.getElementById('alunosTableBody');
    tableBody.innerHTML = ''; // Limpar tabela existente

    alunos.forEach(aluno => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${aluno.nome}</td>
            <td>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${aluno.progresso}%"></div>
                </div>
                ${aluno.progresso}%
            </td>
            <td>${aluno.notaMedia}</td>
            <td class="stars">${'★'.repeat(aluno.avaliacao)}${'☆'.repeat(5 - aluno.avaliacao)}</td>
            <td>${aluno.status}</td>
            <td>${aluno.engajamento} min</td>
        `;
        tableBody.appendChild(row);
    });
}

// Função para criar ranking Top 5
function createRanking(alunos) {
    const rankingList = document.getElementById('rankingList');
    rankingList.innerHTML = ''; // Limpar ranking existente

    const top5 = alunos.sort((a, b) => parseFloat(b.notaMedia) - parseFloat(a.notaMedia)).slice(0, 5);

    top5.forEach((aluno, index) => {
        const item = document.createElement('li');
        item.className = 'ranking-item';
        item.innerHTML = `
            <div class="ranking-info">
                <span class="ranking-name">${aluno.nome}</span>
                <span class="ranking-detail">Nota média: ${aluno.notaMedia}</span>
            </div>
        `;
        rankingList.appendChild(item);
    });

    return top5;
}

// Funções de download
function downloadChart(chartId) {
    const canvas = document.getElementById(chartId);
    if (!canvas) {
        console.error('Canvas não encontrado:', chartId);
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

function downloadMetric(metricId) {
    const value = document.getElementById(metricId).textContent;
    const data = `Métrica: ${metricId}\nValor: ${value}`;
    const blob = new Blob([data], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = `${metricId}-${new Date().toISOString().split('T')[0]}.txt`;
    link.href = URL.createObjectURL(blob);
    link.click();
}

function downloadExcel(alunos) {
    let csv = 'Usuário,Progresso,Nota Média,Avaliação,Status\n';
    alunos.forEach(a => {
        csv += `${a.nome},${a.progresso},${a.notaMedia},${a.avaliacao},${a.status}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.download = `dados_alunos-${new Date().toISOString().split('T')[0]}.csv`;
    link.href = URL.createObjectURL(blob);
    link.click();
}

function downloadExcelRanking(top5) {
    let csv = 'Posição,Usuário,Nota Média\n';
    top5.forEach((a, i) => {
        csv += `${i+1},${a.nome},${a.notaMedia}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.download = `ranking_top5-${new Date().toISOString().split('T')[0]}.csv`;
    link.href = URL.createObjectURL(blob);
    link.click();
}

// Função de inicialização
function initSimulacaoPage() {
    // Evitar inicialização múltipla
    if (window.simulacaoInitialized) {
        console.log('Página de simulação já inicializada.');
        return null;
    }

    console.log('Inicializando página de simulação...');
    window.simulacaoInitialized = true;

    // Gerar dados mockados
    const alunos = generateMockData();

    // Calcular métricas
    const metrics = calculateMetrics(alunos);

    // Atualizar display das métricas
    updateMetricsDisplay(metrics);

    // Criar gráficos
    createDesempenhoChart(alunos);
    createEvolucaoChart(alunos);
    createAvaliacaoChart(alunos);
    createHabilidadesChart(alunos);

    // Criar tabela e ranking
    createAlunosTable(alunos);
    const top5 = createRanking(alunos);

    console.log('Página de simulação inicializada com sucesso!');

    // Retornar dados para uso nas funções de download
    return { alunos, top5 };
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const data = initSimulacaoPage();

    // Adicionar event listeners aos botões de download
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const chartId = this.getAttribute('data-chart');
            const metricId = this.getAttribute('data-metric');

            if (chartId) {
                downloadChart(chartId);
            } else if (metricId) {
                downloadMetric(metricId);
            } else if (this.textContent.includes('📊 Baixar Excel') && this.closest('.table-section')) {
                downloadExcel(data.alunos);
            } else if (this.textContent.includes('📊 Baixar Excel') && this.closest('.ranking')) {
                downloadExcelRanking(data.top5);
            }
        });
    });
});

// Exportar funções para uso global (se necessário)
window.SimulacaoPage = {
    init: initSimulacaoPage,
    downloadChart: downloadChart,
    downloadMetric: downloadMetric,
    downloadExcel: downloadExcel,
    downloadExcelRanking: downloadExcelRanking
};
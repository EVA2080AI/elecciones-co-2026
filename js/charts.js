/* =========================================
   CHARTS · Chart.js instances + theme reactive
   ========================================= */

let chartSolidez, chartRadar, chartPie, chartTime, chartHistory;

const chartTextColor = () => getComputedStyle(document.body).getPropertyValue('--text').trim() || '#1e293b';
const chartGrid      = () => getComputedStyle(document.body).getPropertyValue('--divider').trim() || '#e2e8f0';

function setupCharts() {
    if (!window.Chart) return;
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = chartTextColor();
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.padding = 14;

    chartSolidez = new Chart(document.getElementById('chartSolidez'), {
        type: 'bar',
        data: {
            labels: CAND_KEYS.map(k => CANDIDATES[k].name),
            datasets: [{
                label: 'Solidez',
                data: CAND_KEYS.map(k => CANDIDATES[k].baseSolidez),
                backgroundColor: CAND_KEYS.map(k => CANDIDATES[k].color),
                borderRadius: 8, borderSkipped: false
            }]
        },
        options: {
            indexAxis: 'y', responsive: true, maintainAspectRatio: false,
            animation: { duration: 800, easing: 'easeOutCubic' },
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: ctx => `Solidez: ${ctx.parsed.x.toFixed(1)} / 100` } }
            },
            scales: {
                x: { beginAtZero: true, max: 100, grid: { color: chartGrid() }, ticks: { font: { family: "'Outfit', sans-serif" } } },
                y: { grid: { display: false }, ticks: { font: { family: "'Outfit', sans-serif", weight: '600' } } }
            }
        }
    });

    chartRadar = new Chart(document.getElementById('chartRadar'), {
        type: 'radar',
        data: {
            labels: PROBLEMS.map(p => p.short),
            datasets: CAND_KEYS.map(k => ({
                label: CANDIDATES[k].name,
                data: PROBLEMS.map(p => p.scores[k]),
                borderColor: CANDIDATES[k].color,
                backgroundColor: CANDIDATES[k].color + '33',
                pointBackgroundColor: CANDIDATES[k].color,
                pointRadius: 4, borderWidth: 2
            }))
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            animation: { duration: 900 },
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        title: items => PROBLEMS[items[0].dataIndex].label,
                        label: ctx => `${ctx.dataset.label}: ${ctx.parsed.r} / 10`
                    }
                }
            },
            scales: {
                r: {
                    suggestedMin: 0, suggestedMax: 10,
                    ticks: { stepSize: 2, backdropColor: 'transparent' },
                    grid: { color: chartGrid() }, angleLines: { color: chartGrid() },
                    pointLabels: { font: { size: 11, family: "'Outfit', sans-serif", weight: '600' } }
                }
            }
        }
    });

    chartPie = new Chart(document.getElementById('chartPie'), {
        type: 'doughnut',
        data: {
            labels: CAND_KEYS.map(k => CANDIDATES[k].name),
            datasets: [{
                data: CAND_KEYS.map(k => +IDONEIDAD.pct[k].toFixed(2)),
                backgroundColor: CAND_KEYS.map(k => CANDIDATES[k].color),
                borderWidth: 0, hoverOffset: 8
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, cutout: '60%',
            plugins: {
                legend: { position: 'bottom' },
                tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed}%` } }
            }
        }
    });

    chartTime = new Chart(document.getElementById('chartTime'), {
        type: 'line',
        data: {
            labels: [],
            datasets: CAND_KEYS.map(k => ({
                label: CANDIDATES[k].name,
                data: [],
                borderColor: CANDIDATES[k].color,
                backgroundColor: CANDIDATES[k].color + '22',
                tension: 0.35, fill: true, pointRadius: 3, borderWidth: 2
            }))
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } },
            scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true, grid: { color: chartGrid() }, ticks: { precision: 0 } }
            }
        }
    });

    chartHistory = new Chart(document.getElementById('chartHistory'), {
        type: 'line',
        data: {
            labels: POLL_HISTORY.map(p => p.m),
            datasets: CAND_KEYS.map(k => ({
                label: CANDIDATES[k].name,
                data: POLL_HISTORY.map(p => p[k]),
                borderColor: CANDIDATES[k].color,
                backgroundColor: CANDIDATES[k].color + '22',
                tension: 0.35, fill: false, pointRadius: 4, borderWidth: 2.5
            }))
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y}% intención` } }
            },
            scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: false, grid: { color: chartGrid() }, ticks: { callback: v => v + '%' } }
            }
        }
    });
}

function applyThemeToCharts() {
    const txt = chartTextColor(), grid = chartGrid();
    [chartSolidez, chartRadar, chartPie, chartTime, chartHistory].forEach(ch => {
        if (!ch) return;
        Chart.defaults.color = txt;
        Object.values(ch.options.scales || {}).forEach(sc => {
            if (sc.grid) sc.grid.color = grid;
            if (sc.angleLines) sc.angleLines.color = grid;
            if (sc.ticks) sc.ticks.color = txt;
            if (sc.pointLabels) sc.pointLabels.color = txt;
        });
        if (ch.options.plugins?.legend?.labels) ch.options.plugins.legend.labels.color = txt;
        ch.update('none');
    });
}

function refreshSolidezChart() {
    if (!chartSolidez) return;
    const v = CAND_KEYS.map(k =>
        Math.min(100, Math.max(0, CANDIDATES[k].baseSolidez + state.liveModifiers[k]))
    );
    chartSolidez.data.datasets[0].data = v;
    chartSolidez.update();

    document.querySelectorAll('[data-stat="solidez"]').forEach(el => {
        const k = el.dataset.cand;
        const val = Math.min(100, Math.max(0, CANDIDATES[k].baseSolidez + state.liveModifiers[k]));
        el.textContent = val.toFixed(0);
    });
}

function buildTimeSeries(items) {
    if (!chartTime) return;
    const buckets = {};
    items.forEach(it => {
        const cand = it._cand;
        if (!cand) return;
        const d = new Date(it.pubDate);
        if (isNaN(d)) return;
        const key = d.toISOString().slice(0, 13);
        if (!buckets[key]) buckets[key] = { paloma: 0, cepeda: 0, tigre: 0 };
        buckets[key][cand]++;
    });
    const sorted = Object.keys(buckets).sort();

    const emptyDiv = document.getElementById('chartTimeEmpty');
    const canvas = document.getElementById('chartTime');
    if (sorted.length < 2) {
        if (emptyDiv) emptyDiv.style.display = 'flex';
        canvas.style.opacity = '0.15';
        return;
    }
    if (emptyDiv) emptyDiv.style.display = 'none';
    canvas.style.opacity = '1';

    const labels = sorted.map(k => {
        const d = new Date(k + ':00:00Z');
        return d.toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit' });
    });
    chartTime.data.labels = labels;
    CAND_KEYS.forEach((k, idx) => {
        chartTime.data.datasets[idx].data = sorted.map(b => buckets[b][k]);
    });
    chartTime.update();
}

window.setupCharts = setupCharts;
window.applyThemeToCharts = applyThemeToCharts;
window.refreshSolidezChart = refreshSolidezChart;
window.buildTimeSeries = buildTimeSeries;

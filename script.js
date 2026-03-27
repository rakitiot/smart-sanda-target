let isSimulating = false;
let timer;
let dataKicks = [];

// Inisialisasi Chart.js
const ctx = document.getElementById('liveChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Impact Force',
            borderColor: '#38bdf8',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            data: [],
            fill: true,
            tension: 0.4,
            pointRadius: 5
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#94a3b8' } },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
        },
        plugins: { legend: { labels: { color: '#f8fafc' } } }
    }
});

// Event Listener Tombol
document.getElementById('startBtn').addEventListener('click', function() {
    if (!isSimulating) {
        startSimulation();
    } else {
        stopSimulation();
    }
});

function startSimulation() {
    isSimulating = true;
    const btn = document.getElementById('startBtn');
    btn.innerText = "STOP SIMULATION";
    btn.style.background = "#ef4444";
    btn.style.color = "#fff";
    loopSimulation();
}

function stopSimulation() {
    isSimulating = false;
    const btn = document.getElementById('startBtn');
    btn.innerText = "START SIMULATION";
    btn.style.background = "#38bdf8";
    btn.style.color = "#000";
    clearTimeout(timer);
}

function loopSimulation() {
    if (!isSimulating) return;

    // Delay acak simulasi tendangan (1-4 detik)
    const delay = Math.random() * 3000 + 1000;
    
    const zones = ['head', 'chest', 'l-stomach', 'r-stomach', 'lower'];
    const impact = Math.floor(Math.random() * 450) + 500;
    const speed = Math.floor(Math.random() * 250) + 650;
    const zone = zones[Math.floor(Math.random() * zones.length)];

    processData(impact, speed, zone);

    timer = setTimeout(loopSimulation, delay);
}

function processData(p, s, z) {
    // Update Score Board
    document.getElementById('impactVal').innerText = p;
    document.getElementById('speedVal').innerText = s;
    document.getElementById('zoneText').innerText = "LAST TARGET: " + z.toUpperCase();

    // Update Statistics
    dataKicks.push(p);
    document.getElementById('tKick').innerText = dataKicks.length;
    const avg = Math.round(dataKicks.reduce((a, b) => a + b) / dataKicks.length);
    document.getElementById('aPower').innerText = avg;
    document.getElementById('mPower').innerText = Math.max(...dataKicks);

    // Visual Feedback (Blink target)
    const el = document.getElementById('target-' + z);
    if(el) {
        el.classList.add('show');
        setTimeout(() => el.classList.remove('show'), 400);
    }

    // Chart Update
    const now = new Date();
    const timeLabel = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    
    chart.data.labels.push(timeLabel);
    chart.data.datasets[0].data.push(p);

    if(chart.data.labels.length > 12) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }
    chart.update();
}
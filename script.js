let isSimulating = false;
let timer;
let dataKicks = [];

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
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#94a3b8' } },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
        }
    }
});

document.getElementById('startBtn').addEventListener('click', function() {
    if (!isSimulating) {
        isSimulating = true;
        this.innerText = "STOP SIMULATION";
        this.style.background = "#ef4444";
        this.style.color = "#fff";
        loopSimulation();
    } else {
        isSimulating = false;
        this.innerText = "START SIMULATION";
        this.style.background = "#38bdf8";
        this.style.color = "#000";
        clearTimeout(timer);
    }
});

function loopSimulation() {
    if (!isSimulating) return;
    const delay = Math.random() * 3000 + 1000;
    const zones = ['head', 'chest', 'l-stomach', 'r-stomach', 'lower'];
    const impact = Math.floor(Math.random() * 450) + 500;
    const speed = Math.floor(Math.random() * 250) + 650;
    const zone = zones[Math.floor(Math.random() * zones.length)];
    
    updateData(impact, speed, zone);
    timer = setTimeout(loopSimulation, delay);
}

function updateData(p, s, z) {
    document.getElementById('impactVal').innerText = p;
    document.getElementById('speedVal').innerText = s;
    document.getElementById('zoneText').innerText = "LAST TARGET: " + z.toUpperCase();

    dataKicks.push(p);
    document.getElementById('tKick').innerText = dataKicks.length;
    document.getElementById('aPower').innerText = Math.round(dataKicks.reduce((a,b)=>a+b)/dataKicks.length);
    document.getElementById('mPower').innerText = Math.max(...dataKicks);

    const el = document.getElementById('target-' + z);
    if(el) {
        el.classList.add('show');
        setTimeout(() => el.classList.remove('show'), 400);
    }

    chart.data.labels.push(new Date().toLocaleTimeString());
    chart.data.datasets[0].data.push(p);
    if(chart.data.labels.length > 10) { chart.data.labels.shift(); chart.data.datasets[0].data.shift(); }
    chart.update();
}
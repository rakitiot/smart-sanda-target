let isRunning = false;
let timerVar;
let simVar;
let seconds = 0;
let dataKicks = [];

const ctx = document.getElementById('liveChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Kekuatan Dampak',
            borderColor: '#00d2ff',
            backgroundColor: 'rgba(0, 210, 255, 0.1)',
            data: [],
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
        }
    }
});

// Kontrol Tombol
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');

startBtn.onclick = () => {
    isRunning = true;
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'block';
    startTimer();
    startSimulation();
};

pauseBtn.onclick = () => {
    isRunning = false;
    startBtn.style.display = 'block';
    startBtn.innerText = "LANJUT";
    pauseBtn.style.display = 'none';
    clearInterval(timerVar);
    clearTimeout(simVar);
};

resetBtn.onclick = () => {
    location.reload(); 
};

// Fitur Unduh CSV (Skripsi-ready)
downloadBtn.onclick = downloadCSV;

function startTimer() {
    timerVar = setInterval(() => {
        seconds++;
        let mins = Math.floor(seconds / 60);
        let secs = seconds % 60;
        document.getElementById('timer').innerText = 
            (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs);
    }, 1000);
}

function startSimulation() {
    if (!isRunning) return;
    const delay = Math.random() * 3000 + 1000;
    
    // SESUAIKAN DENGAN JUMLAH TITIK (1-12)
    // 1-8 untuk Depan, 9-12 untuk Belakang
    const z = Math.floor(Math.random() * 12) + 1; 
    
    const p = Math.floor(Math.random() * 400) + 500;
    const s = Math.floor(Math.random() * 200) + 600;

    updateData(p, s, z);
    simVar = setTimeout(startSimulation, delay);
}

function updateData(p, s, z) {
    const timestamp = new Date().toISOString();
    document.getElementById('impactVal').innerText = p;
    document.getElementById('speedVal').innerText = s;
    
    // Tentukan ID Elemen berdasarkan angka sensor
    let targetID;
    if (z <= 8) {
        targetID = 'point-' + z; // point-1 s/d point-8
    } else {
        targetID = 'point-back-' + (z - 8); // point-back-1 s/d point-back-4
    }

    document.getElementById('zoneText').innerText = "TARGET TERAKHIR: " + targetID.toUpperCase();

    // Data Lengkap untuk Riwayat
    dataKicks.push({time: timestamp, impact: p, speed: s, zone: targetID});
    
    document.getElementById('tKick').innerText = dataKicks.length;
    document.getElementById('aPower').innerText = Math.round(dataKicks.reduce((a, b) => a + b.impact, 0) / dataKicks.length);
    document.getElementById('mPower').innerText = Math.max(...dataKicks.map(d => d.impact));

    // VISUAL FEEDBACK (Blink target)
    // Hapus semua efek show yang masih nempel
    document.querySelectorAll('.highlight-point').forEach(el => el.classList.remove('show'));
    
    // Tampilkan titik baru berdasarkan ID yang sudah kita buat tadi
    const targetEl = document.getElementById(targetID);
    if(targetEl) {
        targetEl.classList.add('show');
        setTimeout(() => targetEl.classList.remove('show'), 600); // Blink durasi
    }

    // Chart Update
    chart.data.labels.push(new Date(timestamp).toLocaleTimeString());
    chart.data.datasets[0].data.push(p);
    if(chart.data.labels.length > 10) { chart.data.labels.shift(); chart.data.datasets[0].data.shift(); }
    chart.update();
}

function downloadCSV() {
    if (dataKicks.length === 0) {
        alert("Nggak ada data tendangan!");
        return;
    }

    const csvRows = [];
    csvRows.push(["Timestamp", "Impact Power", "Speed Score", "Zone Target"]); // Header

    dataKicks.forEach(k => {
        csvRows.push([k.time, k.impact, k.speed, k.zone]);
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(row => row.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data_latihan_sanda.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
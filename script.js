// Breathing Exercise
const breathingCircle = document.getElementById('breathing-circle');
const breathingInstruction = document.getElementById('breathing-instruction');
const startBreathingBtn = document.getElementById('start-breathing');
let breathingInterval;

startBreathingBtn.addEventListener('click', () => {
    if (breathingInterval) {
        clearInterval(breathingInterval);
        breathingCircle.classList.remove('active');
        breathingInstruction.textContent = 'Breathe In...';
        startBreathingBtn.textContent = 'Start Breathing';
        breathingInterval = null;
        return;
    }

    startBreathingBtn.textContent = 'Stop Breathing';
    let phase = 'inhale';
    breathingCircle.classList.add('active');
    breathingInterval = setInterval(() => {
        if (phase === 'inhale') {
            breathingInstruction.textContent = 'Breathe In...';
            breathingCircle.style.transform = 'scale(1.5)';
            phase = 'hold';
        } else if (phase === 'hold') {
            breathingInstruction.textContent = 'Hold...';
            phase = 'exhale';
        } else {
            breathingInstruction.textContent = 'Breathe Out...';
            breathingCircle.style.transform = 'scale(1)';
            phase = 'inhale';
        }
    }, 4000); // 4s inhale, 4s hold, 4s exhale
});

// Grounding Exercise
const groundingStep = document.getElementById('grounding-step');
const startGroundingBtn = document.getElementById('start-grounding');
const groundingSteps = [
    'Name 5 things you can see.',
    'Name 4 things you can touch.',
    'Name 3 things you can hear.',
    'Name 2 things you can smell.',
    'Name 1 thing you can taste.'
];
let currentStep = 0;

startGroundingBtn.addEventListener('click', () => {
    if (currentStep >= groundingSteps.length) {
        currentStep = 0;
        groundingStep.textContent = '';
        startGroundingBtn.textContent = 'Start Grounding';
        return;
    }

    groundingStep.textContent = groundingSteps[currentStep];
    startGroundingBtn.textContent = currentStep < groundingSteps.length - 1 ? 'Next Step' : 'Finish';
    currentStep++;
});

// Mood Tracker
const moodSelect = document.getElementById('mood-select');
const moodNotes = document.getElementById('mood-notes');
const logMoodBtn = document.getElementById('log-mood');
const moodChartCanvas = document.getElementById('mood-chart');
const ctx = moodChartCanvas.getContext('2d');

// Load saved moods from localStorage
let moods = JSON.parse(localStorage.getItem('moods')) || [];

const moodChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: moods.map((_, i) => `Entry ${i + 1}`),
        datasets: [{
            label: 'Mood',
            data: moods.map(m => m.value),
            borderColor: '#2c5282',
            fill: false
        }]
    },
    options: {
        scales: {
            y: {
                min: 0,
                max: 5,
                ticks: { stepSize: 1 }
            }
        }
    }
});

logMoodBtn.addEventListener('click', () => {
    const moodValue = parseInt(moodSelect.value);
    const notes = moodNotes.value;
    moods.push({ value: moodValue, notes, timestamp: new Date().toLocaleString() });
    localStorage.setItem('moods', JSON.stringify(moods));

    // Update chart
    moodChart.data.labels = moods.map((_, i) => `Entry ${i + 1}`);
    moodChart.data.datasets[0].data = moods.map(m => m.value);
    moodChart.update();

    moodNotes.value = ''; // Clear notes
});

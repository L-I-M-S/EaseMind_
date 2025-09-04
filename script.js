document.addEventListener('DOMContentLoaded', () => {
    // Initialize Streaks and Data
    let breathingStreak = parseInt(localStorage.getItem('breathingStreak')) || 0;
    let moodStreak = parseInt(localStorage.getItem('moodStreak')) || 0;
    let gratitudeStreak = parseInt(localStorage.getItem('gratitudeStreak')) || 0;
    let mindfulnessStreak = parseInt(localStorage.getItem('mindfulnessStreak')) || 0;
    let lastBreathingDate = localStorage.getItem('lastBreathingDate');
    let lastMoodDate = localStorage.getItem('lastMoodDate');
    let lastGratitudeDate = localStorage.getItem('lastGratitudeDate');
    let lastMindfulnessDate = localStorage.getItem('lastMindfulnessDate');
    const today = new Date().toDateString();

    if (lastBreathingDate !== today) breathingStreak = 0;
    if (lastMoodDate !== today) moodStreak = 0;
    if (lastGratitudeDate !== today) gratitudeStreak = 0;
    if (lastMindfulnessDate !== today) mindfulnessStreak = 0;

    document.getElementById('breathing-streak').textContent = breathingStreak;
    document.getElementById('mood-streak').textContent = moodStreak;
    document.getElementById('gratitude-streak').textContent = gratitudeStreak;
    document.getElementById('mindfulness-streak').textContent = mindfulnessStreak;
    document.getElementById('dash-breathing-streak').textContent = breathingStreak;
    document.getElementById('dash-mood-streak').textContent = moodStreak;
    document.getElementById('dash-gratitude-streak').textContent = gratitudeStreak;
    document.getElementById('dash-mindfulness-streak').textContent = mindfulnessStreak;

    // Onboarding Modal with Focus Trapping
    const onboardingModal = document.getElementById('onboarding-modal');
    const closeOnboardingBtn = document.getElementById('close-onboarding');
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const firstFocusable = closeOnboardingBtn;

    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
        onboardingModal.style.display = 'flex';
        localStorage.setItem('hasSeenOnboarding', 'true');
        firstFocusable.focus();
    }

    function trapFocus(e) {
        const focusable = onboardingModal.querySelectorAll(focusableElements);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
    }

    closeOnboardingBtn.addEventListener('click', () => {
        onboardingModal.style.display = 'none';
        document.removeEventListener('keydown', trapFocus);
    });

    closeOnboardingBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onboardingModal.style.display = 'none';
            document.removeEventListener('keydown', trapFocus);
        }
    });

    onboardingModal.addEventListener('keydown', trapFocus);

    // Daily Quote
    const quotes = [
        'Take a deep breath and embrace the moment.',
        'You are enough just as you are.',
        'Small steps lead to great progress.',
        'Let kindness guide your thoughts today.',
        'You are stronger than you know.'
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteElement = document.getElementById('daily-quote');
    quoteElement.textContent = randomQuote;
    setInterval(() => {
        quoteElement.classList.remove('fade');
        setTimeout(() => {
            quoteElement.textContent = quotes[Math.floor(Math.random() * quotes.length)];
            quoteElement.classList.add('fade');
        }, 500);
    }, 15000);

    // Progress Ring
    function updateProgressRing() {
        const totalActivities = 4;
        let completedToday = 0;
        if (lastBreathingDate === today) completedToday++;
        if (lastMoodDate === today) completedToday++;
        if (lastGratitudeDate === today) completedToday++;
        if (lastMindfulnessDate === today) completedToday++;
        const progress = (completedToday / totalActivities) * 100;
        const circumference = 2 * Math.PI * 50;
        const offset = circumference - (progress / 100) * circumference;
        document.getElementById('progress-ring-fill').style.strokeDashoffset = offset;
        document.getElementById('progress-text').textContent = `${Math.round(progress)}% Today’s Activities`;
    }
    updateProgressRing();

    // Tab Navigation
    window.switchTab = function(tabId) {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        tabBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });
        tabContents.forEach(c => c.classList.remove('active'));
        const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-selected', 'true');
        document.getElementById(tabId).classList.add('active');
        activeBtn.focus();
    };

    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                switchTab(btn.dataset.tab);
            }
        });
    });

    // Quick Actions
    document.getElementById('quick-breathe').addEventListener('click', () => switchTab('breathing'));
    document.getElementById('quick-mood').addEventListener('click', () => switchTab('mood-tracker'));
    document.getElementById('quick-gratitude').addEventListener('click', () => switchTab('gratitude'));

    // Breathing Exercise
    const breathingCircle = document.getElementById('breathing-circle');
    const breathingInstruction = document.getElementById('breathing-instruction');
    const startBreathingBtn = document.getElementById('start-breathing');
    const breathingProgress = document.getElementById('breathing-progress');
    let breathingAnimation;
    let isBreathing = false;
    const phaseDuration = 4000;
    const cycleDuration = phaseDuration * 4;

    function startBreathing() {
        if (isBreathing) {
            cancelAnimationFrame(breathingAnimation);
            breathingCircle.style.transform = 'scale(1)';
            breathingInstruction.textContent = 'Ready to begin?';
            breathingInstruction.classList.add('fade');
            startBreathingBtn.innerHTML = '<i class="fas fa-play"></i> Start';
            breathingProgress.style.width = '0%';
            isBreathing = false;
            return;
        }

        isBreathing = true;
        startBreathingBtn.innerHTML = '<i class="fas fa-stop"></i> Stop';
        breathingStreak++;
        localStorage.setItem('breathingStreak', breathingStreak);
        localStorage.setItem('lastBreathingDate', today);
        document.getElementById('breathing-streak').textContent = breathingStreak;
        document.getElementById('dash-breathing-streak').textContent = breathingStreak;
        updateProgressRing();

        let startTime = performance.now();

        function animate(time) {
            const elapsed = (time - startTime) % cycleDuration;
            const progress = (elapsed / cycleDuration) * 100;
            breathingProgress.style.width = `${progress}%`;

            let phase = Math.floor(elapsed / phaseDuration);
            let phaseProgress = (elapsed % phaseDuration) / phaseDuration;

            breathingInstruction.classList.remove('fade');
            setTimeout(() => breathingInstruction.classList.add('fade'), 50);

            if (phase === 0) {
                breathingInstruction.textContent = 'Inhale...';
                const scale = 1 + (0.5 * phaseProgress);
                breathingCircle.style.transform = `scale(${scale})`;
            } else if (phase === 1) {
                breathingInstruction.textContent = 'Hold...';
                breathingCircle.style.transform = 'scale(1.5)';
            } else if (phase === 2) {
                breathingInstruction.textContent = 'Exhale...';
                const scale = 1.5 - (0.5 * phaseProgress);
                breathingCircle.style.transform = `scale(${scale})`;
            } else {
                breathingInstruction.textContent = 'Hold...';
                breathingCircle.style.transform = 'scale(1)';
            }

            breathingAnimation = requestAnimationFrame(animate);
        }

        breathingAnimation = requestAnimationFrame(animate);
    }

    startBreathingBtn.addEventListener('click', startBreathing);
    startBreathingBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            startBreathing();
        }
    });

    // Grounding Exercise
    const groundingStep = document.getElementById('grounding-step');
    const groundingResponse = document.getElementById('grounding-response');
    const groundingError = document.getElementById('grounding-error');
    const submitResponseBtn = document.getElementById('submit-response');
    const startGroundingBtn = document.getElementById('start-grounding');
    const groundingHistory = document.getElementById('grounding-history');
    const groundingSteps = [
        { prompt: 'Name 5 things you can see.', count: 5 },
        { prompt: 'Name 4 things you can touch.', count: 4 },
        { prompt: 'Name 3 things you can hear.', count: 3 },
        { prompt: 'Name 2 things you can smell.', count: 2 },
        { prompt: 'Name 1 thing you can taste.', count: 1 }
    ];
    let currentStep = -1;
    let responses = [];

    let groundingSessions = JSON.parse(localStorage.getItem('groundingSessions')) || [];
    groundingSessions.forEach(session => appendSessionToHistory(session));

    function appendSessionToHistory(session) {
        const entry = document.createElement('div');
        entry.classList.add('history-entry');
        entry.innerHTML = `<p><strong>${new Date(session.timestamp).toLocaleString()}</strong></p><ul>${session.responses.map(r => `<li>${r.prompt}: ${r.response}</li>`).join('')}</ul>`;
        groundingHistory.appendChild(entry);
    }

    startGroundingBtn.addEventListener('click', () => {
        groundingError.textContent = '';
        if (currentStep === -1) {
            currentStep = 0;
            responses = [];
            groundingResponse.value = '';
            startGroundingBtn.innerHTML = '<i class="fas fa-forward"></i> Next';
            submitResponseBtn.disabled = false;
            displayStep();
        } else if (currentStep < groundingSteps.length) {
            // In progress
        } else {
            currentStep = -1;
            groundingStep.innerHTML = '';
            groundingResponse.value = '';
            startGroundingBtn.innerHTML = '<i class="fas fa-play"></i> Start';
            submitResponseBtn.disabled = true;
        }
    });

    startGroundingBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            startGroundingBtn.click();
        }
    });

    function displayStep() {
        if (currentStep < groundingSteps.length) {
            groundingStep.textContent = groundingSteps[currentStep].prompt;
            groundingStep.classList.remove('fade');
            setTimeout(() => groundingStep.classList.add('fade'), 50);
            groundingResponse.placeholder = `List ${groundingSteps[currentStep].count} items separated by commas...`;
        } else {
            const timestamp = new Date().toISOString();
            const session = { timestamp, responses };
            groundingSessions.push(session);
            localStorage.setItem('groundingSessions', JSON.stringify(groundingSessions));
            appendSessionToHistory(session);
            groundingStep.textContent = 'Well done! Session complete.';
            groundingStep.classList.remove('fade');
            setTimeout(() => groundingStep.classList.add('fade'), 50);
            startGroundingBtn.innerHTML = '<i class="fas fa-redo"></i> Restart';
            submitResponseBtn.disabled = true;
        }
    }

    submitResponseBtn.addEventListener('click', () => {
        const response = groundingResponse.value.trim();
        if (!response) {
            groundingError.textContent = 'Please enter a response.';
            return;
        }
        const items = response.split(',').map(item => item.trim()).filter(item => item);
        if (items.length >= groundingSteps[currentStep].count) {
            responses.push({ prompt: groundingSteps[currentStep].prompt, response });
            currentStep++;
            groundingResponse.value = '';
            groundingError.textContent = '';
            displayStep();
        } else {
            groundingError.textContent = `Please list at least ${groundingSteps[currentStep].count} items.`;
        }
    });

    submitResponseBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            submitResponseBtn.click();
        }
    });

    groundingResponse.addEventListener('input', () => {
        submitResponseBtn.disabled = !groundingResponse.value.trim();
        groundingError.textContent = '';
    });

    // Mood Tracker
    const moodRadios = document.querySelectorAll('input[name="mood"]');
    const moodNotes = document.getElementById('mood-notes');
    const moodError = document.getElementById('mood-error');
    const logMoodBtn = document.getElementById('log-mood');
    const moodChartCanvas = document.getElementById('mood-chart');
    const moodChartTable = document.getElementById('mood-chart-data');
    const moodHistory = document.getElementById('mood-history');
    const ctx = moodChartCanvas.getContext('2d');

    let moods = JSON.parse(localStorage.getItem('moods')) || [];
    updateChart();
    updateHistory();
    updateDashRecentMood();
    updateChartTable();

    function getMoodEmoji(value) {
        const emojis = {1: '😢', 2: '🙁', 3: '😐', 4: '🙂', 5: '😊'};
        return emojis[value] || '😐';
    }

    function updateChart() {
        if (window.moodChart) window.moodChart.destroy();
        window.moodChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: moods.length ? moods.map(m => new Date(m.timestamp).toLocaleDateString()) : ['No Data'],
                datasets: [{
                    label: 'Mood Trend',
                    data: moods.length ? moods.map(m => m.value) : [0],
                    borderColor: '#3182ce',
                    backgroundColor: 'rgba(49, 130, 206, 0.2)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        min: 0.5,
                        max: 5.5,
                        ticks: { stepSize: 1 }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    function updateChartTable() {
        moodChartTable.innerHTML = '';
        moods.forEach(mood => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${new Date(mood.timestamp).toLocaleDateString()}</td><td>${mood.value}/5 (${getMoodEmoji(mood.value)})</td>`;
            moodChartTable.appendChild(row);
        });
    }

    function appendToHistory(mood) {
        const entry = document.createElement('div');
        entry.classList.add('history-entry');
        entry.innerHTML = `
            <p><strong>${new Date(mood.timestamp).toLocaleString()}</strong> - ${getMoodEmoji(mood.value)} (${mood.value}/5)</p>
            ${mood.notes ? `<p>${mood.notes}</p>` : ''}
        `;
        moodHistory.appendChild(entry);
    }

    function updateHistory() {
        moodHistory.innerHTML = '<h3>Past Entries</h3>';
        moods.forEach(appendToHistory);
    }

    function updateDashRecentMood() {
        if (moods.length > 0) {
            const lastMood = moods[moods.length - 1];
            const emoji = getMoodEmoji(lastMood.value);
            document.getElementById('dash-recent-mood').innerHTML = `${emoji} ${lastMood.value}/5 on ${new Date(lastMood.timestamp).toLocaleDateString()}`;
        }
    }

    logMoodBtn.addEventListener('click', () => {
        const selectedMood = document.querySelector('input[name="mood"]:checked');
        if (!selectedMood) {
            moodError.textContent = 'Please select a mood.';
            return;
        }

        const moodValue = parseInt(selectedMood.value);
        const notes = moodNotes.value.trim();
        const timestamp = new Date().toISOString();
        const newMood = { value: moodValue, notes, timestamp };
        moods.push(newMood);
        localStorage.setItem('moods', JSON.stringify(moods));
        moodStreak++;
        localStorage.setItem('moodStreak', moodStreak);
        localStorage.setItem('lastMoodDate', today);
        document.getElementById('mood-streak').textContent = moodStreak;
        document.getElementById('dash-mood-streak').textContent = moodStreak;
        updateProgressRing();

        updateChart();
        updateChartTable();
        appendToHistory(newMood);
        updateDashRecentMood();
        moodNotes.value = '';
        moodRadios.forEach(r => r.checked = false);
        logMoodBtn.disabled = true;
        moodError.textContent = '';
    });

    logMoodBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            logMoodBtn.click();
        }
    });

    moodRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            logMoodBtn.disabled = false;
            moodError.textContent = '';
        });
    });

    // CBT Exercise
    const cbtSituation = document.getElementById('cbt-situation');
    const cbtThought = document.getElementById('cbt-thought');
    const cbtEvidenceFor = document.getElementById('cbt-evidence-for');
    const cbtEvidenceAgainst = document.getElementById('cbt-evidence-against');
    const cbtBalanced = document.getElementById('cbt-balanced');
    const cbtError = document.getElementById('cbt-error');
    const logCbtBtn = document.getElementById('log-cbt');
    const cbtHistory = document.getElementById('cbt-history');

    let cbtRecords = JSON.parse(localStorage.getItem('cbtRecords')) || [];
    cbtRecords.forEach(record => appendCbtToHistory(record));

    function appendCbtToHistory(record) {
        const entry = document.createElement('div');
        entry.classList.add('history-entry');
        entry.innerHTML = `
            <p><strong>${new Date(record.timestamp).toLocaleString()}</strong></p>
            <p><strong>Situation:</strong> ${record.situation}</p>
            <p><strong>Thought:</strong> ${record.thought}</p>
            <p><strong>Evidence For:</strong> ${record.evidenceFor}</p>
            <p><strong>Evidence Against:</strong> ${record.evidenceAgainst}</p>
            <p><strong>Balanced Thought:</strong> ${record.balanced}</p>
        `;
        cbtHistory.appendChild(entry);
    }

    function checkCbtForm() {
        const isValid = (
            cbtSituation.value.trim() &&
            cbtThought.value.trim() &&
            cbtEvidenceFor.value.trim() &&
            cbtEvidenceAgainst.value.trim() &&
            cbtBalanced.value.trim()
        );
        logCbtBtn.disabled = !isValid;
        cbtError.textContent = isValid ? '' : 'Please fill out all fields.';
    }

    [cbtSituation, cbtThought, cbtEvidenceFor, cbtEvidenceAgainst, cbtBalanced].forEach(input => {
        input.addEventListener('input', checkCbtForm);
    });

    logCbtBtn.addEventListener('click', () => {
        if (!cbtSituation.value.trim() || !cbtThought.value.trim() || !cbtEvidenceFor.value.trim() || !cbtEvidenceAgainst.value.trim() || !cbtBalanced.value.trim()) {
            cbtError.textContent = 'Please fill out all fields.';
            return;
        }

        const record = {
            situation: cbtSituation.value.trim(),
            thought: cbtThought.value.trim(),
            evidenceFor: cbtEvidenceFor.value.trim(),
            evidenceAgainst: cbtEvidenceAgainst.value.trim(),
            balanced: cbtBalanced.value.trim(),
            timestamp: new Date().toISOString()
        };
        cbtRecords.push(record);
        localStorage.setItem('cbtRecords', JSON.stringify(cbtRecords));
        appendCbtToHistory(record);
        cbtSituation.value = '';
        cbtThought.value = '';
        cbtEvidenceFor.value = '';
        cbtEvidenceAgainst.value = '';
        cbtBalanced.value = '';
        logCbtBtn.disabled = true;
        cbtError.textContent = '';
    });

    logCbtBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            logCbtBtn.click();
        }
    });

    // Gratitude Journal
    const gratitudeEntry = document.getElementById('gratitude-entry');
    const gratitudeError = document.getElementById('gratitude-error');
    const logGratitudeBtn = document.getElementById('log-gratitude');
    const gratitudeHistory = document.getElementById('gratitude-history');

    let gratitudeEntries = JSON.parse(localStorage.getItem('gratitudeEntries')) || [];
    gratitudeEntries.forEach(entry => appendGratitudeToHistory(entry));

    function appendGratitudeToHistory(entry) {
        const div = document.createElement('div');
        div.classList.add('history-entry');
        div.innerHTML = `<p><strong>${new Date(entry.timestamp).toLocaleString()}</strong></p><p>${entry.text}</p>`;
        gratitudeHistory.appendChild(div);
    }

    gratitudeEntry.addEventListener('input', () => {
        logGratitudeBtn.disabled = !gratitudeEntry.value.trim();
        gratitudeError.textContent = '';
    });

    logGratitudeBtn.addEventListener('click', () => {
        const text = gratitudeEntry.value.trim();
        if (!text) {
            gratitudeError.textContent = 'Please enter a gratitude entry.';
            return;
        }
        const items = text.split(',').map(item => item.trim()).filter(item => item);
        if (items.length < 3) {
            gratitudeError.textContent = 'Please list at least 3 things you’re grateful for.';
            return;
        }
        const entry = { text, timestamp: new Date().toISOString() };
        gratitudeEntries.push(entry);
        localStorage.setItem('gratitudeEntries', JSON.stringify(gratitudeEntries));
        gratitudeStreak++;
        localStorage.setItem('gratitudeStreak', gratitudeStreak);
        localStorage.setItem('lastGratitudeDate', today);
        document.getElementById('gratitude-streak').textContent = gratitudeStreak;
        document.getElementById('dash-gratitude-streak').textContent = gratitudeStreak;
        updateProgressRing();
        appendGratitudeToHistory(entry);
        gratitudeEntry.value = '';
        logGratitudeBtn.disabled = true;
        gratitudeError.textContent = '';
    });

    logGratitudeBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            logGratitudeBtn.click();
        }
    });

    // Mindfulness Meditation
    const mindfulnessInstruction = document.getElementById('mindfulness-instruction');
    const startMindfulnessBtn = document.getElementById('start-mindfulness');
    const mindfulnessProgress = document.getElementById('mindfulness-progress');
    let mindfulnessAnimation;
    let isMeditating = false;
    const meditationDuration = 60000;
    const prompts = [
        'Focus on your breath, notice the air moving in and out.',
        'Observe any thoughts without judgment, let them pass.',
        'Feel your body, notice any sensations calmly.',
        'Return to your breath, stay present in this moment.'
    ];

    function startMindfulness() {
        if (isMeditating) {
            cancelAnimationFrame(mindfulnessAnimation);
            mindfulnessInstruction.textContent = 'Ready to begin?';
            mindfulnessInstruction.classList.add('fade');
            startMindfulnessBtn.innerHTML = '<i class="fas fa-play"></i> Start';
            mindfulnessProgress.style.width = '0%';
            isMeditating = false;
            return;
        }

        isMeditating = true;
        startMindfulnessBtn.innerHTML = '<i class="fas fa-stop"></i> Stop';
        mindfulnessStreak++;
        localStorage.setItem('mindfulnessStreak', mindfulnessStreak);
        localStorage.setItem('lastMindfulnessDate', today);
        document.getElementById('mindfulness-streak').textContent = mindfulnessStreak;
        document.getElementById('dash-mindfulness-streak').textContent = mindfulnessStreak;
        updateProgressRing();

        let startTime = performance.now();
        let promptIndex = 0;

        function animate(time) {
            const elapsed = time - startTime;
            const progress = Math.min((elapsed / meditationDuration) * 100, 100);
            mindfulnessProgress.style.width = `${progress}%`;

            const promptInterval = meditationDuration / prompts.length;
            const newPromptIndex = Math.floor(elapsed / promptInterval);
            if (newPromptIndex < prompts.length && newPromptIndex !== promptIndex) {
                promptIndex = newPromptIndex;
                mindfulnessInstruction.classList.remove('fade');
                setTimeout(() => {
                    mindfulnessInstruction.textContent = prompts[promptIndex];
                    mindfulnessInstruction.classList.add('fade');
                }, 50);
            }

            if (elapsed < meditationDuration) {
                mindfulnessAnimation = requestAnimationFrame(animate);
            } else {
                mindfulnessInstruction.classList.remove('fade');
                setTimeout(() => {
                    mindfulnessInstruction.textContent = 'Well done! Meditation complete.';
                    mindfulnessInstruction.classList.add('fade');
                }, 50);
                startMindfulnessBtn.innerHTML = '<i class="fas fa-redo"></i> Restart';
                isMeditating = false;
            }
        }

        mindfulnessAnimation = requestAnimationFrame(animate);
    }

    startMindfulnessBtn.addEventListener('click', startMindfulness);
    startMindfulnessBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            startMindfulness();
        }
    });

    // Reminder Notification
    function requestNotificationPermission() {
        if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    scheduleReminder();
                }
            });
        } else if (Notification.permission === 'granted') {
            scheduleReminder();
        }
    }

    function scheduleReminder() {
        setInterval(() => {
            const now = new Date();
            if (now.getHours() === 20 && now.getMinutes() === 0 && now.getSeconds() === 0) {
                new Notification('EaseMind Reminder', {
                    body: 'Take a moment to log your mood or try a breathing exercise.',
                    icon: 'https://via.placeholder.com/64' // Replace with actual icon
                });
            }
        }, 1000);
    }

    requestNotificationPermission();
});

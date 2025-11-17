let questions = []; // Will load from JSON
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let timer;
let timeLeft;

async function loadQuestions() {
    const response = await fetch('questions.json');
    questions = await response.json();
}

function startQuiz() {
    const section = document.getElementById('section').value;
    const difficulty = document.getElementById('difficulty').value;
    const mode = document.getElementById('mode').value;
    
    currentQuestions = questions.filter(q => 
        (section === 'all' || q.section === section) &&
        (difficulty === 'all' || q.difficulty === difficulty)
    ).sort(() => 0.5 - Math.random()); // Shuffle
    
    let numQuestions;
    let timeLimit;
    if (mode === 'quiz20') { numQuestions = 20; timeLimit = 20 * 60; }
    else if (mode === 'quiz40') { numQuestions = 40; timeLimit = 40 * 60; }
    else { numQuestions = 100; timeLimit = 90 * 60; } // Mock exam
    
    currentQuestions = currentQuestions.slice(0, numQuestions);
    if (currentQuestions.length < numQuestions) alert('Not enough questions! Generate more.');
    
    // Hide home, show game
    document.body.innerHTML = `
        <div class="container">
            <div id="hud">Score: <span id="score">0</span> | Question: <span id="progress">1/${numQuestions}</span></div>
            <div id="timer">Time: ${formatTime(timeLimit)}</div>
            <div id="question"></div>
            <div id="choices"></div>
            <div id="feedback"></div>
        </div>
    `;
    
    startTimer(timeLimit, numQuestions);
    showQuestion();
}

function showQuestion() {
    if (currentIndex >= currentQuestions.length) return endQuiz();
    
    const q = currentQuestions[currentIndex];
    document.getElementById('question').innerText = q.question;
    const choices = document.getElementById('choices');
    choices.innerHTML = '';
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(i);
        choices.appendChild(btn);
    });
    document.getElementById('progress').innerText = `${currentIndex + 1}/${currentQuestions.length}`;
}

function checkAnswer(selected) {
    const q = currentQuestions[currentIndex];
    const feedback = document.getElementById('feedback');
    if (selected === q.correct) {
        score++;
        feedback.innerText = 'Correct! Hint: ' + q.hint;
    } else {
        feedback.innerText = 'Incorrect. Correct is ' + q.options[q.correct] + '. Hint: ' + q.hint;
    }
    document.getElementById('score').innerText = score;
    setTimeout(() => {
        feedback.innerText = '';
        currentIndex++;
        showQuestion();
    }, 2000);
}

function startTimer(time, numQ) {
    timeLeft = time;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = `Time: ${formatTime(timeLeft)}`;
        if (timeLeft <= 0) endQuiz();
    }, 1000);
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function endQuiz() {
    clearInterval(timer);
    document.body.innerHTML = `
        <div class="container">
            <h1>Quiz Over!</h1>
            <p>Score: ${score} / ${currentQuestions.length}</p>
            <p>For detailed explanations & full syllabus, <a href="YOUR_EBOOK_LINK">buy my eBook</a>.</p>
            <button onclick="location.reload()">Play Again</button>
        </div>
    `;
}

// Init
loadQuestions();
document.getElementById('startBtn').onclick = startQuiz;

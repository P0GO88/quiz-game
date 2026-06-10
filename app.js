let currentQuestion = 0;
let score = 0;
let answered = false;
let selectedAnswer = null;
let captchaAnswer = null;
let shuffledQuizData = [];

function shuffleQuestions() {
    shuffledQuizData = quizData.slice();
    for (let i = shuffledQuizData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledQuizData[i], shuffledQuizData[j]] = [shuffledQuizData[j], shuffledQuizData[i]];
    }
}

function startQuiz() {
    shuffleQuestions();
    currentQuestion = 0;
    score = 0;
    document.querySelector('.start-screen').classList.remove('active');
    document.querySelector('.quiz-container').classList.add('active');
    loadQuestion();
}

function generateCaptcha() {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    captchaAnswer = a + b;
    document.getElementById('captchaQuestion').textContent = `What is ${a} + ${b}?`;
    document.getElementById('captchaAnswer').value = '';
    document.getElementById('captchaError').textContent = '';
}

function verifyCaptcha() {
    const answer = parseInt(document.getElementById('captchaAnswer').value, 10);

    if (Number.isNaN(answer)) {
        document.getElementById('captchaError').textContent = 'Please enter a valid number.';
        return;
    }

    if (answer === captchaAnswer) {
        document.querySelector('.captcha-screen').classList.remove('active');
        document.querySelector('.start-screen').classList.add('active');
    } else {
        document.getElementById('captchaError').textContent = 'Captcha incorrect. Try a new challenge.';
        generateCaptcha();
    }
}

window.addEventListener('DOMContentLoaded', generateCaptcha);

function loadQuestion() {
    const question = shuffledQuizData[currentQuestion];
    document.getElementById('questionNumber').textContent = `Question ${currentQuestion + 1} of ${shuffledQuizData.length}`;
    document.getElementById('questionText').textContent = question.question;
    
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option;
        button.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(button);
    });

    updateProgressBar();
    resetFeedback();
    answered = false;
    selectedAnswer = null;
    document.getElementById('nextButton').classList.remove('show');
}

function selectAnswer(index) {
    if (answered) return;

    answered = true;
    selectedAnswer = index;
    const question = shuffledQuizData[currentQuestion];
    const options = document.querySelectorAll('.option');
    const isCorrect = checkAnswer(index, question);

    options.forEach((option, i) => {
        option.disabled = true;
        if (i === question.correct) {
            option.classList.add('correct');
        } else if (i === index && index !== question.correct) {
            option.classList.add('incorrect');
        }
    });

    updateScore(isCorrect);
    displayFeedback(isCorrect, question);
    document.getElementById('nextButton').classList.add('show');
}

function checkAnswer(index, question) {
    return index === question.correct;
}

function updateScore(isCorrect) {
    if (isCorrect) {
        score++;
    }
}

function displayFeedback(isCorrect, question) {
    const feedback = document.getElementById('feedback');

    if (isCorrect) {
        feedback.textContent = '✓ Correct! Well done!';
        feedback.classList.add('correct');
    } else {
        feedback.textContent = `✗ Wrong! The correct answer is: ${question.options[question.correct]}`;
        feedback.classList.add('incorrect');
    }
    feedback.classList.add('show');
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < shuffledQuizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    document.querySelector('.quiz-container').classList.remove('active');
    document.querySelector('.results-container').classList.add('active');
    
    document.getElementById('scoreDisplay').textContent = `${score}/${shuffledQuizData.length}`;
    
    let message = '';
    const percentage = (score / shuffledQuizData.length) * 100;

    if (percentage === 100) {
        message = "🌟 Perfect Score! You're an animal expert!";
    } else if (percentage >= 80) {
        message = "🎉 Excellent work! You know your animals!";
    } else if (percentage >= 60) {
        message = "👏 Good job! You did well!";
    } else if (percentage >= 40) {
        message = "💪 Not bad! Keep learning about animals!";
    } else {
        message = "🔄 Nice try! Learn more and try again!";
    }

    document.getElementById('scoreMessage').textContent = message;
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    answered = false;
    selectedAnswer = null;
    document.querySelector('.results-container').classList.remove('active');
    document.querySelector('.start-screen').classList.add('active');
}

function updateProgressBar() {
    const progress = ((currentQuestion + 1) / shuffledQuizData.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

function resetFeedback() {
    const feedback = document.getElementById('feedback');
    feedback.classList.remove('show', 'correct', 'incorrect');
    feedback.textContent = '';
}

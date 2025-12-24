/* ================= DOM ELEMENT REFERENCES ================= */
/* Configuration (start) screen */
const configContainer = document.querySelector(".container");

/* Quiz screen */
const quizContainer = document.querySelector(".quiz-container");

/* List where answer options are displayed */
const answerOptions = document.querySelector(".answer-options");

/* Next question button */
const nextQuestionBtn = document.querySelector(".next-question-btn");

/* Displays question progress */
const questionStatus = document.querySelector(".question-status");

/* Timer display */
const timeDisplay = document.querySelector(".time-duration");

/* Result screen */
const resultContainer = document.querySelector(".result-container");


/* ================= QUIZ SETTINGS & STATE VARIABLES ================= */

/* Time limit per question (seconds) */
const QUIZ_TIME_LIMIT = 15;

/* Current remaining time */
let currentTime = QUIZ_TIME_LIMIT;

/* Timer reference */
let timer = null;

/* Default quiz category .These values exist just to avoid undefined errors */
let quizCategory = "Programming";

/* Default number of questions .These values exist just to avoid undefined errors*/
let numberOfQuestions = 10;

/* Currently displayed question object */
let currentQuestion = null;

/* Stores indexes of already asked questions */
const questionIndexHistory = [];

/* Tracks correct answers */
let correctAnswersCount = 0;
 

/* ================= SHOW QUIZ RESULT ================= */
/* Displays result screen and hides quiz screen */
const showQuizResult = () => {
   quizContainer.style.display = "none";
   resultContainer.style.display = "block";

   /* Result summary message */
   const resultText = `You answered <b>${correctAnswersCount}</b> out of <b>${numberOfQuestions}</b> 
    questions correctly. Great effort!`;

   document.querySelector(".result-message").innerHTML = resultText;
}


/* ================= TIMER FUNCTIONS ================= */
/* Reset timer to default value */
const resetTimer = () => {
    clearInterval(timer);
    currentTime = QUIZ_TIME_LIMIT;
    timeDisplay.textContent = `${currentTime}s`;
}


/* Start countdown timer */
const startTimer = () => {
    timer = setInterval(() => {
       currentTime--;
       timeDisplay.textContent = `${currentTime}s`;

       /* If time runs out */
       if (currentTime <= 0) {
         clearInterval(timer);

         /* Highlight correct answer automatically */
         highlightCorrectAnswer();

         /* Show next button */
         nextQuestionBtn.style.visibility = "visible";

         /* Change timer color to red */
         quizContainer.querySelector(".quiz-timer").style.background = "#c31402";

         /* Disable all answer clicks */
         answerOptions
           .querySelectorAll(".answer-option")
           .forEach(option => option.style.pointerEvents = "none");
       }
    }, 1000);
}


/* ================= QUESTION SELECTION ================= */
/* Selects a random question without repetition */
const getRandomQuestion = () => {

    /* Get questions of selected category */
    const categoryQuestions =
      questions.find(cat => cat.category.toLowerCase() === quizCategory.toLowerCase()).questions || [];

    /* If quiz is complete, show result */
    if (questionIndexHistory.length >= Math.min(categoryQuestions.length, numberOfQuestions)) {
        return showQuizResult();
    }

    /* Filter out already used questions */
    const availableQuestions = categoryQuestions.filter(
        (_, index) => !questionIndexHistory.includes(index)
    );

    /* Pick random question */
    const randomQuestion =
      availableQuestions[Math.floor(Math.random() * availableQuestions.length)];

    /* Store used question index */
    questionIndexHistory.push(categoryQuestions.indexOf(randomQuestion));

    return randomQuestion;
}


/* ================= ANSWER HANDLING ================= */
/* Highlights the correct answer */
const highlightCorrectAnswer = () => {
    const correctOption =
      answerOptions.querySelectorAll(".answer-option")[currentQuestion.correctAnswer];

    correctOption.classList.add("correct");

    /* Add correct icon */
    const iconHTML = `<span class="material-symbols-rounded">check_circle</span>`;
    correctOption.insertAdjacentHTML("beforeend", iconHTML);
}


/* Handle user answer click */
const handleAnswer = (option, answerIndex) => {
    clearInterval(timer);

    /* Check correctness */
    const isCorrect = currentQuestion.correctAnswer === answerIndex;

    /* Apply correct/incorrect styling */
    option.classList.add(isCorrect ? 'correct' : 'incorrect');

    /* Update score or highlight correct answer */
    !isCorrect ? highlightCorrectAnswer() : correctAnswersCount++;

    /* Add feedback icon */
    const iconHTML = `
      <span class="material-symbols-rounded">
        ${isCorrect ? 'check_circle' : 'cancel'}
      </span>`;
    option.insertAdjacentHTML("beforeend", iconHTML);

    /* Disable all options */
    answerOptions
      .querySelectorAll(".answer-option")
      .forEach(option => option.style.pointerEvents = "none");

    /* Show next button */
    nextQuestionBtn.style.visibility = "visible";
}


/* ================= RENDER QUESTION ================= */
/* Displays a new question */
const renderQuestion = () => {
    currentQuestion = getRandomQuestion();
    if (!currentQuestion) return;

    resetTimer();
    startTimer();

    /* Clear previous answers */
    answerOptions.innerHTML = "";

    /* Hide next button */
    nextQuestionBtn.style.visibility = "hidden";

    /* Reset timer color */
    quizContainer.querySelector(".quiz-timer").style.background = "#32313C";

    /* Set question text */
    document.querySelector(".question-text").textContent = currentQuestion.question;

    /* Update question status */
    questionStatus.innerHTML =
      `<b>${questionIndexHistory.length}</b><b> of</b><b>${numberOfQuestions}</b> Questions`;

    /* Render answer options */
    currentQuestion.options.forEach((option, index) => {
        const li = document.createElement("li");
        li.classList.add("answer-option");
        li.textContent = option;
        answerOptions.appendChild(li);

        /* Click event for answer */
        li.addEventListener("click", () => handleAnswer(li, index));
    });
}


/* ================= START QUIZ ================= */
/* Hides configuration and starts quiz */
const startQuiz = () => {
    configContainer.style.display = "none";
    quizContainer.style.display = "block";

    /* Get selected category & question count */
    quizCategory =
      configContainer.querySelector(".option.active").textContent;

    numberOfQuestions =
      parseInt(configContainer.querySelector(".ques-option.active").textContent);

    renderQuestion();
}


/* ================= OPTION SELECTION ================= */
/* Handles active button styling */
document.querySelectorAll(".options .option, .ques-option").forEach(option => {
    option.addEventListener("click", () => {
       const activeBtn = option.parentNode.querySelector(".active");
       if (activeBtn) activeBtn.classList.remove("active");
       option.classList.add("active");
    });
});


/* ================= RESET QUIZ ================= */
/* Resets quiz and returns to configuration screen */
const resetQuiz = () => {
    resetTimer();
    correctAnswersCount = 0;
    questionIndexHistory.length = 0;

    quizContainer.style.display = "none";
    configContainer.style.display = "block";
    resultContainer.style.display = "none";
}


/* ================= EVENT LISTENERS ================= */
nextQuestionBtn.addEventListener("click", renderQuestion);
document.querySelector(".try-again-btn").addEventListener("click", resetQuiz);
document.querySelector(".start-quiz").addEventListener("click", startQuiz);


/* ================= DEFAULT SELECTIONS ================= */
/* Ensures quiz can start without errors */
document.querySelector(".options .option").classList.add("active");
document.querySelector(".ques-option").classList.add("active");

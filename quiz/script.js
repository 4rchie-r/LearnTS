document.addEventListener('DOMContentLoaded', () => {
    const resultsContainer = document.querySelector('.results-container');
    const nextButton = document.getElementById('nextButton');
    const scoreElement = document.getElementById('score');
    const totalQuestionsElement = document.getElementById('totalQuestions');
    
    let currentQuestionIndex = 0;
    let results = [];
    
    // fetch quiz questions and answers from quiz.json
    fetch('quiz.json')
        .then(response => response.json())
        .then(data => {
            console.log('Quiz data fetched:', data); // line for debuggin
            results = data.map(question => ({
                question: question.question,
                options: question.options,
                correctAnswer: question.answer,
                userAnswer: null // placeholder
            }));
            initializeQuiz();
        })
        .catch(error => {
            console.error('Error fetching quiz data:', error);
        });

    function initializeQuiz() {
        document.getElementById('startQuiz').addEventListener('click', () => {
            document.getElementById('quiz').style.display = 'none';
            document.getElementById('results').style.display = 'block';
            showQuestion(currentQuestionIndex);
        });

        nextButton.addEventListener('click', () => {
            if (currentQuestionIndex < results.length) {
                currentQuestionIndex++;
                if (currentQuestionIndex < results.length) {
                    showQuestion(currentQuestionIndex);
                } else {
                    displayFinalResults();
                }
            }
        });
    }

    function showQuestion(index) {
        const result = results[index];
        if (!result) {
            console.error('No result found for index:', index); 
            return;
        }

        resultsContainer.innerHTML = ''; // clearing previous content

        const questionElement = document.createElement('div');
        questionElement.className = 'results-item';
        questionElement.innerHTML = `
            <h5>Question ${index + 1}: ${result.question}</h5>
            <ul id="optionsList"></ul>
        `;
        resultsContainer.appendChild(questionElement);

        const optionsList = document.getElementById('optionsList');
        result.options.forEach(option => {
            const optionElement = document.createElement('li');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => {
                results[index].userAnswer = option;
                nextButton.style.display = 'block';
                document.querySelectorAll('.option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                optionElement.classList.add('selected');
            });
            optionsList.appendChild(optionElement);
        });

        nextButton.style.display = 'none'; // hide next button until an option is selected
    }

    function displayFinalResults() {
        resultsContainer.innerHTML = ''; 

        let resultIndex = 0;
        function showResult() {
            if (resultIndex >= results.length) {
                nextButton.style.display = 'none'; 
                return;
            }

            const result = results[resultIndex];
            const resultElement = document.createElement('div');
            resultElement.className = 'results-item';
            resultElement.innerHTML = `
                <h5>Question ${resultIndex + 1}: ${result.question}</h5>
                <p>Your Answer: <span class="answer">${result.userAnswer || 'Not answered'}</span></p>
                <p>Correct Answer: <span class="answer">${result.correctAnswer}</span></p>
            `;
            resultsContainer.appendChild(resultElement);

            // Show next result
            nextButton.addEventListener('click', () => {
                resultElement.style.display = 'none'; // hide current result
                resultIndex++;
                showResult(); // show next result
            });
        }

        // display first result
        showResult();

        // show final score
        const correctAnswersCount = results.filter(result => result.userAnswer === result.correctAnswer).length;
        scoreElement.textContent = correctAnswersCount;
        totalQuestionsElement.textContent = results.length;
    }
});

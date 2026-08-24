const aiQuestion = document.getElementById("aiQuestion");
const aiAskButton = document.getElementById("aiAskButton");


// ==========================================
// CREATE RESPONSE AREA
// ==========================================

function createResponseArea() {

    let response = document.getElementById("aiResponse");

    if (!response) {

        response = document.createElement("div");

        response.id = "aiResponse";

        response.innerHTML = `
            <div class="ai-response-top">

                <div class="ai-response-brand">

                    <span class="ai-response-orb">
                        ✦
                    </span>

                    <div>
                        <strong>Finny AI</strong>
                        <small>Financial Intelligence</small>
                    </div>

                </div>

                <span class="ai-response-label">
                    AI RESPONSE
                </span>

            </div>

            <div class="ai-response-text"></div>
        `;

        const askArea =
            document.querySelector(".ask-area");

        if (askArea) {
            askArea.appendChild(response);
        }
    }

    return response;
}


// ==========================================
// SHOW THINKING
// ==========================================

function showThinking() {

    const response =
        createResponseArea();

    const text =
        response.querySelector(
            ".ai-response-text"
        );

    text.innerHTML = `
        <span class="thinking-text">
            Finny is thinking
            <span class="thinking-dots">•••</span>
        </span>
    `;

    response.classList.add(
        "show-ai-response"
    );
}


// ==========================================
// SHOW ANSWER
// ==========================================

function showAnswer(answer) {

    const response =
        createResponseArea();

    const text =
        response.querySelector(
            ".ai-response-text"
        );

    text.textContent = answer;

    response.classList.add(
        "show-ai-response"
    );
}


// ==========================================
// ASK OPENAI THROUGH YOUR BACKEND
// ==========================================

async function askAI(question) {

    if (!question.trim()) {

        aiQuestion.focus();

        return;
    }

    showThinking();

    try {

        const response = await fetch(
            "http://localhost:5000/api/ai",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    message: question
                })
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "AI request failed."
            );

        }


        showAnswer(
            data.answer
        );


    } catch (error) {

        console.error(
            "AI Assistant Error:",
            error
        );

        showAnswer(
            "Sorry, I couldn't connect to Finny AI right now. Please make sure your backend server is running."
        );

    }

}


// ==========================================
// ASK BUTTON
// ==========================================

if (aiAskButton) {

    aiAskButton.addEventListener(
        "click",
        () => {

            askAI(
                aiQuestion.value.trim()
            );

        }
    );

}


// ==========================================
// ENTER KEY
// ==========================================

if (aiQuestion) {

    aiQuestion.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                event.preventDefault();

                aiAskButton.click();

            }

        }
    );

}


// ==========================================
// QUICK QUESTION CARDS
// ==========================================

document
    .querySelectorAll(".ask-card")
    .forEach((card) => {

        card.addEventListener(
            "click",
            () => {

                const text =
                    card.innerText.toLowerCase();

                let question = "";


                if (
                    text.includes("market")
                ) {

                    question =
                        "Explain how market trends work.";

                }

                else if (
                    text.includes("portfolio")
                ) {

                    question =
                        "How should I understand portfolio performance?";

                }

                else if (
                    text.includes("news")
                ) {

                    question =
                        "Explain how financial news can affect markets.";

                }

                else if (
                    text.includes("invest")
                ) {

                    question =
                        "Explain investing for a beginner.";

                }


                if (question) {

                    aiQuestion.value =
                        question;

                    askAI(question);

                }

            }
        );

    });


console.log(
    "✓ Finny AI connected to backend"
);
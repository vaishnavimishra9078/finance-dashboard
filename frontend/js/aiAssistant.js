const chatBox = document.getElementById("chatBox");
const userMessage = document.getElementById("userMessage");
const sendBtn = document.getElementById("sendBtn");
const aiError = document.getElementById("aiError");

function addMessage(sender, message) {
    const messageDiv = document.createElement("div");

    messageDiv.style.marginBottom = "12px";

    messageDiv.innerHTML = `
        <strong>${sender}:</strong>
        <p style="margin:4px 0;">${message}</p>
    `;

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function getAIResponse(message) {
    const text = message.toLowerCase();

    if (text.includes("stock")) {
        return "Stocks represent ownership in companies. Their prices can rise or fall based on company performance, economic conditions, and investor sentiment.";
    }

    if (text.includes("diversif")) {
        return "Diversification means spreading investments across different assets, sectors, or companies instead of relying heavily on one investment.";
    }

    if (text.includes("risk")) {
        return "Investment risk is the possibility that an investment loses value or performs differently than expected. Your time horizon and goals are important when considering risk.";
    }

    if (text.includes("portfolio")) {
        return "A portfolio is a collection of investments such as stocks, funds, or other assets. Diversifying a portfolio can help manage concentration risk.";
    }

    if (text.includes("pe ratio") || text.includes("p/e")) {
        return "The P/E ratio compares a company's share price with its earnings per share. It is commonly used to compare how highly investors value companies relative to their earnings.";
    }

    if (text.includes("dividend")) {
        return "A dividend is a payment that some companies make to shareholders, usually from company profits.";
    }

    return "I can help explain basic investing topics such as stocks, portfolios, diversification, risk, dividends, and financial metrics.";
}

sendBtn.addEventListener("click", () => {
    const message = userMessage.value.trim();

    if (!message) {
        aiError.textContent = "Please enter a question.";
        aiError.style.display = "block";
        return;
    }

    aiError.style.display = "none";

    addMessage("You", message);

    userMessage.value = "";

    const response = getAIResponse(message);

    setTimeout(() => {
        addMessage("AI Assistant", response);
    }, 400);
});

userMessage.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        sendBtn.click();
    }
});
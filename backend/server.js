const { GoogleGenAI } = require("@google/genai");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const newsRouter = require("./routes/news");
const stocksRouter = require("./routes/stocks");

const app = express();

app.use(cors());
app.use(express.json());


// ===============================
// HEALTH CHECK
// ===============================

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Backend is running"
    });
});


// ===============================
// STOCK ROUTES
// ===============================

app.use("/api/stocks", stocksRouter);


// ===============================
// NEWS ROUTES
// ===============================

app.use("/api/news", newsRouter);


// ==========================================
// GEMINI AI ASSISTANT
// ==========================================

app.post("/api/ai", async (req, res) => {

    try {

        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                error: "Please enter a question."
            });
        }

        const response = await ai.models.generateContent({

            model: "gemini-3.6-flash",

            contents: `
You are Finny AI, a friendly financial education
assistant inside a Finance Intelligence Dashboard.

Give clear, useful and easy-to-understand answers.

You can explain:

- stocks
- investing
- portfolios
- diversification
- financial ratios
- market concepts
- financial news concepts
- investment risk
- company analysis

Do not pretend to know live stock prices or breaking
news unless the application provides that information.

Do not give personalized financial advice.

Keep answers clear, helpful and easy to understand.

User question:

${message}
            `
        });

        const answer = response.text;

        res.json({
            answer: answer
        });

    } catch (error) {

        console.error("GEMINI AI ERROR:", error);

        res.status(500).json({
            error: "Unable to get a response from Finny AI."
        });

    }

});


// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
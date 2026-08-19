
const express = require("express");
const cors = require("cors");
require("dotenv").config();
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
app.use("/api/news", newsRouter);







// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
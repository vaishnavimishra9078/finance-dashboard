const express = require("express");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        message: "Backend is working!"
    });
});

app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});
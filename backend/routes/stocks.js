const express = require("express");
const router = express.Router();

const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY;

router.get("/:ticker", async (req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase();

    const url =
      `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(ticker)}` +
      `&apikey=${TWELVE_DATA_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    // Twelve Data returned an error
    if (data.status === "error") {
      console.error("Twelve Data error:", data);
      return res.status(400).json({
        error: data.message || "Unable to fetch stock data"
      });
    }

    res.json({
      symbol: data.symbol,
      price: data.close,
      change: data.change,
      changePercent: data.percent_change
    });

  } catch (error) {
    console.error("Stock route error:", error);

    res.status(500).json({
      error: "Failed to fetch stock data"
    });
  }
});

module.exports = router;
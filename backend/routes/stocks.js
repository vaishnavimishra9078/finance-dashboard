const express = require("express");
const router = express.Router();


// =====================================================
// HISTORY ROUTE
// IMPORTANT: Keep this BEFORE /:ticker
// =====================================================

router.get("/:ticker/history/:date", async (req, res) => {
    const { ticker, date } = req.params;
    const apiKey = process.env.ALPHA_VANTAGE_KEY;

    try {
        const url =
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=full&apikey=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        console.log("Alpha Vantage history response:", data);

        // Check Alpha Vantage rate limit
        if (data.Information) {
            return res.status(429).json({
                error: "Alpha Vantage rate limit reached",
                message: data.Information
            });
        }

        // Check Alpha Vantage API error
        if (data["Error Message"]) {
            return res.status(400).json({
                error: "Invalid ticker",
                message: data["Error Message"]
            });
        }

        const series = data["Time Series (Daily)"];

        if (!series) {
            return res.status(404).json({
                error: "No historical data found"
            });
        }

        // Find requested date or closest previous trading day
        let priceOnDate = null;
        let checkDate = new Date(date);

        for (let i = 0; i < 7; i++) {
            const dateStr =
                checkDate.toISOString().split("T")[0];

            if (series[dateStr]) {
                priceOnDate =
                    parseFloat(series[dateStr]["4. close"]);
                break;
            }

            checkDate.setDate(
                checkDate.getDate() - 1
            );
        }

        // Find latest available trading date
        const dates =
            Object.keys(series).sort().reverse();

        if (dates.length === 0) {
            return res.status(404).json({
                error: "No historical trading data found"
            });
        }

        const latestDate = dates[0];

        const latestPrice =
            parseFloat(series[latestDate]["4. close"]);

        if (!priceOnDate) {
            return res.status(404).json({
                error: "No trading data near that date"
            });
        }

        res.json({
            ticker: ticker,
            dateRequested: date,
            priceOnDate: priceOnDate,
            latestPrice: latestPrice,
            latestDate: latestDate
        });

    } catch (err) {

        console.error("History route error:", err);

        res.status(500).json({
            error: "Failed to fetch historical data"
        });
    }
});


// =====================================================
// NORMAL STOCK QUOTE ROUTE
// =====================================================

router.get("/:ticker", async (req, res) => {

    const { ticker } = req.params;
    const apiKey = process.env.ALPHA_VANTAGE_KEY;

    try {

        const url =
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        console.log(
            `Alpha Vantage response for ${ticker}:`,
            data
        );

        // Check API rate limit
        if (data.Information) {
            return res.status(429).json({
                error: "Alpha Vantage rate limit reached",
                message: data.Information
            });
        }

        // Check API error
        if (data["Error Message"]) {
            return res.status(400).json({
                error: "Invalid ticker",
                message: data["Error Message"]
            });
        }

        const quote = data["Global Quote"];

        if (!quote || Object.keys(quote).length === 0) {
            return res.status(404).json({
                error: "Ticker not found"
            });
        }

        res.json({
            symbol: quote["01. symbol"],
            price: quote["05. price"],
            change: quote["09. change"],
            changePercent: quote["10. change percent"]
        });

    } catch (err) {

        console.error("Stock route error:", err);

        res.status(500).json({
            error: "Failed to fetch stock data"
        });
    }
});


module.exports = router;
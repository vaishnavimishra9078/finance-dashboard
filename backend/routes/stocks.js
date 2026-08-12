const express = require('express');
const router = express.Router();

router.get('/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const apiKey = process.env.ALPHA_VANTAGE_KEY;

  try {
    const url =
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log(`Alpha Vantage response for ${ticker}:`, data);

    // Check API limit message
    if (data.Information) {
      return res.status(429).json({
        error: 'Alpha Vantage rate limit reached',
        message: data.Information
      });
    }

    // Check API error
    if (data['Error Message']) {
      return res.status(400).json({
        error: 'Invalid ticker',
        message: data['Error Message']
      });
    }

    const quote = data['Global Quote'];

    if (!quote || Object.keys(quote).length === 0) {
      return res.status(404).json({
        error: 'Ticker not found'
      });
    }

    res.json({
      symbol: quote['01. symbol'],
      price: quote['05. price'],
      change: quote['09. change'],
      changePercent: quote['10. change percent']
    });

  } catch (err) {
    console.error('Stock route error:', err);

    res.status(500).json({
      error: 'Failed to fetch stock data'
    });
  }
});

module.exports = router;
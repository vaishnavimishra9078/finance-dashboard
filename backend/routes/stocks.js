const express = require('express');
const router = express.Router();

router.get('/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const apiKey = process.env.ALPHA_VANTAGE_KEY;

  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    const quote = data['Global Quote'];
    if (!quote || Object.keys(quote).length === 0) {
      return res.status(404).json({ error: 'Ticker not found' });
    }

    res.json({
      symbol: quote['01. symbol'],
      price: quote['05. price'],
      change: quote['09. change'],
      changePercent: quote['10. change percent']
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

module.exports = router;
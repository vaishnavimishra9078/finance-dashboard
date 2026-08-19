const express = require('express');
const router = express.Router();

// Basic keyword-based sentiment
const POSITIVE_WORDS = [
  'surge',
  'gain',
  'growth',
  'rise',
  'profit',
  'beat',
  'strong',
  'record',
  'up',
  'jump',
  'soar',
  'rally'
];

const NEGATIVE_WORDS = [
  'fall',
  'drop',
  'loss',
  'decline',
  'weak',
  'miss',
  'plunge',
  'crash',
  'down',
  'cut',
  'lawsuit',
  'recall'
];

function getSentiment(text) {
  const lower = text.toLowerCase();
  let score = 0;

  POSITIVE_WORDS.forEach(word => {
    if (lower.includes(word)) score++;
  });

  NEGATIVE_WORDS.forEach(word => {
    if (lower.includes(word)) score--;
  });

  if (score > 0) return 'positive';
  if (score < 0) return 'negative';

  return 'neutral';
}

router.get('/:query', async (req, res) => {
  const { query } = req.params;
  const apiKey = process.env.NEWS_API_KEY;

  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=10&apiKey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.articles) {
      return res.status(404).json({
        error: 'No articles found'
      });
    }

    const articles = data.articles.map(article => ({
      title: article.title,
      source: article.source.name,
      url: article.url,
      publishedAt: article.publishedAt,
      sentiment: getSentiment(
        article.title + ' ' + (article.description || '')
      )
    }));

    res.json({ articles });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Failed to fetch news'
    });
  }
});

module.exports = router;
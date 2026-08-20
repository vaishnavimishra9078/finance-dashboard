const BACKEND_URL = 'https://finance-dashboard-api-yoye.onrender.com';

document.getElementById('newsSearchBtn').addEventListener('click', async () => {
  const query = document.getElementById('newsQuery').value.trim();
  const resultsDiv = document.getElementById('newsResults');
  const errorMsg = document.getElementById('errorMsg');

  resultsDiv.innerHTML = '';
  errorMsg.style.display = 'none';

  if (!query) {
    errorMsg.textContent = 'Please enter a search term.';
    errorMsg.style.display = 'block';
    return;
  }

  try {
    const res = await fetch(
      `${BACKEND_URL}/api/news/${encodeURIComponent(query)}`
    );

    if (!res.ok) {
      throw new Error('No results');
    }

    const data = await res.json();

    data.articles.forEach(article => {
      const colorMap = {
        positive: 'var(--accent)',
        negative: 'var(--danger)',
        neutral: '#888'
      };

      const card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = `
        <a
          href="${article.url}"
          target="_blank"
          style="color: var(--text); text-decoration: none;"
        >
          <strong>${article.title}</strong>
        </a>

        <p style="font-size: 12px; color: #888; margin-top: 4px;">
          ${article.source} ·
          ${new Date(article.publishedAt).toLocaleDateString()}
        </p>

        <span
          style="
            color: ${colorMap[article.sentiment]};
            font-size: 12px;
            text-transform: uppercase;
          "
        >
          ${article.sentiment}
        </span>
      `;

      resultsDiv.appendChild(card);
    });

  } catch (err) {
    errorMsg.textContent =
      'Could not load news. Try a different search.';
    errorMsg.style.display = 'block';
  }
});
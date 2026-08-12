

document.getElementById("compareBtn").addEventListener("click", async () => {
  const ticker1 = document.getElementById("ticker1").value.trim().toUpperCase();
  const ticker2 = document.getElementById("ticker2").value.trim().toUpperCase();
  const ticker3 = document.getElementById("ticker3").value.trim().toUpperCase();

  const tickers = [ticker1, ticker2, ticker3].filter(ticker => ticker !== "");

  const resultsDiv = document.getElementById("comparisonResults");
  const errorMsg = document.getElementById("errorMsg");

  resultsDiv.innerHTML = "";
  errorMsg.style.display = "none";

  // At least 2 tickers are required
  if (tickers.length < 2) {
    errorMsg.textContent = "Enter at least 2 tickers to compare.";
    errorMsg.style.display = "block";
    return;
  }

  try {
    const results = [];

    // Fetch one ticker at a time
    // Wait 1.2 seconds between requests because of the API rate limit
    for (let i = 0; i < tickers.length; i++) {
      const ticker = tickers[i];

      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 1200));
      }

      const url = `${BACKEND_URL}/api/stocks/${ticker}`;

      console.log("Fetching:", url);

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`${ticker} not found`);
      }

      const data = await res.json();

      results.push(data);
    }

    // Create a card for each company
    results.forEach(data => {
      const isPositive = parseFloat(data.change) >= 0;

      const card = document.createElement("div");

      card.className = "card";
      card.style.minWidth = "200px";

      card.innerHTML = `
        <h3>${data.symbol}</h3>

        <p>Price: $${data.price}</p>

        <p style="color: ${
          isPositive ? "var(--accent)" : "var(--danger)"
        }">
          ${data.change} (${data.changePercent})
        </p>
      `;

      resultsDiv.appendChild(card);
    });

  } catch (err) {
    console.error("Comparison error:", err);

    errorMsg.textContent = `Error: ${err.message}`;
    errorMsg.style.display = "block";
  }
});
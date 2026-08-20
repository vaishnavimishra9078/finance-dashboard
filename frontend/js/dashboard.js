const DASHBOARD_BACKEND_URL = 'http://localhost:5000';

async function loadDashboardSummary() {

  // -----------------------------
  // Portfolio Summary
  // -----------------------------

  const holdings = JSON.parse(
    localStorage.getItem('portfolioHoldings') || '[]'
  );

  let totalValue = 0;
  let totalCost = 0;

  for (const h of holdings) {

    let price = Number(h.buyPrice) || 0;

    try {
      const res = await fetch(
        `${DASHBOARD_BACKEND_URL}/api/stocks/${h.ticker}`
      );

      const data = await res.json();

      if (data.price) {
        price = parseFloat(data.price);
      }

    } catch (err) {
      console.log(`Could not fetch ${h.ticker}`);
    }

    totalValue += price * Number(h.qty);
    totalCost += Number(h.buyPrice) * Number(h.qty);
  }

  const portfolioValue =
    document.getElementById('dashPortfolioValue');

  const portfolioPL =
    document.getElementById('dashPortfolioPL');

  if (portfolioValue) {
    portfolioValue.textContent =
      `$${totalValue.toFixed(2)}`;
  }

  if (portfolioPL && holdings.length > 0) {

    const pl = totalValue - totalCost;

    portfolioPL.textContent =
      `${pl >= 0 ? '+' : ''}$${pl.toFixed(2)}`;

    portfolioPL.style.color =
      pl >= 0 ? 'var(--accent)' : 'var(--danger)';
  }


  // -----------------------------
  // Diversification Score
  // -----------------------------

  if (holdings.length > 0 && totalValue > 0) {

    const weights = [];

    for (const h of holdings) {

      let price = Number(h.buyPrice) || 0;

      try {
        const res = await fetch(
          `${DASHBOARD_BACKEND_URL}/api/stocks/${h.ticker}`
        );

        const data = await res.json();

        if (data.price) {
          price = parseFloat(data.price);
        }

      } catch (err) {
        console.log(`Could not fetch ${h.ticker}`);
      }

      const holdingValue =
        price * Number(h.qty);

      weights.push(
        holdingValue / totalValue
      );
    }

    const hhi = weights.reduce(
      (sum, weight) => sum + weight * weight,
      0
    );

    const score =
      Math.round((1 - hhi) * 100);

    const diversification =
      document.getElementById('dashDiversification');

    if (diversification) {
      diversification.textContent =
        `${score}/100`;
    }
  }


  // -----------------------------
  // Financial Goals
  // -----------------------------

  const goals = JSON.parse(
    localStorage.getItem('financialGoals') || '[]'
  );

  const goalsCount =
    document.getElementById('dashGoalsCount');

  if (goalsCount) {
    goalsCount.textContent = goals.length;
  }
}


// Start Dashboard
loadDashboardSummary();
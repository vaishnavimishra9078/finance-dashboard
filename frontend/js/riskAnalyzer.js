const BACKEND_URL = "https://finance-dashboard-api-yoye.onrender.com";

// Your existing Portfolio Manager uses "portfolio"
const STORAGE_KEY = "portfolio";

// Get portfolio from localStorage
function getHoldings() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}


// ===============================
// ANALYZE RISK
// ===============================

async function analyzeRisk() {

  const holdings = getHoldings();

  const errorMsg = document.getElementById("errorMsg");
  const riskSummary = document.getElementById("riskSummary");
  const allocationList =
    document.getElementById("allocationList");


  // Clear previous error
  errorMsg.style.display = "none";


  // No holdings
  if (holdings.length === 0) {

    errorMsg.textContent =
      "No holdings found. Add some stocks in Portfolio Manager first.";

    errorMsg.style.display = "block";

    return;
  }


  // ===============================
  // GET CURRENT VALUES
  // ===============================

  const valuedHoldings = [];


  for (const stock of holdings) {

    let price = stock.currentPrice;


    try {

      const res = await fetch(
        `${BACKEND_URL}/api/stocks/${stock.symbol}`
      );

      if (res.ok) {

        const data = await res.json();

        if (data.price) {
          price = parseFloat(data.price);
        }

      }

    } catch (err) {

      // Use saved current price if API fails
      console.log(
        `Could not update ${stock.symbol}, using saved price.`
      );

    }


    const value =
      stock.quantity * price;


    valuedHoldings.push({
      symbol: stock.symbol,
      value: value
    });

  }


  // ===============================
  // TOTAL PORTFOLIO VALUE
  // ===============================

  const totalValue =
    valuedHoldings.reduce(
      (sum, stock) => sum + stock.value,
      0
    );


  if (totalValue <= 0) {

    errorMsg.textContent =
      "Portfolio value is not available.";

    errorMsg.style.display = "block";

    return;
  }


  // ===============================
  // HOLDING WEIGHTS
  // ===============================

  const weights =
    valuedHoldings.map(
      stock => stock.value / totalValue
    );


  const maxWeight =
    Math.max(...weights);


  // ===============================
  // DIVERSIFICATION LABEL
  // ===============================

  let diversificationLabel;
  let diversificationColor;


  if (maxWeight > 0.5) {

    diversificationLabel =
      "Poor — heavily concentrated";

    diversificationColor =
      "var(--danger)";

  } else if (maxWeight > 0.3) {

    diversificationLabel =
      "Moderate";

    diversificationColor =
      "#eab308";

  } else {

    diversificationLabel =
      "Good — well spread out";

    diversificationColor =
      "var(--accent)";

  }


  // ===============================
  // HHI SCORE
  // ===============================

  const hhi =
    weights.reduce(
      (sum, weight) => sum + weight * weight,
      0
    );


  const diversificationScore =
    Math.round((1 - hhi) * 100);


  // ===============================
  // SUMMARY CARDS
  // ===============================

  riskSummary.innerHTML = `

    <div class="card" style="min-width:200px;">

      <h4>Diversification Score</h4>

      <p
        style="
          font-size:24px;
          font-weight:bold;
          color:${diversificationColor};
        "
      >
        ${diversificationScore}/100
      </p>

      <p style="color:#888; font-size:13px;">
        ${diversificationLabel}
      </p>

    </div>


    <div class="card" style="min-width:200px;">

      <h4>Number of Holdings</h4>

      <p
        style="
          font-size:24px;
          font-weight:bold;
        "
      >
        ${holdings.length}
      </p>

      <p style="color:#888; font-size:13px;">
        ${
          holdings.length < 5
            ? "Consider adding more positions"
            : "Reasonable spread"
        }
      </p>

    </div>


    <div class="card" style="min-width:200px;">

      <h4>Largest Position</h4>

      <p
        style="
          font-size:24px;
          font-weight:bold;
        "
      >
        ${(maxWeight * 100).toFixed(1)}%
      </p>

      <p style="color:#888; font-size:13px;">
        of total portfolio
      </p>

    </div>

  `;


  // ===============================
  // ALLOCATION BREAKDOWN
  // ===============================

  allocationList.innerHTML = "";


  valuedHoldings
    .sort((a, b) => b.value - a.value)
    .forEach(stock => {

      const percentage =
        (stock.value / totalValue) * 100;


      const row =
        document.createElement("div");


      row.style.marginBottom = "10px";


      row.innerHTML = `

        <div
          style="
            display:flex;
            justify-content:space-between;
            font-size:14px;
          "
        >

          <span>
            ${stock.symbol}
          </span>

          <span>
            ${percentage.toFixed(1)}%
          </span>

        </div>


        <div
          style="
            background:#2a2e3f;
            border-radius:4px;
            height:8px;
            margin-top:4px;
          "
        >

          <div
            style="
              background:var(--accent);
              width:${percentage}%;
              height:100%;
              border-radius:4px;
            "
          ></div>

        </div>

      `;


      allocationList.appendChild(row);

    });

}


// ===============================
// START ANALYSIS
// ===============================

analyzeRisk();
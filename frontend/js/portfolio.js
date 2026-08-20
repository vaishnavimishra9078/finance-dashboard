const BACKEND_URL = "https://finance-dashboard-api-yoye.onrender.com";

// Load saved portfolio
let portfolio =
  JSON.parse(localStorage.getItem("portfolio")) || [];

// Get HTML elements
const addBtn = document.getElementById("addBtn");
const resultsDiv = document.getElementById("portfolioResults");
const errorMsg = document.getElementById("errorMsg");

const totalInvestmentEl =
  document.getElementById("totalInvestment");

const totalValueEl =
  document.getElementById("totalValue");

const profitLossEl =
  document.getElementById("profitLoss");

const totalProfitLossEl =
  document.getElementById("totalProfitLoss");

const allocationResults =
  document.getElementById("allocationResults");


// ===============================
// ADD STOCK
// ===============================

addBtn.addEventListener("click", async () => {

  const ticker = document
    .getElementById("ticker")
    .value
    .trim()
    .toUpperCase();

  const quantity = parseFloat(
    document.getElementById("quantity").value
  );

  const buyPrice = parseFloat(
    document.getElementById("buyPrice").value
  );

  errorMsg.style.display = "none";


  // Validate input
  if (!ticker || quantity <= 0 || buyPrice <= 0) {

    errorMsg.textContent =
      "Please enter a valid ticker, quantity and buy price.";

    errorMsg.style.display = "block";

    return;
  }


  try {

    // Get current stock price
    const res = await fetch(
      `${BACKEND_URL}/api/stocks/${ticker}`
    );


    if (!res.ok) {
      throw new Error("Stock not found");
    }


    const data = await res.json();

    const currentPrice = parseFloat(data.price);


    // Create stock
    const stock = {
      symbol: data.symbol,
      quantity: quantity,
      buyPrice: buyPrice,
      currentPrice: currentPrice
    };


    // Add stock
    portfolio.push(stock);


    // Save portfolio
    localStorage.setItem(
      "portfolio",
      JSON.stringify(portfolio)
    );


    // Update display
    displayPortfolio();


    // Clear inputs
    document.getElementById("ticker").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("buyPrice").value = "";


  } catch (err) {

    console.error("Portfolio error:", err);

    errorMsg.textContent =
      "Could not find that stock. Please try again.";

    errorMsg.style.display = "block";
  }

});


// ===============================
// DISPLAY PORTFOLIO
// ===============================

function displayPortfolio() {

  resultsDiv.innerHTML = "";

  let totalInvestment = 0;
  let totalValue = 0;


  portfolio.forEach((stock) => {

    const investment =
      stock.quantity * stock.buyPrice;

    const value =
      stock.quantity * stock.currentPrice;

    const profitLoss =
      value - investment;


    totalInvestment += investment;
    totalValue += value;


    const currency =
      getCurrencySymbol();


    const profitColor =
      profitLoss >= 0
        ? "var(--accent)"
        : "var(--danger)";


    const card =
      document.createElement("div");


    card.className = "card";

    card.style.marginBottom = "16px";


    card.innerHTML = `

      <h3>${stock.symbol}</h3>

      <p>
        Quantity: ${stock.quantity}
      </p>

      <p>
        Buy Price:
        ${currency}${stock.buyPrice.toFixed(2)}
      </p>

      <p>
        Current Price:
        ${currency}${stock.currentPrice.toFixed(2)}
      </p>

      <p>
        Total Investment:
        ${currency}${investment.toFixed(2)}
      </p>

      <p>
        Current Value:
        ${currency}${value.toFixed(2)}
      </p>

      <p style="color: ${profitColor};">
        Profit / Loss:
        ${currency}${profitLoss.toFixed(2)}
      </p>

      <button
        class="removeStockBtn"
        data-symbol="${stock.symbol}"
      >
        Remove Stock
      </button>

    `;


    resultsDiv.appendChild(card);

  });


  // Calculate total profit/loss
  const totalProfitLoss =
    totalValue - totalInvestment;


  const currency =
    getCurrencySymbol();


  // Update summary
  totalInvestmentEl.textContent =
    `${currency}${totalInvestment.toFixed(2)}`;

  totalValueEl.textContent =
    `${currency}${totalValue.toFixed(2)}`;

  profitLossEl.textContent =
    `${currency}${totalProfitLoss.toFixed(2)}`;


  // Summary color
  totalProfitLossEl.style.color =
    totalProfitLoss >= 0
      ? "var(--accent)"
      : "var(--danger)";


  // Update allocation
  displayAllocation(totalValue);

}


// ===============================
// PORTFOLIO ALLOCATION
// ===============================

function displayAllocation(totalValue) {

  if (portfolio.length === 0) {

    allocationResults.textContent =
      "No stocks added yet.";

    return;
  }


  if (totalValue === 0) {

    allocationResults.textContent =
      "No portfolio value available.";

    return;
  }


  allocationResults.innerHTML = "";


  portfolio.forEach((stock) => {

    const value =
      stock.quantity * stock.currentPrice;


    const percentage =
      (value / totalValue) * 100;


    const row =
      document.createElement("div");


    row.style.marginBottom = "12px";


    row.innerHTML = `

      <strong>${stock.symbol}</strong>

      <span style="float: right;">
        ${percentage.toFixed(2)}%
      </span>

      <div
        style="
          width: 100%;
          height: 10px;
          background: #ddd;
          border-radius: 5px;
          margin-top: 6px;
        "
      >

        <div
          style="
            width: ${percentage}%;
            height: 10px;
            background: var(--accent);
            border-radius: 5px;
          "
        ></div>

      </div>

    `;


    allocationResults.appendChild(row);

  });

}


// ===============================
// GET CURRENCY SYMBOL
// ===============================

function getCurrencySymbol() {

  const savedCurrency =
    localStorage.getItem("portfolioCurrency") || "USD";


  const currencySymbols = {

    USD: "$",

    INR: "₹",

    EUR: "€",

    GBP: "£"

  };


  return (
    currencySymbols[savedCurrency] || "$"
  );

}


// ===============================
// REMOVE STOCK
// ===============================

document.addEventListener("click", (event) => {

  if (
    !event.target.classList.contains("removeStockBtn")
  ) {
    return;
  }


  const symbol =
    event.target.dataset.symbol;


  portfolio = portfolio.filter(
    (stock) => stock.symbol !== symbol
  );


  localStorage.setItem(
    "portfolio",
    JSON.stringify(portfolio)
  );


  displayPortfolio();

});


// ===============================
// LOAD PORTFOLIO
// ===============================

displayPortfolio();
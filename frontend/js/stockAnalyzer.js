const BACKEND_URL = 'https://finance-dashboard-api-yoye.onrender.com';

document.getElementById('searchBtn').addEventListener('click', async () => {
  const ticker = document.getElementById('tickerInput').value.trim().toUpperCase();
  if (!ticker) return;

  const resultCard = document.getElementById('result');
  const errorMsg = document.getElementById('errorMsg');
  errorMsg.style.display = 'none';
  resultCard.style.display = 'none';

  try {
    const res = await fetch(`${BACKEND_URL}/api/stocks/${ticker}`);

console.log("Response status:", res.status);

if (!res.ok) {
    const errorText = await res.text();
    console.log("Backend response:", errorText);
    throw new Error("Backend error");
}

const data = await res.json();

console.log("Stock data:", data);

    document.getElementById('symbol').textContent = data.symbol;
    document.getElementById('price').textContent = data.price;

    const changeEl = document.getElementById('change');
    const isPositive = parseFloat(data.change) >= 0;
    changeEl.textContent = `${data.change} (${data.changePercent})`;
    changeEl.style.color = isPositive ? 'var(--accent)' : 'var(--danger)';

    resultCard.style.display = 'block';
  } catch (err) {
    errorMsg.textContent = 'Could not find that ticker. Try again.';
    errorMsg.style.display = 'block';
  }
});
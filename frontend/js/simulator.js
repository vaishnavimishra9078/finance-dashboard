const BACKEND_URL = "http://localhost:5000";

document.getElementById("simRunBtn").addEventListener("click", async () => {

    const ticker = document
        .getElementById("simTicker")
        .value
        .trim()
        .toUpperCase();

    const amount = parseFloat(
        document.getElementById("simAmount").value
    );

    const date =
        document.getElementById("simDate").value;

    const resultDiv =
        document.getElementById("simResult");

    const errorMsg =
        document.getElementById("errorMsg");

    resultDiv.style.display = "none";
    errorMsg.style.display = "none";

    if (!ticker || !amount || !date) {
        errorMsg.textContent =
            "Fill in ticker, amount, and date.";

        errorMsg.style.display = "block";
        return;
    }

    try {

        const res = await fetch(
            `${BACKEND_URL}/api/stocks/${ticker}/history/${date}`
        );

        if (!res.ok) {
            throw new Error("Simulation failed");
        }

        const data = await res.json();

        const sharesBought =
            amount / data.priceOnDate;

        const currentValue =
            sharesBought * data.latestPrice;

        const gain =
            currentValue - amount;

        const gainPercent =
            ((gain / amount) * 100).toFixed(2);

        const isPositive =
            gain >= 0;

        resultDiv.innerHTML = `
            <h3>${data.ticker}</h3>

            <p>
                Price on ${data.dateRequested}:
                $${data.priceOnDate.toFixed(2)}
            </p>

            <p>
                Shares bought:
                ${sharesBought.toFixed(4)}
            </p>

            <p>
                Current price (${data.latestDate}):
                $${data.latestPrice.toFixed(2)}
            </p>

            <hr>

            <p style="font-size:20px; font-weight:bold;">
                Current Value:
                $${currentValue.toFixed(2)}
            </p>

            <p style="color:${isPositive ? "var(--accent)" : "var(--danger)"};">
                ${isPositive ? "+" : ""}
                $${gain.toFixed(2)}
                (${gainPercent}%)
            </p>
        `;

        resultDiv.style.display = "block";

    } catch (err) {

        console.error("Simulator error:", err);

        errorMsg.textContent =
            "Could not simulate — check ticker and date, or try a different date.";

        errorMsg.style.display = "block";
    }
});
const BACKEND_URL = "http://localhost:5000";

// Market watchlist
const WATCHLIST = [
    "SPY",
    "DIA",
    "QQQ",
    "AAPL",
    "TSLA",
    "MSFT"
];


// ===============================
// LOAD MARKET DATA
// ===============================

async function loadMarketData() {

    const grid = document.getElementById("marketGrid");
    const errorMsg = document.getElementById("errorMsg");

    if (!grid) {
        console.error("marketGrid element not found.");
        return;
    }

    grid.innerHTML = "<p>Loading market data...</p>";

    try {

       const results = [];

for (const ticker of WATCHLIST) {

    try {

        const res = await fetch(
            `${BACKEND_URL}/api/stocks/${ticker}`
        );

        if (!res.ok) {
            console.warn(`Failed to load ${ticker}`);
            continue;
        }

        const data = await res.json();

        if (data.error) {
            console.warn(
                `${ticker}: ${data.error}`
            );
            continue;
        }

        results.push(data);

    } catch (error) {

        console.warn(
            `Could not load ${ticker}:`,
            error
        );
    }

    // Wait before requesting the next stock
    await new Promise((resolve) => {
        setTimeout(resolve, 1200);
    });
}

        grid.innerHTML = "";


        results.forEach((data) => {

            if (!data || !data.symbol) {
                return;
            }


            const change = parseFloat(data.change);

            const isPositive = change >= 0;


            const card = document.createElement("div");

            card.className = "card";


            card.style.minWidth = "180px";


            card.innerHTML = `
                <h3>${data.symbol}</h3>

                <p>
                    $${data.price}
                </p>

                <p
                    style="
                        color: ${
                            isPositive
                                ? "var(--accent)"
                                : "var(--danger)"
                        };
                    "
                >
                    ${data.change}
                    (${data.changePercent})
                </p>
            `;


            grid.appendChild(card);

        });


    } catch (err) {

        console.error(
            "Market Intelligence error:",
            err
        );


        if (errorMsg) {

            errorMsg.textContent =
                "Could not load market data right now.";

            errorMsg.style.display = "block";
        }

    }

}


// ===============================
// START MARKET INTELLIGENCE
// ===============================

loadMarketData();
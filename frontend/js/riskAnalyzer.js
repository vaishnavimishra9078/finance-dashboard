const BACKEND_URL = "https://finance-dashboard-api-yoye.onrender.com";

const STORAGE_KEY = "portfolio";

function getHoldings() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}


// =====================================================
// ANALYZE RISK
// =====================================================

async function analyzeRisk() {

    const amountInput =
        document.getElementById("riskAmount");

    const amount =
        parseFloat(amountInput?.value);

    const errorMsg =
        document.getElementById("errorMsg");

    const riskInputError =
        document.getElementById("riskInputError");

    const riskSummary =
        document.getElementById("riskSummary");

    const allocationList =
        document.getElementById("allocationList");


    // Clear errors

    errorMsg.style.display = "none";

    if (riskInputError) {
        riskInputError.style.display = "none";
    }


    // =====================================================
    // CHECK AMOUNT
    // =====================================================

    if (!amount || amount <= 0) {

        if (riskInputError) {

            riskInputError.textContent =
                "Please enter a valid investment amount.";

            riskInputError.style.display =
                "block";

        }

        return;
    }


    // =====================================================
    // GET PORTFOLIO
    // =====================================================

    const holdings = getHoldings();


    if (holdings.length === 0) {

        errorMsg.textContent =
            "No holdings found. Add stocks in Portfolio Manager first.";

        errorMsg.style.display =
            "block";

        return;
    }


    // =====================================================
    // GET CURRENT STOCK VALUES
    // =====================================================

    const valuedHoldings = [];


    for (const stock of holdings) {

        let price =
            parseFloat(stock.currentPrice) || 0;


        try {

            const res = await fetch(
                `${BACKEND_URL}/api/stocks/${stock.symbol}`
            );


            if (res.ok) {

                const data =
                    await res.json();


                if (data.price) {

                    price =
                        parseFloat(data.price);

                }

            }

        } catch (error) {

            console.log(
                `Using saved price for ${stock.symbol}`
            );

        }


        const value =
            Number(stock.quantity) * price;


        valuedHoldings.push({

            symbol: stock.symbol,

            value: value

        });

    }


    // =====================================================
    // TOTAL CURRENT PORTFOLIO
    // =====================================================

    const portfolioValue =
        valuedHoldings.reduce(
            (sum, stock) =>
                sum + stock.value,
            0
        );


    if (portfolioValue <= 0) {

        errorMsg.textContent =
            "Portfolio value is not available.";

        errorMsg.style.display =
            "block";

        return;
    }


    // =====================================================
    // ADD NEW INVESTMENT AMOUNT
    // =====================================================

    const projectedPortfolio =
        portfolioValue + amount;


    // =====================================================
    // HOLDING WEIGHTS
    // =====================================================

    const weights =
        valuedHoldings.map(
            stock =>
                stock.value /
                projectedPortfolio
        );


    // The new investment is treated as
    // additional portfolio capital.

    const investmentWeight =
        amount /
        projectedPortfolio;


    // =====================================================
    // LARGEST EXISTING POSITION
    // =====================================================

    const maxExistingWeight =
        Math.max(...weights);


    const largestWeight =
        Math.max(
            maxExistingWeight,
            investmentWeight
        );


    // =====================================================
    // DIVERSIFICATION SCORE
    // =====================================================

    const hhi =
        weights.reduce(
            (sum, weight) =>
                sum + weight * weight,
            0
        );


    const diversificationScore =
        Math.round(
            Math.max(
                0,
                Math.min(
                    100,
                    (1 - hhi) * 100
                )
            )
        );


    // =====================================================
    // RISK SCORE
    // =====================================================

    let riskScore =
        100 - diversificationScore;


    // Larger new investment = more concentration

    if (investmentWeight > 0.5) {

        riskScore += 20;

    } else if (investmentWeight > 0.3) {

        riskScore += 10;

    }


    riskScore =
        Math.round(
            Math.max(
                0,
                Math.min(100, riskScore)
            )
        );


    // =====================================================
    // RISK LABEL
    // =====================================================

    let riskLabel;
    let riskColor;


    if (riskScore < 35) {

        riskLabel =
            "Low Risk";

        riskColor =
            "#69e0a2";

    } else if (riskScore < 65) {

        riskLabel =
            "Moderate Risk";

        riskColor =
            "#eab308";

    } else {

        riskLabel =
            "Higher Risk";

        riskColor =
            "#ff7187";

    }


    // =====================================================
    // DIVERSIFICATION LABEL
    // =====================================================

    let diversificationLabel;


    if (diversificationScore >= 70) {

        diversificationLabel =
            "Good — well diversified";

    } else if (diversificationScore >= 40) {

        diversificationLabel =
            "Moderate diversification";

    } else {

        diversificationLabel =
            "Poor — highly concentrated";

    }


    // =====================================================
    // UPDATE SUMMARY
    // =====================================================

    riskSummary.innerHTML = `

        <div class="card">

            <h4>Portfolio Risk</h4>

            <p
                style="
                    font-size:28px;
                    font-weight:bold;
                    color:${riskColor};
                "
            >
                ${riskScore}/100
            </p>

            <p style="color:#888;font-size:13px;">
                ${riskLabel}
            </p>

        </div>


        <div class="card">

            <h4>Diversification</h4>

            <p
                style="
                    font-size:28px;
                    font-weight:bold;
                    color:${riskColor};
                "
            >
                ${diversificationScore}/100
            </p>

            <p style="color:#888;font-size:13px;">
                ${diversificationLabel}
            </p>

        </div>


        <div class="card">

            <h4>Investment Amount</h4>

            <p
                style="
                    font-size:28px;
                    font-weight:bold;
                "
            >
                ₹${amount.toLocaleString("en-IN")}
            </p>

            <p style="color:#888;font-size:13px;">
                New investment analyzed
            </p>

        </div>

    `;


    // =====================================================
    // ALLOCATION
    // =====================================================

    allocationList.innerHTML = "";


    valuedHoldings
        .sort(
            (a, b) =>
                b.value - a.value
        )
        .forEach(stock => {

            const percentage =
                (
                    stock.value /
                    projectedPortfolio
                ) * 100;


            const row =
                document.createElement("div");


            row.style.marginBottom =
                "14px";


            row.innerHTML = `

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        font-size:14px;
                        margin-bottom:5px;
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
                        background:#25283a;
                        border-radius:10px;
                        height:7px;
                        overflow:hidden;
                    "
                >

                    <div
                        style="
                            background:
                            linear-gradient(
                                90deg,
                                #7166ed,
                                #a779ff
                            );

                            width:${percentage}%;

                            height:100%;

                            border-radius:10px;

                            transition:width .8s ease;
                        "
                    ></div>

                </div>

            `;


            allocationList.appendChild(row);

        });


    // =====================================================
    // UPDATE 3D FLOATING VALUES
    // =====================================================

    const visualDiversification =
        document.getElementById(
            "visualDiversification"
        );


    const visualHoldings =
        document.getElementById(
            "visualHoldings"
        );


    const visualLargest =
        document.getElementById(
            "visualLargest"
        );


    if (visualDiversification) {

        visualDiversification.textContent =
            diversificationScore + "%";

    }


    if (visualHoldings) {

        visualHoldings.textContent =
            holdings.length;

    }


    if (visualLargest) {

        visualLargest.textContent =
            largestWeight.toFixed(1) + "%";

    }

}


// =====================================================
// BUTTON
// =====================================================

const riskButton =
    document.getElementById(
        "riskAnalyzeButton"
    );


if (riskButton) {

    riskButton.addEventListener(
        "click",
        analyzeRisk
    );

}


// =====================================================
// ENTER KEY
// =====================================================

const riskAmount =
    document.getElementById(
        "riskAmount"
    );


if (riskAmount) {

    riskAmount.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                analyzeRisk();

            }

        }
    );

}
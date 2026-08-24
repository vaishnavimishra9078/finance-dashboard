const BACKEND_URL = "https://finance-dashboard-api-yoye.onrender.com";

const simButton = document.getElementById("simRunBtn");

simButton.addEventListener("click", async () => {

    const ticker = document
        .getElementById("simTicker")
        .value
        .trim()
        .toUpperCase();

    const amount = parseFloat(
        document.getElementById("simAmount").value
    );

    const date = document
        .getElementById("simDate")
        .value;

    const resultDiv =
        document.getElementById("simResult");

    const errorMsg =
        document.getElementById("errorMsg");


    // Clear previous result
    resultDiv.style.display = "none";
    resultDiv.innerHTML = "";

    errorMsg.style.display = "none";
    errorMsg.textContent = "";


    // Validate inputs
    if (!ticker) {
        errorMsg.textContent = "Please enter a stock ticker.";
        errorMsg.style.display = "block";
        return;
    }

    if (!amount || amount <= 0) {
        errorMsg.textContent = "Please enter a valid investment amount.";
        errorMsg.style.display = "block";
        return;
    }

    if (!date) {
        errorMsg.textContent = "Please select an investment date.";
        errorMsg.style.display = "block";
        return;
    }


    // Button loading state
    simButton.disabled = true;
    simButton.textContent = "Calculating...";


    try {

        console.log("Simulator request:");
        console.log("Ticker:", ticker);
        console.log("Amount:", amount);
        console.log("Date:", date);


        const url =
            `${BACKEND_URL}/api/stocks/${ticker}/history/${date}`;

        console.log("Request URL:", url);


        const response = await fetch(url);


        if (!response.ok) {

            const errorText = await response.text();

            console.error(
                "Backend error:",
                response.status,
                errorText
            );

            throw new Error(
                `Backend returned ${response.status}`
            );
        }


        const data = await response.json();

        console.log("Simulator data:", data);


        if (
            !data.priceOnDate ||
            !data.latestPrice
        ) {
            throw new Error(
                "Invalid data returned by backend."
            );
        }


        // ===============================
        // CALCULATIONS
        // ===============================

        const priceOnDate =
            Number(data.priceOnDate);

        const latestPrice =
            Number(data.latestPrice);


        const sharesBought =
            amount / priceOnDate;


        const currentValue =
            sharesBought * latestPrice;


        const gain =
            currentValue - amount;


        const gainPercent =
            (gain / amount) * 100;


        const positive =
            gain >= 0;


        // ===============================
        // DISPLAY RESULT
        // ===============================

        resultDiv.innerHTML = `

            <div class="simulator-result-grid">

                <div class="simulator-result-card">

                    <small>
                        Investment
                    </small>

                    <strong>
                        $${amount.toFixed(2)}
                    </strong>

                </div>


                <div class="simulator-result-card">

                    <small>
                        Shares Bought
                    </small>

                    <strong>
                        ${sharesBought.toFixed(4)}
                    </strong>

                </div>


                <div class="simulator-result-card">

                    <small>
                        Price Then
                    </small>

                    <strong>
                        $${priceOnDate.toFixed(2)}
                    </strong>

                </div>


                <div class="simulator-result-card">

                    <small>
                        Current Value
                    </small>

                    <strong>
                        $${currentValue.toFixed(2)}
                    </strong>

                </div>


                <div class="simulator-result-card">

                    <small>
                        Return
                    </small>

                    <strong class="${
                        positive
                            ? "simulator-profit"
                            : "simulator-loss"
                    }">

                        ${positive ? "+" : "-"}$${Math.abs(gain).toFixed(2)}

                    </strong>

                </div>


                <div class="simulator-result-card">

                    <small>
                        Percentage Return
                    </small>

                    <strong class="${
                        positive
                            ? "simulator-profit"
                            : "simulator-loss"
                    }">

                        ${positive ? "+" : ""}
                        ${gainPercent.toFixed(2)}%

                    </strong>

                </div>

            </div>

            <div style="
                margin-top:18px;
                text-align:center;
                color:#777;
                font-size:13px;
            ">

                ${data.ticker} ·
                Investment date: ${data.dateRequested}

            </div>
        `;


        resultDiv.style.display = "block";


        // Scroll smoothly to result
        resultDiv.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });


    } catch (error) {

        console.error(
            "Investment Simulator Error:",
            error
        );


        errorMsg.textContent =
            "Could not simulate this investment. Check the ticker and date, then try again.";

        errorMsg.style.display = "block";


    } finally {

        simButton.disabled = false;
        simButton.textContent = "Run Simulation →";

    }

});
const currencySelect = document.getElementById("currency");
const saveButton = document.getElementById("saveSettings");
const message = document.getElementById("settingsMessage");


// Load saved currency
const savedCurrency =
    localStorage.getItem("portfolioCurrency");


// Show saved currency
if (savedCurrency) {
    currencySelect.value = savedCurrency;
}


// Save settings
saveButton.addEventListener("click", () => {

    const selectedCurrency =
        currencySelect.value;

    localStorage.setItem(
        "portfolioCurrency",
        selectedCurrency
    );

    message.textContent =
        "Currency settings saved successfully.";

    message.style.color = "var(--accent)";

});
// ===============================
// TAB SWITCHING
// ===============================

document.querySelectorAll(".calcTab").forEach((button) => {
  button.addEventListener("click", () => {

    document.querySelectorAll(".calcSection").forEach((section) => {
      section.style.display = "none";
    });

    document.getElementById(button.dataset.target).style.display = "block";
  });
});


// ===============================
// COMPOUND INTEREST
// ===============================

document.getElementById("ciCalcBtn").addEventListener("click", () => {

  const principal =
    parseFloat(document.getElementById("ciPrincipal").value) || 0;

  const rate =
    (parseFloat(document.getElementById("ciRate").value) || 0) / 100;

  const years =
    parseFloat(document.getElementById("ciYears").value) || 0;

  const monthlyContribution =
    parseFloat(document.getElementById("ciContribution").value) || 0;


  const monthlyRate = rate / 12;

  const months = years * 12;


  let futureValue =
    principal * Math.pow(1 + monthlyRate, months);


  if (monthlyRate > 0) {

    futureValue +=
      monthlyContribution *
      (
        (Math.pow(1 + monthlyRate, months) - 1)
        / monthlyRate
      );

  } else {

    futureValue +=
      monthlyContribution * months;

  }


  const totalContributed =
    principal + (monthlyContribution * months);

  const totalInterest =
    futureValue - totalContributed;


  document.getElementById("ciResult").innerHTML = `
    Future Value: $${futureValue.toFixed(2)}<br>
    Total Contributed: $${totalContributed.toFixed(2)}<br>
    Interest Earned: $${totalInterest.toFixed(2)}
  `;

});


// ===============================
// LOAN / MORTGAGE
// ===============================

document.getElementById("loanCalcBtn").addEventListener("click", () => {

  const principal =
    parseFloat(document.getElementById("loanAmount").value) || 0;

  const annualRate =
    (parseFloat(document.getElementById("loanRate").value) || 0) / 100;

  const years =
    parseFloat(document.getElementById("loanYears").value) || 0;


  const monthlyRate = annualRate / 12;

  const months = years * 12;


  let monthlyPayment;


  if (monthlyRate > 0) {

    monthlyPayment =
      principal *
      (
        monthlyRate *
        Math.pow(1 + monthlyRate, months)
      )
      /
      (
        Math.pow(1 + monthlyRate, months) - 1
      );

  } else {

    monthlyPayment =
      principal / months;

  }


  const totalPaid =
    monthlyPayment * months;

  const totalInterest =
    totalPaid - principal;


  document.getElementById("loanResult").innerHTML = `
    Monthly Payment: $${monthlyPayment.toFixed(2)}<br>
    Total Paid: $${totalPaid.toFixed(2)}<br>
    Total Interest: $${totalInterest.toFixed(2)}
  `;

});


// ===============================
// RETIREMENT SAVINGS
// ===============================

document.getElementById("retCalcBtn").addEventListener("click", () => {

  const currentAge =
    parseFloat(document.getElementById("retCurrentAge").value) || 0;

  const targetAge =
    parseFloat(document.getElementById("retTargetAge").value) || 0;

  const currentSavings =
    parseFloat(
      document.getElementById("retCurrentSavings").value
    ) || 0;

  const monthlyContribution =
    parseFloat(
      document.getElementById("retMonthly").value
    ) || 0;

  const annualRate =
    (parseFloat(document.getElementById("retRate").value) || 0) / 100;


  const years =
    targetAge - currentAge;


  if (years <= 0) {

    document.getElementById("retResult").textContent =
      "Retirement age must be greater than current age.";

    return;

  }


  const monthlyRate =
    annualRate / 12;

  const months =
    years * 12;


  let futureValue =
    currentSavings *
    Math.pow(1 + monthlyRate, months);


  if (monthlyRate > 0) {

    futureValue +=
      monthlyContribution *
      (
        (Math.pow(1 + monthlyRate, months) - 1)
        / monthlyRate
      );

  } else {

    futureValue +=
      monthlyContribution * months;

  }


  document.getElementById("retResult").innerHTML = `
    Projected savings at age ${targetAge}:
    $${futureValue.toFixed(2)}
  `;

});
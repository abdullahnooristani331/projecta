const API_URL = "https://api.frankfurter.app";

const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const form = document.getElementById("converter-form");
const resultDisplay = document.getElementById("result");
const swapBtn = document.getElementById("swap-btn");
const ctx = document.getElementById("rateChart").getContext("2d");

let chart;

// --------- Load Currencies ---------
async function loadCurrencies() {
  try {
    const res = await fetch(`${API_URL}/currencies`);
    const data = await res.json();
    for (let code in data) {
      const option1 = new Option(`${code} - ${data[code]}`, code);
      const option2 = option1.cloneNode(true);
      fromCurrency.appendChild(option1);
      toCurrency.appendChild(option2);
    }
    fromCurrency.value = "USD";
    toCurrency.value = "EUR";
  } catch (error) {
    alert("Error loading currencies.");
  }
}

// --------- Convert Currency ---------
async function convertCurrency(e) {
  e.preventDefault();

  const amount = parseFloat(amountInput.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (from === to || isNaN(amount) || amount <= 0) {
    resultDisplay.textContent = "Please enter a valid conversion.";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/latest?amount=${amount}&from=${from}&to=${to}`);
    const data = await res.json();
    const converted = data.rates[to].toFixed(2);
    resultDisplay.textContent = `${amount} ${from} = ${converted} ${to}`;
    saveToHistory(`${amount} ${from} → ${converted} ${to}`);
    renderChart(from, to);
  } catch (error) {
    resultDisplay.textContent = "Conversion failed.";
    console.error("Conversion error:", error);
  }
}

// --------- Save History to LocalStorage ---------
function saveToHistory(entry) {
  let history = JSON.parse(localStorage.getItem("conversionHistory")) || [];
  history.unshift(entry);
  if (history.length > 10) history.pop();
  localStorage.setItem("conversionHistory", JSON.stringify(history));
}

// --------- Swap Currencies ---------
swapBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
});

// --------- Render Chart ---------
async function renderChart(base, target) {
  try {
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const formattedStart = startDate.toISOString().split("T")[0];

    const res = await fetch(`${API_URL}/${formattedStart}..${endDate}?from=${base}&to=${target}`);
    const data = await res.json();
    const labels = Object.keys(data.rates);
    const rates = labels.map(date => data.rates[date][target]);

    if (chart) chart.destroy();

    const textColor = getComputedStyle(document.body).getPropertyValue('--text-color').trim() || "#000";

    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: `Exchange Rate (${base} → ${target})`,
          data: rates,
          borderColor: "#007bff",
          fill: false
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColor
            }
          },
          y: {
            ticks: {
              color: textColor
            }
          }
        }
      }
    });
  } catch (err) {
    console.error("Error loading chart data:", err);
  }
}

// --------- Init ---------
window.addEventListener("DOMContentLoaded", () => {
  loadCurrencies();
});

form.addEventListener("submit", convertCurrency);

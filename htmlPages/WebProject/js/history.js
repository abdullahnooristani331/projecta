const historyList = document.getElementById("history-list");
const clearBtn = document.getElementById("clear-history");

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("conversionHistory")) || [];
  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = "<li>No history found.</li>";
    return;
  }

  history.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${item}`;
    historyList.appendChild(li);
  });
}

clearBtn.addEventListener("click", () => {
  localStorage.removeItem("conversionHistory");
  loadHistory();
});

window.addEventListener("DOMContentLoaded", loadHistory);

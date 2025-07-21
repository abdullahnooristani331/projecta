let queue = [];
let queueSize = 0;
let queueType = "number";

function initializeQueue() {
  queueSize = parseInt(document.getElementById("queue-size").value);
  queueType = document.getElementById("queue-type").value;

  if (!queueSize || queueSize <= 0) return showStatus("Please enter a valid queue size.", true);

  queue = [];
  toggleQueueControls(true);
  renderQueue();
  showStatus("Queue initialized with size " + queueSize + " and type " + queueType + ".");
}

function toggleQueueControls(enable) {
  const ids = [
    "enqueue-value", "enqueue-btn",
    "dequeue-btn", "peek-btn",
    "traverse-btn", "clear-btn"
  ];
  ids.forEach(id => document.getElementById(id).disabled = !enable);
}

function enqueue() {
  const val = document.getElementById("enqueue-value").value;
  if (queue.length >= queueSize) return showStatus("❌ Queue Overflow! Queue is full.", true);

  const castedVal = castQueueValue(val);
  if (castedVal === null) return showStatus("❌ Value type does not match the selected data type.", true);

  queue.push(castedVal);
  renderQueue(queue.length - 1, "highlight");
  showStatus(`✅ Enqueued <b>${val}</b> to queue.`);
}

function dequeue() {
  if (queue.length === 0) return showStatus("❌ Queue Underflow! Queue is empty.", true);
  const removed = queue.shift();
  renderQueue(0, "highlight");
  showStatus(`🗑️ Dequeued <b>${removed}</b> from queue.`);
}

function peek() {
  if (queue.length === 0) return showStatus("❌ Queue is empty.", true);
  renderQueue(0, "highlight");
  showStatus(`👁️ Front of queue: <b>${queue[0]}</b>`);
}

function traverse() {
  renderQueue();
  showStatus("🔎 Traverse: " + queue.map((v, i) => `[${i}: ${v}]`).join(" "));
}

function clearQueue() {
  queue = [];
  renderQueue();
  showStatus("🧹 Queue cleared.");
}

function renderQueue(highlightIndex = -1, highlightClass = "highlight") {
  const container = document.getElementById("queue-container");
  container.innerHTML = "";
  for (let i = 0; i < queueSize; i++) {
    const cell = document.createElement("div");
    cell.className = "queue-cell";
    if (i === highlightIndex) cell.classList.add(highlightClass);
    if (i === 0 && queue.length > 0) cell.classList.add("front");
    if (i === queue.length - 1 && queue.length > 0) cell.classList.add("rear");
    if (i >= queue.length) cell.classList.add("empty");
    cell.innerHTML = `${i < queue.length ? queue[i] : ""}<div class="index">${i}</div>`;
    container.appendChild(cell);
  }
}

function showStatus(msg, isError = false) {
  const status = document.getElementById("status");
  status.innerHTML = msg;
  status.style.color = isError ? "#c00" : "#1d3557";
}

function castQueueValue(val) {
  if (queueType === "number") {
    return /^-?\d+(\.\d+)?$/.test(val) ? Number(val) : null;
  }
  if (queueType === "string") {
    return /^-?\d+(\.\d+)?$/.test(val) ? null : val.trim();
  }
  return null;
}
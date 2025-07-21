let array = [];
let size = 0;
let dataType = "number";

function initializeArray() {
  size = parseInt(document.getElementById("array-size").value);
  dataType = document.getElementById("data-type").value;

  if (!size || size <= 0) return showStatus("Please enter a valid array size.", true);

  array = new Array(size).fill(null);
  toggleControls(true);
  renderArray();
  showStatus("Array initialized with size " + size + " and type " + dataType + ".");
}

function toggleControls(enable) {
  const ids = [
    "insert-value", "insert-index", "insert-btn",
    "delete-index", "delete-btn",
    "access-index", "access-btn",
    "update-index", "update-value", "update-btn",
    "traverse-btn", "search-value", "search-btn",
    "sort-btn", "reverse-btn", "merge-array", "merge-btn",
    "clear-btn"
  ];
  ids.forEach(id => document.getElementById(id).disabled = !enable);
}

function validateIndex(idx) {
  if (idx < 0) idx = size + idx;
  return idx >= 0 && idx < size ? idx : -1;
}

function insert() {
  const val = document.getElementById("insert-value").value;
  let idx = parseInt(document.getElementById("insert-index").value);
  idx = validateIndex(idx);

  const castedVal = castValue(val);

  if (idx === -1) return showStatus("❌ Invalid index.", true);
  if (castedVal === null) return showStatus("❌ Value type does not match the selected data type.", true);
  if (array[idx] !== null) return showStatus(`❌ Index ${idx} already has a value. Use Update.`, true);

  array[idx] = castedVal;
  renderArray(idx, "highlight");
  showStatus(`✅ Inserted <b>${val}</b> at index <b>${idx}</b>.`);
}

function deleteAt() {
  let idx = parseInt(document.getElementById("delete-index").value);
  idx = validateIndex(idx);
  if (idx === -1) return showStatus("❌ Invalid index.", true);

  if (array[idx] === null) return showStatus(`❌ Index ${idx} is already empty.`, true);

  array[idx] = null;
  renderArray(idx, "highlight");
  showStatus(`🗑️ Deleted value at index <b>${idx}</b>.`);
}

function access() {
  let idx = parseInt(document.getElementById("access-index").value);
  idx = validateIndex(idx);
  if (idx === -1) return showStatus("❌ Invalid index.", true);

  renderArray(idx, "highlight");
  showStatus(`👁️ Accessed index <b>${idx}</b>: <b>${array[idx]}</b>`);
}

function update() {
  let idx = parseInt(document.getElementById("update-index").value);
  let val = document.getElementById("update-value").value;
  idx = validateIndex(idx);
  const castedVal = castValue(val);

  if (idx === -1) return showStatus("❌ Invalid index.", true);
  if (castedVal === null) return showStatus("❌ Value type does not match the selected data type.", true);

  array[idx] = castedVal;
  renderArray(idx, "highlight");
  showStatus(`🔄 Updated index <b>${idx}</b> with value <b>${val}</b>.`);
}

function traverse() {
  renderArray();
  showStatus("🔎 Traverse: " + array.map((v, i) => `[${i}: ${v === null ? " " : v}]`).join(" "));
}

function search() {
  const val = castValue(document.getElementById("search-value").value);
  const idx = array.indexOf(val);
  if (idx === -1) {
    renderArray();
    return showStatus("❌ Value not found.", true);
  }
  renderArray(idx, "search-found");
  showStatus(`🔍 Value <b>${val}</b> found at index <b>${idx}</b>.`);
}

function sortArray() {
  const filtered = array.filter(v => v !== null);
  if (filtered.length === 0) return showStatus("❌ No elements to sort.", true);

  filtered.sort((a, b) => dataType === 'number' ? a - b : ("" + a).localeCompare(b));

  let j = 0;
  for (let i = 0; i < size; i++) {
    if (array[i] !== null) array[i] = filtered[j++];
  }

  renderArray();
  showStatus("↕️ Array sorted.");
}

function reverseArray() {
  const filtered = array.filter(v => v !== null).reverse();
  let j = 0;
  for (let i = 0; i < size; i++) {
    if (array[i] !== null) array[i] = filtered[j++];
  }
  renderArray();
  showStatus("🔄 Array reversed.");
}

function mergeArray() {
  const input = document.getElementById("merge-array").value;
  const values = input.split(",").map(v => v.trim()).filter(v => v !== "");
  const casted = values.map(v => castValue(v)).filter(v => v !== null);
  let j = 0;
  for (let i = 0; i < size && j < casted.length; i++) {
    if (array[i] === null) array[i] = casted[j++];
  }
  renderArray();
  showStatus("🔗 Arrays merged.");
}

function clearArray() {
  array = new Array(size).fill(null);
  renderArray();
  showStatus("🧹 Array cleared.");
}

function renderArray(highlightIndex = -1, highlightClass = "highlight") {
  const container = document.getElementById("array-container");
  container.innerHTML = "";
  array.forEach((val, idx) => {
    const cell = document.createElement("div");
    cell.className = "array-cell";
    if (idx === highlightIndex) cell.classList.add(highlightClass);
    cell.innerHTML = `${val !== null ? val : ""}<div class="index">${idx}</div>`;
    container.appendChild(cell);
  });
}

function showStatus(msg, isError = false) {
  const status = document.getElementById("status");
  status.innerHTML = msg;
  status.style.color = isError ? "#c00" : "#1d3557";
}

function castValue(val) {
  if (dataType === "number") {
    return /^-?\d+(\.\d+)?$/.test(val) ? Number(val) : null;
  }
  if (dataType === "string") {
    return /^-?\d+(\.\d+)?$/.test(val) ? null : val.trim();
  }
  return null;
}
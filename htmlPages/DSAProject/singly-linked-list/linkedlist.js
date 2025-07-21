let head = null;
let llType = "number";

class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

function castLLValue(val) {
  if (llType === "number") {
    return /^-?\d+(\.\d+)?$/.test(val) ? Number(val) : null;
  }
  if (llType === "string") {
    return /^-?\d+(\.\d+)?$/.test(val) ? null : val.trim();
  }
  return null;
}

function getLength() {
  let len = 0, curr = head;
  while (curr) { len++; curr = curr.next; }
  return len;
}

function insertHead() {
  llType = document.getElementById("ll-type").value;
  const val = document.getElementById("insert-head-value").value;
  const castedVal = castLLValue(val);
  if (castedVal === null) return showStatus("❌ Value type does not match the selected data type.", true);

  const node = new Node(castedVal);
  node.next = head;
  head = node;
  renderLL(0, "highlight");
  showStatus(`✅ Inserted <b>${val}</b> at head.`);
}

function insertTail() {
  llType = document.getElementById("ll-type").value;
  const val = document.getElementById("insert-tail-value").value;
  const castedVal = castLLValue(val);
  if (castedVal === null) return showStatus("❌ Value type does not match the selected data type.", true);

  const node = new Node(castedVal);
  if (!head) {
    head = node;
    renderLL(0, "highlight");
    return showStatus(`✅ Inserted <b>${val}</b> at tail.`);
  }
  let curr = head, idx = 0;
  while (curr.next) { curr = curr.next; idx++; }
  curr.next = node;
  renderLL(idx + 1, "highlight");
  showStatus(`✅ Inserted <b>${val}</b> at tail.`);
}

function insertAtIndex() {
  llType = document.getElementById("ll-type").value;
  const idx = parseInt(document.getElementById("insert-index").value);
  const val = document.getElementById("insert-index-value").value;
  const castedVal = castLLValue(val);
  if (isNaN(idx) || idx < 0) return showStatus("❌ Invalid index.", true);
  if (castedVal === null) return showStatus("❌ Value type does not match the selected data type.", true);

  if (idx === 0) return insertHead();
  let curr = head, prev = null, i = 0;
  while (curr && i < idx) { prev = curr; curr = curr.next; i++; }
  if (i !== idx) return showStatus("❌ Index out of bounds.", true);

  const node = new Node(castedVal);
  prev.next = node;
  node.next = curr;
  renderLL(idx, "highlight");
  showStatus(`✅ Inserted <b>${val}</b> at index <b>${idx}</b>.`);
}

function deleteHead() {
  if (!head) return showStatus("❌ List is empty.", true);
  head = head.next;
  renderLL(0, "highlight");
  showStatus("🗑️ Deleted head node.");
}

function deleteTail() {
  if (!head) return showStatus("❌ List is empty.", true);
  if (!head.next) {
    head = null;
    renderLL();
    return showStatus("🗑️ Deleted tail node.");
  }
  let curr = head, prev = null, idx = 0;
  while (curr.next) { prev = curr; curr = curr.next; idx++; }
  prev.next = null;
  renderLL(idx, "highlight");
  showStatus("🗑️ Deleted tail node.");
}

function deleteAtIndex() {
  const idx = parseInt(document.getElementById("delete-index").value);
  if (isNaN(idx) || idx < 0) return showStatus("❌ Invalid index.", true);
  if (!head) return showStatus("❌ List is empty.", true);
  if (idx === 0) return deleteHead();

  let curr = head, prev = null, i = 0;
  while (curr && i < idx) { prev = curr; curr = curr.next; i++; }
  if (!curr) return showStatus("❌ Index out of bounds.", true);

  prev.next = curr.next;
  renderLL(idx, "highlight");
  showStatus(`🗑️ Deleted node at index <b>${idx}</b>.`);
}

function search() {
  const val = document.getElementById("search-value").value;
  let curr = head, idx = 0;
  while (curr) {
    if (curr.value == val) {
      renderLL(idx, "found");
      return showStatus(`🔍 Found value <b>${val}</b> at index <b>${idx}</b>.`);
    }
    curr = curr.next; idx++;
  }
  renderLL();
  showStatus("❌ Value not found.", true);
}

function update() {
  const idx = parseInt(document.getElementById("update-index").value);
  const val = document.getElementById("update-value").value;
  const castedVal = castLLValue(val);
  if (isNaN(idx) || idx < 0) return showStatus("❌ Invalid index.", true);
  if (castedVal === null) return showStatus("❌ Value type does not match the selected data type.", true);

  let curr = head, i = 0;
  while (curr && i < idx) { curr = curr.next; i++; }
  if (!curr) return showStatus("❌ Index out of bounds.", true);

  curr.value = castedVal;
  renderLL(idx, "highlight");
  showStatus(`🔄 Updated index <b>${idx}</b> with value <b>${val}</b>.`);
}

function traverse() {
  let curr = head, arr = [], idx = 0;
  while (curr) { arr.push(`[${idx}: ${curr.value}]`); curr = curr.next; idx++; }
  renderLL();
  showStatus("🔎 Traverse: " + arr.join(" → "));
}

function clearList() {
  head = null;
  renderLL();
  showStatus("🧹 List cleared.");
}

function renderLL(highlightIndex = -1, highlightClass = "highlight") {
  const container = document.getElementById("ll-container");
  container.innerHTML = "";
  let curr = head, idx = 0;
  while (curr) {
    const nodeDiv = document.createElement("div");
    nodeDiv.className = "ll-node";
    if (idx === highlightIndex) nodeDiv.classList.add(highlightClass);
    nodeDiv.innerHTML = curr.value;
    container.appendChild(nodeDiv);

    if (curr.next) {
      const arrow = document.createElement("div");
      arrow.className = "ll-arrow";
      container.appendChild(arrow);
    }
    curr = curr.next; idx++;
  }
}

function showStatus(msg, isError = false) {
  const status = document.getElementById("status");
  status.innerHTML = msg;
  status.style.color = isError ? "#c00" : "#1d3557";
}
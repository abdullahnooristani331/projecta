let dllHead = null;
let dllTail = null;
let dllType = "number";

class DLLNode {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

function castDLLValue(val) {
    if (dllType === "number") {
        return /^-?\d+(\.\d+)?$/.test(val) ? Number(val) : null;
    }
    if (dllType === "string") {
        return /^-?\d+(\.\d+)?$/.test(val) ? null : val.trim();
    }
    return null;
}

function getDLLLength() {
    let len = 0, curr = dllHead;
    while (curr) { len++; curr = curr.next; }
    return len;
}

function insertHead() {
    dllType = document.getElementById("dll-type").value;
    const val = document.getElementById("insert-head-value").value;
    const castedVal = castDLLValue(val);
    if (castedVal === null) return showStatus("❌ Value type does not match the selected data type.", true);

    const node = new DLLNode(castedVal);
    node.next = dllHead;
    if (dllHead) dllHead.prev = node;
    dllHead = node;
    if (!dllTail) dllTail = node;
    renderDLL(0, "highlight");
    showStatus(`✅ Inserted <b>${val}</b> at head.`);
}

function insertTail() {
    dllType = document.getElementById("dll-type").value;
    const val = document.getElementById("insert-tail-value").value;
    const castedVal = castDLLValue(val);
    if (castedVal === null) return showStatus("❌ Value type does not match the selected data type.", true);

    const node = new DLLNode(castedVal);
    if (!dllTail) {
        dllHead = dllTail = node;
        renderDLL(0, "highlight");
        return showStatus(`✅ Inserted <b>${val}</b> at tail.`);
    }
    dllTail.next = node;
    node.prev = dllTail;
    dllTail = node;
    renderDLL(getDLLLength() - 1, "highlight");
    showStatus(`✅ Inserted <b>${val}</b> at tail.`);
}

function insertAtIndex() {
    dllType = document.getElementById("dll-type").value;
    const idx = parseInt(document.getElementById("insert-index").value);
    const val = document.getElementById("insert-index-value").value;
    const castedVal = castDLLValue(val);
    if (isNaN(idx) || idx < 0) return showStatus("❌ Invalid index.", true);
    if (castedVal === null) return showStatus("❌ Value type does not match the selected data type.", true);

    if (idx === 0) return insertHead();
    let curr = dllHead, i = 0;
    while (curr && i < idx) { curr = curr.next; i++; }
    if (i !== idx) return showStatus("❌ Index out of bounds.", true);

    const node = new DLLNode(castedVal);
    if (!curr) { // Insert at tail
        insertTail();
        return;
    }
    node.prev = curr.prev;
    node.next = curr;
    if (curr.prev) curr.prev.next = node;
    curr.prev = node;
    if (idx === 0) dllHead = node;
    renderDLL(idx, "highlight");
    showStatus(`✅ Inserted <b>${val}</b> at index <b>${idx}</b>.`);
}

function deleteHead() {
    if (!dllHead) return showStatus("❌ List is empty.", true);
    if (dllHead === dllTail) {
        dllHead = dllTail = null;
        renderDLL();
        return showStatus("🗑️ Deleted head node.");
    }
    dllHead = dllHead.next;
    dllHead.prev = null;
    renderDLL(0, "highlight");
    showStatus("🗑️ Deleted head node.");
}

function deleteTail() {
    if (!dllTail) return showStatus("❌ List is empty.", true);
    if (dllHead === dllTail) {
        dllHead = dllTail = null;
        renderDLL();
        return showStatus("🗑️ Deleted tail node.");
    }
    dllTail = dllTail.prev;
    dllTail.next = null;
    renderDLL(getDLLLength(), "highlight");
    showStatus("🗑️ Deleted tail node.");
}

function deleteAtIndex() {
    const idx = parseInt(document.getElementById("delete-index").value);
    if (isNaN(idx) || idx < 0) return showStatus("❌ Invalid index.", true);
    if (!dllHead) return showStatus("❌ List is empty.", true);
    if (idx === 0) return deleteHead();

    let curr = dllHead, i = 0;
    while (curr && i < idx) { curr = curr.next; i++; }
    if (!curr) return showStatus("❌ Index out of bounds.", true);

    if (curr === dllTail) return deleteTail();

    curr.prev.next = curr.next;
    if (curr.next) curr.next.prev = curr.prev;
    renderDLL(idx, "highlight");
    showStatus(`🗑️ Deleted node at index <b>${idx}</b>.`);
}

function search() {
    const val = document.getElementById("search-value").value;
    let curr = dllHead, idx = 0;
    while (curr) {
        if (curr.value == val) {
            renderDLL(idx, "found");
            return showStatus(`🔍 Found value <b>${val}</b> at index <b>${idx}</b>.`);
        }
        curr = curr.next; idx++;
    }
    renderDLL();
    showStatus("❌ Value not found.", true);
}

function update() {
    const idx = parseInt(document.getElementById("update-index").value);
    const val = document.getElementById("update-value").value;
    const castedVal = castDLLValue(val);
    if (isNaN(idx) || idx < 0) return showStatus("❌ Invalid index.", true);
    if (castedVal === null) return showStatus("❌ Value type does not match the selected data type.", true);

    let curr = dllHead, i = 0;
    while (curr && i < idx) { curr = curr.next; i++; }
    if (!curr) return showStatus("❌ Index out of bounds.", true);

    curr.value = castedVal;
    renderDLL(idx, "highlight");
    showStatus(`🔄 Updated index <b>${idx}</b> with value <b>${val}</b>.`);
}

function traverseForward() {
    let curr = dllHead, arr = [], idx = 0;
    while (curr) { arr.push(`[${idx}: ${curr.value}]`); curr = curr.next; idx++; }
    renderDLL();
    showStatus("🔎 Traverse (forward): " + arr.join(" ⇄ "));
}

function traverseBackward() {
    let arr = [], idx = getDLLLength() - 1, curr = dllTail;
    while (curr) { arr.push(`[${idx}: ${curr.value}]`); curr = curr.prev; idx--; }
    renderDLL();
    showStatus("🔎 Traverse (backward): " + arr.join(" ⇄ "));
}

function clearList() {
    dllHead = dllTail = null;
    renderDLL();
    showStatus("🧹 List cleared.");
}

function renderDLL(highlightIndex = -1, highlightClass = "highlight") {
    const container = document.getElementById("dll-container");
    container.innerHTML = "";
    let curr = dllHead, idx = 0;
    while (curr) {
        const nodeDiv = document.createElement("div");
        nodeDiv.className = "dll-node";
        if (idx === highlightIndex) nodeDiv.classList.add(highlightClass);
        nodeDiv.innerHTML = curr.value;
        container.appendChild(nodeDiv);

        if (curr.next) {
            const arrow = document.createElement("div");
            arrow.className = "dll-arrow";
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
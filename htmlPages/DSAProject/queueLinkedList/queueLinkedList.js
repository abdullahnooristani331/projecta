let queueHead = null;
let queueTail = null;
let queueType = "number";

class QueueNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
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

function enqueue() {
    queueType = document.getElementById("queue-type").value;
    const val = document.getElementById("enqueue-value").value;
    const castedVal = castQueueValue(val);
    if (castedVal === null) return showStatus("❌ Value type does not match the selected data type.", true);

    const node = new QueueNode(castedVal);
    if (!queueHead) {
        queueHead = queueTail = node;
        renderQueue(0, "highlight");
        return showStatus(`✅ Enqueued <b>${val}</b> to queue.`);
    }
    queueTail.next = node;
    queueTail = node;
    renderQueue(getQueueLength() - 1, "highlight");
    showStatus(`✅ Enqueued <b>${val}</b> to queue.`);
}

function dequeue() {
    if (!queueHead) return showStatus("❌ Queue Underflow! Queue is empty.", true);
    const removed = queueHead.value;
    queueHead = queueHead.next;
    if (!queueHead) queueTail = null;
    renderQueue(0, "highlight");
    showStatus(`🗑️ Dequeued <b>${removed}</b> from queue.`);
}

function peek() {
    if (!queueHead) return showStatus("❌ Queue is empty.", true);
    renderQueue(0, "highlight");
    showStatus(`👁️ Front of queue: <b>${queueHead.value}</b>`);
}

function traverse() {
    let curr = queueHead, arr = [], idx = 0;
    while (curr) { arr.push(`[${idx}: ${curr.value}]`); curr = curr.next; idx++; }
    renderQueue();
    showStatus("🔎 Traverse: " + arr.join(" → "));
}

function clearQueue() {
    queueHead = queueTail = null;
    renderQueue();
    showStatus("🧹 Queue cleared.");
}

function getQueueLength() {
    let len = 0, curr = queueHead;
    while (curr) { len++; curr = curr.next; }
    return len;
}

function renderQueue(highlightIndex = -1, highlightClass = "highlight") {
    const container = document.getElementById("queue-container");
    container.innerHTML = "";
    let curr = queueHead, idx = 0, nodes = [];
    while (curr) {
        nodes.push(curr);
        curr = curr.next;
    }
    nodes.forEach((node, i) => {
        const nodeDiv = document.createElement("div");
        nodeDiv.className = "queuell-node";
        if (i === highlightIndex) nodeDiv.classList.add(highlightClass);
        if (i === 0 && nodes.length > 0) nodeDiv.classList.add("front");
        if (i === nodes.length - 1 && nodes.length > 0) nodeDiv.classList.add("rear");
        nodeDiv.innerHTML = node.value;
        container.appendChild(nodeDiv);
        if (i < nodes.length - 1) {
            const arrow = document.createElement("div");
            arrow.className = "queuell-arrow";
            container.appendChild(arrow);
        }
    });
}

function showStatus(msg, isError = false) {
    const status = document.getElementById("status");
    status.innerHTML = msg;
    status.style.color = isError ? "#c00" : "#1d3557";
}
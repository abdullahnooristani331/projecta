let stackHead = null;
let stackType = "number";

class StackNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

function castStackValue(val) {
    if (stackType === "number") {
        return /^-?\d+(\.\d+)?$/.test(val) ? Number(val) : null;
    }
    if (stackType === "string") {
        return /^-?\d+(\.\d+)?$/.test(val) ? null : val.trim();
    }
    return null;
}

function push() {
    stackType = document.getElementById("stack-type").value;
    const val = document.getElementById("push-value").value;
    const castedVal = castStackValue(val);
    if (castedVal === null) return showStatus("❌ Value type does not match the selected data type.", true);

    const node = new StackNode(castedVal);
    node.next = stackHead;
    stackHead = node;
    renderStack(0, "highlight");
    showStatus(`✅ Pushed <b>${val}</b> to stack.`);
}

function pop() {
    if (!stackHead) return showStatus("❌ Stack Underflow! Stack is empty.", true);
    const popped = stackHead.value;
    stackHead = stackHead.next;
    renderStack(0, "highlight");
    showStatus(`🗑️ Popped <b>${popped}</b> from stack.`);
}

function peek() {
    if (!stackHead) return showStatus("❌ Stack is empty.", true);
    renderStack(0, "highlight");
    showStatus(`👁️ Top of stack: <b>${stackHead.value}</b>`);
}

function traverse() {
    let curr = stackHead, arr = [], idx = 0;
    while (curr) { arr.push(`[${idx}: ${curr.value}]`); curr = curr.next; idx++; }
    renderStack();
    showStatus("🔎 Traverse: " + arr.join(" → "));
}

function clearStack() {
    stackHead = null;
    renderStack();
    showStatus("🧹 Stack cleared.");
}

function renderStack(highlightIndex = -1, highlightClass = "highlight") {
    const container = document.getElementById("stack-container");
    container.innerHTML = "";
    let curr = stackHead, idx = 0, nodes = [];
    while (curr) {
        nodes.push(curr);
        curr = curr.next;
    }
    nodes.forEach((node, i) => {
        const nodeDiv = document.createElement("div");
        nodeDiv.className = "stackll-node";
        if (i === highlightIndex) nodeDiv.classList.add(highlightClass);
        if (i === 0 && nodes.length > 0) nodeDiv.classList.add("top");
        nodeDiv.innerHTML = node.value;
        container.appendChild(nodeDiv);
        if (i < nodes.length - 1) {
            const arrow = document.createElement("div");
            arrow.className = "stackll-arrow";
            container.appendChild(arrow);
        }
    });
}

function showStatus(msg, isError = false) {
    const status = document.getElementById("status");
    status.innerHTML = msg;
    status.style.color = isError ? "#c00" : "#1d3557";
}
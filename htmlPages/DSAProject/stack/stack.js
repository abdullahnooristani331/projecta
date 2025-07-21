let stack = [];
let stackSize = 0;
let stackType = "number";

function initializeStack() {
    stackSize = parseInt(document.getElementById("stack-size").value);
    stackType = document.getElementById("stack-type").value;

    if (!stackSize || stackSize <= 0) return showStatus("Please enter a valid stack size.", true);

    stack = [];
    toggleStackControls(true);
    renderStack();
    showStatus("Stack initialized with size " + stackSize + " and type " + stackType + ".");
}

function toggleStackControls(enable) {
    const ids = [
        "push-value", "push-btn",
        "pop-btn", "peek-btn",
        "traverse-btn", "clear-btn"
    ];
    ids.forEach(id => document.getElementById(id).disabled = !enable);
}

function push() {
    const val = document.getElementById("push-value").value;
    if (stack.length >= stackSize) return showStatus("❌ Stack Overflow! Stack is full.", true);

    const castedVal = castStackValue(val);
    if (castedVal === null) return showStatus("❌ Value type does not match the selected data type.", true);

    stack.push(castedVal);
    renderStack(stack.length - 1, "highlight");
    showStatus(`✅ Pushed <b>${val}</b> to stack.`);
}

function pop() {
    if (stack.length === 0) return showStatus("❌ Stack Underflow! Stack is empty.", true);
    const popped = stack.pop();
    renderStack(stack.length, "highlight");
    showStatus(`🗑️ Popped <b>${popped}</b> from stack.`);
}

function peek() {
    if (stack.length === 0) return showStatus("❌ Stack is empty.", true);
    renderStack(stack.length - 1, "highlight");
    showStatus(`👁️ Top of stack: <b>${stack[stack.length - 1]}</b>`);
}

function traverse() {
    renderStack();
    showStatus("🔎 Traverse: " + stack.map((v, i) => `[${i}: ${v}]`).reverse().join(" "));
}

function clearStack() {
    stack = [];
    renderStack();
    showStatus("🧹 Stack cleared.");
}

function renderStack(highlightIndex = -1, highlightClass = "highlight") {
    const container = document.getElementById("stack-container");
    container.innerHTML = "";
    for (let i = stackSize - 1; i >= 0; i--) {
        const cell = document.createElement("div");
        cell.className = "stack-cell";
        if (i === highlightIndex) cell.classList.add(highlightClass);
        if (i === stack.length - 1 && stack.length > 0) cell.classList.add("top");
        if (i >= stack.length) cell.classList.add("empty");
        cell.innerHTML = `${i < stack.length ? stack[i] : ""}<div class="index">${i}</div>`;
        container.appendChild(cell);
    }
}

function showStatus(msg, isError = false) {
    const status = document.getElementById("status");
    status.innerHTML = msg;
    status.style.color = isError ? "#c00" : "#1d3557";
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
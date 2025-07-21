class BSTNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

let root = null;

function insert() {
    const val = parseInt(document.getElementById("insert-value").value);
    if (isNaN(val)) return showStatus("❌ Please enter a valid number.", true);
    root = insertNode(root, val);
    renderBST();
    showStatus(`✅ Inserted <b>${val}</b> into BST.`);
}
function insertNode(node, value) {
    if (!node) return new BSTNode(value);
    if (value < node.value) node.left = insertNode(node.left, value);
    else if (value > node.value) node.right = insertNode(node.right, value);
    // Ignore duplicates
    return node;
}

function deleteNode() {
    const val = parseInt(document.getElementById("delete-value").value);
    if (isNaN(val)) return showStatus("❌ Please enter a valid number.", true);
    root = deleteBSTNode(root, val);
    renderBST();
    showStatus(`🗑️ Deleted <b>${val}</b> from BST.`);
}
function deleteBSTNode(node, value) {
    if (!node) return null;
    if (value < node.value) node.left = deleteBSTNode(node.left, value);
    else if (value > node.value) node.right = deleteBSTNode(node.right, value);
    else {
        if (!node.left) return node.right;
        if (!node.right) return node.left;
        let minLarger = node.right;
        while (minLarger.left) minLarger = minLarger.left;
        node.value = minLarger.value;
        node.right = deleteBSTNode(node.right, minLarger.value);
    }
    return node;
}

function search() {
    const val = parseInt(document.getElementById("search-value").value);
    if (isNaN(val)) return showStatus("❌ Please enter a valid number.", true);
    let path = [];
    let found = searchNode(root, val, path);
    renderBST(path, found ? "found" : "highlight");
    showStatus(found ? `🔍 Found <b>${val}</b> in BST.` : "❌ Value not found.", !found);
}
function searchNode(node, value, path) {
    if (!node) return false;
    path.push(node.value);
    if (node.value === value) return true;
    if (value < node.value) return searchNode(node.left, value, path);
    return searchNode(node.right, value, path);
}

function update() {
    const oldVal = parseInt(document.getElementById("update-old").value);
    const newVal = parseInt(document.getElementById("update-new").value);
    if (isNaN(oldVal) || isNaN(newVal)) return showStatus("❌ Please enter valid numbers.", true);
    root = deleteBSTNode(root, oldVal);
    root = insertNode(root, newVal);
    renderBST();
    showStatus(`🔄 Updated value <b>${oldVal}</b> to <b>${newVal}</b>.`);
}

function findMin() {
    let node = root;
    if (!node) return showStatus("❌ BST is empty.", true);
    while (node.left) node = node.left;
    renderBST([node.value], "highlight");
    showStatus(`🔽 Min value: <b>${node.value}</b>`);
}
function findMax() {
    let node = root;
    if (!node) return showStatus("❌ BST is empty.", true);
    while (node.right) node = node.right;
    renderBST([node.value], "highlight");
    showStatus(`🔼 Max value: <b>${node.value}</b>`);
}
function findHeight() {
    const h = bstHeight(root);
    showStatus(`🌲 Height of BST: <b>${h}</b>`);
}
function bstHeight(node) {
    if (!node) return -1;
    return 1 + Math.max(bstHeight(node.left), bstHeight(node.right));
}

function traverse(type) {
    let arr = [];
    if (type === "inorder") inorder(root, arr);
    else if (type === "preorder") preorder(root, arr);
    else if (type === "postorder") postorder(root, arr);
    else if (type === "levelorder") levelorder(root, arr);
    showStatus(`🔎 ${type.charAt(0).toUpperCase() + type.slice(1)}: ${arr.join(" → ")}`);
}
function inorder(node, arr) {
    if (!node) return;
    inorder(node.left, arr);
    arr.push(node.value);
    inorder(node.right, arr);
}
function preorder(node, arr) {
    if (!node) return;
    arr.push(node.value);
    preorder(node.left, arr);
    preorder(node.right, arr);
}
function postorder(node, arr) {
    if (!node) return;
    postorder(node.left, arr);
    postorder(node.right, arr);
    arr.push(node.value);
}
function levelorder(node, arr) {
    if (!node) return;
    let q = [node];
    while (q.length) {
        let curr = q.shift();
        arr.push(curr.value);
        if (curr.left) q.push(curr.left);
        if (curr.right) q.push(curr.right);
    }
}

function clearTree() {
    root = null;
    renderBST();
    showStatus("🧹 BST cleared.");
}

function renderBST(highlightPath = [], highlightClass = "highlight") {
    const container = document.getElementById("bst-container");
    container.innerHTML = "";
    if (!root) return;
    let levels = [], queue = [{ node: root, depth: 0, pos: 0 }];
    let maxDepth = 0;
    while (queue.length) {
        let { node, depth, pos } = queue.shift();
        if (!levels[depth]) levels[depth] = [];
        levels[depth].push({ node, pos });
        maxDepth = Math.max(maxDepth, depth);
        if (node.left) queue.push({ node: node.left, depth: depth + 1, pos: pos * 2 });
        if (node.right) queue.push({ node: node.right, depth: depth + 1, pos: pos * 2 + 1 });
    }
    levels.forEach((level, d) => {
        const row = document.createElement("div");
        row.className = "bst-level";
        level.forEach(({ node }) => {
            const nodeDiv = document.createElement("div");
            nodeDiv.className = "bst-node";
            if (highlightPath.includes(node.value)) nodeDiv.classList.add(highlightClass);
            nodeDiv.innerHTML = node.value;
            row.appendChild(nodeDiv);
        });
        container.appendChild(row);
    });
}

function showStatus(msg, isError = false) {
    const status = document.getElementById("status");
    status.innerHTML = msg;
    status.style.color = isError ? "#c00" : "#1d3557";
}
function renderBST(highlightPath = [], highlightClass = "highlight") {
    const container = document.getElementById("bst-container");
    container.innerHTML = "";
    if (!root) return;

    // Set up a tree container and SVG for lines
    const treeDiv = document.createElement("div");
    treeDiv.className = "bst-tree";
    treeDiv.style.position = "relative";
    treeDiv.style.width = "100%";
    treeDiv.style.height = "500px";
    treeDiv.style.minHeight = "300px";
    container.appendChild(treeDiv);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "500px");
    svg.style.position = "absolute";
    svg.style.left = "0";
    svg.style.top = "0";
    treeDiv.appendChild(svg);

    // Calculate positions recursively
    let nodePositions = [];
    let maxDepth = 0;

    function setPositions(node, depth, x, y, spread) {
        if (!node) return;
        maxDepth = Math.max(maxDepth, depth);
        nodePositions.push({
            node,
            x,
            y,
            depth
        });
        if (node.left) {
            setPositions(node.left, depth + 1, x - spread, y + 90, spread / 2);
        }
        if (node.right) {
            setPositions(node.right, depth + 1, x + spread, y + 90, spread / 2);
        }
    }

    // Start from center, spread horizontally
    setPositions(root, 0, 500, 40, 180);

    // Draw links
    nodePositions.forEach(pos => {
        const { node, x, y } = pos;
        if (node.left) {
            const child = nodePositions.find(p => p.node === node.left);
            drawLine(svg, x, y, child.x, child.y);
        }
        if (node.right) {
            const child = nodePositions.find(p => p.node === node.right);
            drawLine(svg, x, y, child.x, child.y);
        }
    });

    // Draw nodes
    nodePositions.forEach(pos => {
        const { node, x, y } = pos;
        const nodeDiv = document.createElement("div");
        nodeDiv.className = "bst-node";
        if (highlightPath.includes(node.value)) nodeDiv.classList.add(highlightClass);
        nodeDiv.innerHTML = node.value;
        nodeDiv.style.left = (x - 24) + "px";
        nodeDiv.style.top = (y - 24) + "px";
        treeDiv.appendChild(nodeDiv);
    });
}

// Helper to draw a line between two points in SVG
function drawLine(svg, x1, y1, x2, y2) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1 + 24); // bottom of parent node
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2 - 24); // top of child node
    line.setAttribute("stroke", "#457b9d");
    line.setAttribute("stroke-width", "2.5");
    svg.appendChild(line);
}

import { useState, useRef, useEffect } from "react";
import { Network } from "vis-network/standalone";
import { DataSet } from "vis-data";
import "./Tree.css";

// ---------------- TREE NODE ----------------
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

// ---------------- BUILD TREE ----------------
function buildTreePreIn(preorder, inorder) {
  if (!preorder.length || !inorder.length) return null;
  const rootVal = preorder[0];
  const root = new TreeNode(rootVal);
  const idx = inorder.indexOf(rootVal);

  root.left = buildTreePreIn(preorder.slice(1, idx + 1), inorder.slice(0, idx));
  root.right = buildTreePreIn(preorder.slice(idx + 1), inorder.slice(idx + 1));
  return root;
}

function buildTreePostIn(postorder, inorder) {
  if (!postorder.length || !inorder.length) return null;
  const rootVal = postorder[postorder.length - 1];
  const root = new TreeNode(rootVal);
  const idx = inorder.indexOf(rootVal);

  root.left = buildTreePostIn(postorder.slice(0, idx), inorder.slice(0, idx));
  root.right = buildTreePostIn(postorder.slice(idx, postorder.length - 1), inorder.slice(idx + 1));
  return root;
}

function buildBST(array) {
  if (!array.length) return null;
  array.sort((a, b) => a - b);
  const mid = Math.floor(array.length / 2);
  const root = new TreeNode(array[mid]);
  root.left = buildBST(array.slice(0, mid));
  root.right = buildBST(array.slice(mid + 1));
  return root;
}

// ---------------- TRAVERSALS ----------------
function inorderTraversal(root, result = []) {
  if (!root) return;
  inorderTraversal(root.left, result);
  result.push(root.val);
  inorderTraversal(root.right, result);
  return result;
}

function preorderTraversal(root, result = []) {
  if (!root) return;
  result.push(root.val);
  preorderTraversal(root.left, result);
  preorderTraversal(root.right, result);
  return result;
}

function postorderTraversal(root, result = []) {
  if (!root) return;
  postorderTraversal(root.left, result);
  postorderTraversal(root.right, result);
  result.push(root.val);
  return result;
}

// ---------------- TREE VISUALIZATION ----------------
function generateNodesEdges(root) {
  const nodes = [];
  const edges = [];
  let idCounter = 1;

  function traverse(node, parentId = null) {
    if (!node) return null;
    const nodeId = idCounter++;
    nodes.push({ id: nodeId, label: String(node.val) });

    if (parentId) edges.push({ from: parentId, to: nodeId, arrows: "to" });

    traverse(node.left, nodeId);
    traverse(node.right, nodeId);
  }

  traverse(root);
  return { nodes, edges };
}

// ---------------- COMPONENT ----------------
export default function Tree() {
  const [method, setMethod] = useState("preIn");
  const [preorder, setPreorder] = useState("");
  const [postorder, setPostorder] = useState("");
  const [inorder, setInorder] = useState("");
  const [array, setArray] = useState("");
  const [root, setRoot] = useState(null);
  const [traversalType, setTraversalType] = useState("inorder");
  const [traversalResult, setTraversalResult] = useState([]);
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  const handleGenerate = () => {
    let tree = null;
    if (method === "preIn") {
      const pre = preorder.split(",").map(Number);
      const ino = inorder.split(",").map(Number);
      tree = buildTreePreIn(pre, ino);
    } else if (method === "postIn") {
      const post = postorder.split(",").map(Number);
      const ino = inorder.split(",").map(Number);
      tree = buildTreePostIn(post, ino);
    } else if (method === "bst") {
      const arr = array.split(",").map(Number);
      tree = buildBST(arr);
    }
    setRoot(tree);
    setTraversalResult([]);
  };

  const handleTraversal = () => {
    if (!root) return;
    let result = [];
    if (traversalType === "inorder") result = inorderTraversal(root);
    if (traversalType === "preorder") result = preorderTraversal(root);
    if (traversalType === "postorder") result = postorderTraversal(root);
    setTraversalResult(result);
  };

  // ---------------- RENDER TREE USING VIS-NETWORK ----------------
  useEffect(() => {
    if (!root || !containerRef.current) return;

    const { nodes, edges } = generateNodesEdges(root);
    const nodesDS = new DataSet(nodes);
    const edgesDS = new DataSet(edges);

    const data = { nodes: nodesDS, edges: edgesDS };
const options = {
  layout: { hierarchical: { direction: "UD", sortMethod: "directed" } },
  nodes: { 
    shape: "dot", 
    color: "#2ae8a9", 
    font: { color: "#000", size: 16 },
    size: 25,
    borderWidth: 2,
    borderWidthSelected: 4,
  },
  edges: { arrows: { to: true }, color: "#848484", smooth: true, width: 2 },
  physics: { enabled: false },
};

    networkRef.current = new Network(containerRef.current, data, options);

  }, [root]);

  return (
    <div className="tree-page">
      <h2>Tree Visualizer</h2>

      <div className="controls">
        <label>Method: </label>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="preIn">Binary Tree:Preorder + Inorder</option>
          <option value="postIn">Binary Tree:Postorder + Inorder</option>
          <option value="bst">BST from Array</option>
        </select>

        {/* Input row for Pre/In */}
        {method === "preIn" && (
          <div className="input-row">
            <input
              type="text"
              placeholder="Preorder (comma separated)"
              value={preorder}
              onChange={(e) => setPreorder(e.target.value)}
            />
            <input
              type="text"
              placeholder="Inorder (comma separated)"
              value={inorder}
              onChange={(e) => setInorder(e.target.value)}
            />
          </div>
        )}

        {/* Input row for Post/In */}
        {method === "postIn" && (
          <div className="input-row">
            <input
              type="text"
              placeholder="Postorder (comma separated)"
              value={postorder}
              onChange={(e) => setPostorder(e.target.value)}
            />
            <input
              type="text"
              placeholder="Inorder (comma separated)"
              value={inorder}
              onChange={(e) => setInorder(e.target.value)}
            />
          </div>
        )}

        {/* Single input for BST */}
        {method === "bst" && (
          <input
            type="text"
            placeholder="Array (comma separated)"
            value={array}
            onChange={(e) => setArray(e.target.value)}
          />
        )}

        <button onClick={handleGenerate} className="generate-btn">Generate Tree</button>
      </div>

      <div className="tree-visualization" ref={containerRef} style={{ height: "500px", border: "1px solid #ccc", marginTop: "20px", borderRadius: "10px" }}></div>

      
      {root && (
  <div
    style={{
      marginTop: "1.5rem",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      gap: "1rem",
      padding: "1rem 0.5rem",
      background: "#f7f8fc",
      borderRadius: "12px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)"
    }}
  >
    <label style={{ fontWeight: 500, fontSize: "1rem", color: "#333" }}>Traversal: </label>
    <select
      value={traversalType}
      onChange={(e) => setTraversalType(e.target.value)}
      style={{
        padding: "0.5rem 0.8rem",
        fontSize: "1rem",
        borderRadius: "8px",
        border: "1px solid #ccc",
        outline: "none",
        transition: "border 0.2s, boxShadow 0.2s"
      }}
      onFocus={(e) => (e.target.style.boxShadow = "0 0 5px rgba(102,126,234,0.5)")}
      onBlur={(e) => (e.target.style.boxShadow = "none")}
    >
      <option value="inorder">Inorder</option>
      <option value="preorder">Preorder</option>
      <option value="postorder">Postorder</option>
    </select>
    <button
      onClick={handleTraversal}
      style={{
        padding: "0.6rem 1.2rem",
        fontSize: "1rem",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        background: "linear-gradient(90deg, #667eea, #764ba2)",
        color: "white",
        fontWeight: 500,
        transition: "transform 0.2s, boxShadow 0.2s"
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(102,126,234,0.4)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      Run Traversal
    </button>

    {traversalResult.length > 0 && (
      <div
        style={{
          width: "100%",
          marginTop: "1rem",
          fontSize: "1.1rem",
          fontWeight: 600,
          color: "#333",
          textAlign: "center",
          wordBreak: "break-word"
        }}
      >
        Result: {traversalResult.join(" → ")}
      </div>
    )}
  </div>
)}
    </div>
  );
}
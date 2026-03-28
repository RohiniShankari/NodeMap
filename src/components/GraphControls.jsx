

import { useState } from "react";
import "./GraphControls.css";

export default function GraphControls({ onChange }) {
  const [edges, setEdges] = useState("(1,2,4),(1,3,2),(2,3,5),(3,4,1)");
  const [algo, setAlgo] = useState("bfs");
  const [isDirected, setIsDirected] = useState(true);
  const [startNode, setStartNode] = useState("");
  const [endNode, setEndNode] = useState("");

  const handleApply = () => {
    onChange({ edges, algo, isDirected, startNode, endNode });
  };

  return (
    <div className="controls-container">
       <h2>Graph Visualizer</h2>
      <div className="controls-grid">
        <div className="control-group">
          <label className="control-label">
            <i className="icon">📝</i> Edges
          </label>
          <input
            className="control-input"
            value={edges}
            onChange={e => setEdges(e.target.value)}
            placeholder="e.g., (1,2,4),(1,3,2)"
          />
          <small className="input-hint">Format: (from,to,weight)</small>
        </div>

        <div className="control-group">
          <label className="control-label">
            <i className="icon">🧠</i> Algorithm
          </label>
          <select 
            className="control-select" 
            value={algo} 
            onChange={e => setAlgo(e.target.value)}
          >
            <option value="bfs">🔍 BFS - Breadth First Search</option>
            <option value="dfs">🌲 DFS - Depth First Search</option>
            <option value="dijkstra">⚡ Dijkstra's Algorithm</option>
          </select>
        </div>

        <div className="control-group">
          <label className="control-label">
            <i className="icon">↔️</i> Graph Type
          </label>
          <div className="toggle-switch">
            <input
              type="checkbox"
              id="directed-toggle"
              checked={isDirected}
              onChange={e => setIsDirected(e.target.checked)}
            />
            <label htmlFor="directed-toggle" className="toggle-label">
              <span className="toggle-text">Directed</span>
              <span className="toggle-text">Undirected</span>
            </label>
          </div>
        </div>

        <div className="control-group">
          <label className="control-label">
            <i className="icon">🚀</i> Start Node
          </label>
          <input
            type="number"
            className="control-input"
            value={startNode}
            onChange={e => setStartNode(e.target.value)}
            placeholder="Optional"
          />
        </div>

        {algo === "dijkstra" && (
          <div className="control-group fade-in">
            <label className="control-label">
              <i className="icon">🎯</i> End Node
            </label>
            <input
              type="number"
              className="control-input"
              value={endNode}
              onChange={e => setEndNode(e.target.value)}
              placeholder="Required for Dijkstra"
            />
          </div>
        )}
      </div>

      <button className="apply-button" onClick={handleApply}>
        <span className="button-content">
          <i className="icon">✨</i> Apply & Visualize
        </span>
      </button>
    </div>
  );
}
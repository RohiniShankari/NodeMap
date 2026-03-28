import { useState } from "react";
import Graph from "./components/Graph.jsx";
import GraphControls from "./components/GraphControls.jsx";
import Tree from "./components/Tree.jsx";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("home"); // "home" | "graph" | "tree"
  const [graphConfig, setGraphConfig] = useState({
    edges: "(1,2,4),(1,3,2),(2,3,5),(3,4,1)",
    algo: "bfs",
    isDirected: true,
    startNode: "",
    endNode: ""
  });

  const renderContent = () => {
    if (page === "graph") {
      return (
        <>
          <GraphControls onChange={setGraphConfig} />
          <Graph
            edgesInput={graphConfig.edges}
            isDirected={graphConfig.isDirected}
            algo={graphConfig.algo}
            startNode={graphConfig.startNode}
            endNode={graphConfig.endNode}
          />
        </>
      );
    }
    if (page === "tree") {
      return <Tree />;
    }
    // Home page with cards
    return (
      <div className="home-page">
        <h2>Choose What to Visualize</h2>
        <div className="cards-container">
          <div className="card" onClick={() => setPage("graph")}>
            <div className="card-icon">🖇️</div>
            <h3>Graph</h3>
            <p>Visualize Graph algorithms like BFS, DFS, and Dijkstra.</p>
          </div>
          <div className="card" onClick={() => setPage("tree")}>
            <div className="card-icon">🌳</div>
            <h3>Tree</h3>
            <p>Build Trees from traversals or arrays and run traversals.</p>
          </div>
        </div>
      </div>
      
    );
  };

  return (
    <div className="app">
      <div className="header">
        <h1>
          <span className="gradient-text">NodeMap</span>
        </h1>
        <p className="subtitle">Interactive Graph & Tree Visualizations</p>
      </div>
      <div className="content">
        {renderContent()}
      </div>
    </div>
  );
}

// import { useEffect, useRef } from "react";
// import { Network } from "vis-network/standalone";
// import { DataSet } from "vis-data";

// import { bfs } from "../algorithms/bfs.js";
// import { dfs } from "../algorithms/dfs.js";
// import { dijkstra } from "../algorithms/dijkstra.js";

// // ---------------- PARSE EDGES ----------------
// function parseEdges(input) {
//   if (!input || !input.includes("(")) return [];

//   return input
//     .replace(/\s/g, "")
//     .split("),")
//     .map(edge => {
//       edge = edge.replace(/[()]/g, "");
//       const parts = edge.split(",");
//       if (parts.length !== 3) return null;
//       const [from, to, weight] = parts.map(Number);
//       if (isNaN(from) || isNaN(to) || isNaN(weight)) return null;
//       return { from, to, weight };
//     })
//     .filter(e => e !== null);
// }

// // ---------------- BUILD ADJACENCY ----------------
// function buildAdj(edges, isDirected) {
//   const adj = {};
//   edges.forEach(e => {
//     const from = String(e.from);
//     const to = String(e.to);
//     const weight = Number(e.weight);

//     if (!adj[from]) adj[from] = [];
//     adj[from].push({ node: to, weight });

//     if (!isDirected) {
//       if (!adj[to]) adj[to] = [];
//       adj[to].push({ node: from, weight });
//     }
//   });
//   return adj;
// }

// // ---------------- COMPONENT ----------------
// export default function Graph({ edgesInput, isDirected, algo, startNode, endNode }) {
//   const containerRef = useRef(null);
//   const networkRef = useRef(null);
//   const nodesRef = useRef(null);
//   const edgesRef = useRef(null);

//   useEffect(() => {
//     const parsed = parseEdges(edgesInput);
//     if (!parsed.length) return;

//     const nodeSet = new Set();
//     parsed.forEach(e => {
//       nodeSet.add(String(e.from));
//       nodeSet.add(String(e.to));
//     });

//     const availableNodes = Array.from(nodeSet);
    
//     // Validate start and end nodes
//     const start = startNode !== "" ? String(startNode) : availableNodes[0];
//     const target = endNode !== "" ? String(endNode) : availableNodes[availableNodes.length - 1];
    
//     if (!nodeSet.has(start)) {
//       console.warn(`Start node ${start} not found in graph`);
//       return;
//     }
//     if (algo === "dijkstra" && !nodeSet.has(target)) {
//       console.warn(`End node ${target} not found in graph`);
//       return;
//     }

//     // ---------------- NODES ----------------
//     nodesRef.current = new DataSet(
//       Array.from(nodeSet).map(n => ({ id: String(n), label: String(n), color: "#97C2FC" }))
//     );

//     // ---------------- EDGES ----------------
//     edgesRef.current = new DataSet(
//       parsed.map((e, index) => ({
//         id: `e${index}`,
//         from: String(e.from),
//         to: String(e.to),
//         label: String(e.weight),
//         color: { color: "#848484" },
//         width: 1
//       }))
//     );

//     const data = { nodes: nodesRef.current, edges: edgesRef.current };
//     const options = { 
//       edges: { arrows: isDirected ? "to" : "" }, 
//       physics: { enabled: true } 
//     };

//     networkRef.current = new Network(containerRef.current, data, options);

//     const adj = buildAdj(parsed, isDirected);

//     // ---------------- BFS ----------------
//     if (algo === "bfs") {
//       const order = bfs(start, adj);
//       order.forEach((node, i) =>
//         setTimeout(() => nodesRef.current.update({ id: String(node), color: "orange" }), i * 500)
//       );
//     }

//     // ---------------- DFS ----------------
//     if (algo === "dfs") {
//       const order = dfs(start, adj);
//       order.forEach((node, i) =>
//         setTimeout(() => nodesRef.current.update({ id: String(node), color: "purple" }), i * 500)
//       );
//     }

//     // ---------------- DIJKSTRA ----------------
//     if (algo === "dijkstra") {
//       if (!start || !target) return;

//       const { dist, prev } = dijkstra(start, adj);
      
//       // Check if target is reachable
//       if (dist[target] === Infinity) {
//         console.warn(`Target node ${target} is not reachable from start node ${start}`);
//         return;
//       }

//       // Reconstruct path from start → target
//       const path = [];
//       let current = target;
//       while (current !== null) {
//         path.push(current);
//         current = prev[current];
//       }
//       path.reverse();

//       if (path[0] !== start) {
//         console.warn("Path reconstruction failed");
//         return;
//       }

//       // Highlight nodes along path
//       path.forEach((node, i) =>
//         setTimeout(() => nodesRef.current.update({ id: node, color: "green" }), i * 500)
//       );

//       // Highlight edges along path
//       for (let i = 0; i < path.length - 1; i++) {
//         const from = path[i];
//         const to = path[i + 1];
        
//         // Try to find edge in forward direction
//         let edge = edgesRef.current.get({
//           filter: e => e.from === from && e.to === to
//         })[0];
        
//         // If not found and graph is undirected, try the reverse direction
//         if (!edge && !isDirected) {
//           edge = edgesRef.current.get({
//             filter: e => e.from === to && e.to === from
//           })[0];
//         }
        
//         if (edge) {
//           setTimeout(() =>
//             edgesRef.current.update({ 
//               id: edge.id, 
//               color: { color: "green" }, 
//               width: 3 
//             }),
//             i * 500
//           );
//         }
//       }
//     }

//     // Cleanup function to reset colors when dependencies change
//     return () => {
//       if (nodesRef.current) {
//         const currentNodes = nodesRef.current.get();
//         currentNodes.forEach(node => {
//           nodesRef.current.update({ id: node.id, color: "#97C2FC" });
//         });
//       }
//       if (edgesRef.current) {
//         const currentEdges = edgesRef.current.get();
//         currentEdges.forEach(edge => {
//           edgesRef.current.update({ 
//             id: edge.id, 
//             color: { color: "#848484" }, 
//             width: 1 
//           });
//         });
//       }
//     };
//   }, [edgesInput, isDirected, algo, startNode, endNode]);

//   return <div ref={containerRef} style={{ height: "500px", border: "1px solid black" }} />;
// }
// import { useEffect, useRef } from "react";
// import { Network } from "vis-network/standalone";
// import { DataSet } from "vis-data";

// import { bfs } from "../algorithms/bfs.js";
// import { dfs } from "../algorithms/dfs.js";
// import { dijkstra } from "../algorithms/dijkstra.js";

// // ---------------- PARSE EDGES ----------------
// function parseEdges(input) {
//   if (!input || !input.includes("(")) return [];
//   return input
//     .replace(/\s/g, "")
//     .split("),")
//     .map(edge => {
//       edge = edge.replace(/[()]/g, "");
//       const parts = edge.split(",");
//       if (parts.length !== 3) return null;
//       const [from, to, weight] = parts.map(Number);
//       if (isNaN(from) || isNaN(to) || isNaN(weight)) return null;
//       return { from, to, weight };
//     })
//     .filter(e => e !== null);
// }

// // ---------------- BUILD ADJACENCY ----------------
// function buildAdj(edges, isDirected) {
//   const adj = {};
//   edges.forEach(e => {
//     const from = String(e.from);
//     const to = String(e.to);
//     const weight = Number(e.weight);
//     if (!adj[from]) adj[from] = [];
//     adj[from].push({ node: to, weight });
//     if (!isDirected) {
//       if (!adj[to]) adj[to] = [];
//       adj[to].push({ node: from, weight });
//     }
//   });
//   return adj;
// }

// // ---------------- COMPONENT ----------------
// export default function Graph({ edgesInput, isDirected, algo, startNode, endNode }) {
//   const containerRef = useRef(null);
//   const nodesRef = useRef(null);
//   const edgesRef = useRef(null);

//   useEffect(() => {
//     const parsed = parseEdges(edgesInput);
//     if (!parsed.length) return;

//     const nodeSet = new Set();
//     parsed.forEach(e => nodeSet.add(String(e.from)) || nodeSet.add(String(e.to)));
//     const nodesArray = Array.from(nodeSet);

//     const start = startNode ? String(startNode) : nodesArray[0];
//     const target = endNode ? String(endNode) : nodesArray[nodesArray.length - 1];

//     // ---------------- NODES ----------------
//     nodesRef.current = new DataSet(
//       nodesArray.map(n => ({ id: n, label: n, color: "#87CEFA", shape: "dot", size: 20 }))
//     );

//     // ---------------- EDGES ----------------
//     edgesRef.current = new DataSet(
//       parsed.map((e, i) => ({
//         id: `e${i}`,
//         from: String(e.from),
//         to: String(e.to),
//         label: String(e.weight),
//         color: { color: "#B0C4DE" },
//         width: 2,
//         arrows: isDirected ? "to" : ""
//       }))
//     );

//     const data = { nodes: nodesRef.current, edges: edgesRef.current };
//     const options = {
//       edges: { smooth: { type: "dynamic" } },
//       physics: { enabled: true, stabilization: true, timestep: 0.5, adaptiveTimestep: true }
//     };

//     const network = new Network(containerRef.current, data, options);

//     const adj = buildAdj(parsed, isDirected);

//     // ---------------- ALGORITHMS ----------------
//     const highlightPath = (path) => {
//       path.forEach((node, i) =>
//         setTimeout(() => nodesRef.current.update({ id: node, color: "#32CD32" }), i * 400)
//       );
//       for (let i = 0; i < path.length - 1; i++) {
//         const from = path[i], to = path[i + 1];
//         const edge = edgesRef.current.get({
//           filter: e => e.from === from && e.to === to || (!isDirected && e.from === to && e.to === from)
//         })[0];
//         if (edge) {
//           setTimeout(() =>
//             edgesRef.current.update({ id: edge.id, color: { color: "#32CD32" }, width: 4 }), i * 400
//           );
//         }
//       }
//     };

//     if (algo === "bfs") highlightPath(bfs(start, adj));
//     if (algo === "dfs") highlightPath(dfs(start, adj));
//     if (algo === "dijkstra") {
//       const { dist, prev } = dijkstra(start, adj);
//       if (dist[target] === Infinity) return;
//       const path = [];
//       let current = target;
//       while (current) {
//         path.push(current);
//         current = prev[current];
//       }
//       path.reverse();
//       highlightPath(path);
//     }

//     // ---------------- CLEANUP ----------------
//     return () => {
//       nodesRef.current.forEach(node => nodesRef.current.update({ id: node.id, color: "#87CEFA" }));
//       edgesRef.current.forEach(edge => edgesRef.current.update({ id: edge.id, color: { color: "#B0C4DE" }, width: 2 }));
//     };
//   }, [edgesInput, isDirected, algo, startNode, endNode]);

//   return <div ref={containerRef} style={{ height: "500px" }} />;
// }
import { useEffect, useRef, useState } from "react";
import { Network } from "vis-network/standalone";
import { DataSet } from "vis-data";
import "./Graph.css";

import { bfs } from "../algorithms/bfs.js";
import { dfs } from "../algorithms/dfs.js";
import { dijkstra } from "../algorithms/dijkstra.js";

// ---------------- PARSE EDGES ----------------
function parseEdges(input) {
  if (!input || !input.includes("(")) return [];

  return input
    .replace(/\s/g, "")
    .split("),")
    .map(edge => {
      edge = edge.replace(/[()]/g, "");
      const parts = edge.split(",");
      if (parts.length !== 3) return null;
      const [from, to, weight] = parts.map(Number);
      if (isNaN(from) || isNaN(to) || isNaN(weight)) return null;
      return { from, to, weight };
    })
    .filter(e => e !== null);
}

// ---------------- BUILD ADJACENCY ----------------
function buildAdj(edges, isDirected) {
  const adj = {};
  edges.forEach(e => {
    const from = String(e.from);
    const to = String(e.to);
    const weight = Number(e.weight);

    if (!adj[from]) adj[from] = [];
    adj[from].push({ node: to, weight });

    if (!isDirected) {
      if (!adj[to]) adj[to] = [];
      adj[to].push({ node: from, weight });
    }
  });
  return adj;
}

// ---------------- COMPONENT ----------------
export default function Graph({ edgesInput, isDirected, algo, startNode, endNode }) {
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const nodesRef = useRef(null);
  const edgesRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutsRef = useRef([]);

  // Clear all timeouts
  const clearAllTimeouts = () => {
    animationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    animationTimeoutsRef.current = [];
  };

  useEffect(() => {
    const parsed = parseEdges(edgesInput);
    if (!parsed.length) return;

    // Clear previous animations
    clearAllTimeouts();
    
    // Reset colors if they exist
    if (nodesRef.current) {
      const currentNodes = nodesRef.current.get();
      currentNodes.forEach(node => {
        nodesRef.current.update({ id: node.id, color: "#97C2FC" });
      });
    }
    if (edgesRef.current) {
      const currentEdges = edgesRef.current.get();
      currentEdges.forEach(edge => {
        edgesRef.current.update({ 
          id: edge.id, 
          color: { color: "#848484" }, 
          width: 1 
        });
      });
    }

    const nodeSet = new Set();
    parsed.forEach(e => {
      nodeSet.add(String(e.from));
      nodeSet.add(String(e.to));
    });

    const availableNodes = Array.from(nodeSet);
    
    // Validate start and end nodes
    const start = startNode !== "" ? String(startNode) : availableNodes[0];
    const target = endNode !== "" ? String(endNode) : availableNodes[availableNodes.length - 1];
    
    if (!nodeSet.has(start)) {
      console.warn(`Start node ${start} not found in graph`);
      return;
    }
    if (algo === "dijkstra" && !nodeSet.has(target)) {
      console.warn(`End node ${target} not found in graph`);
      return;
    }

    // ---------------- NODES ----------------
    nodesRef.current = new DataSet(
      Array.from(nodeSet).map(n => ({ 
        id: String(n), 
        label: String(n), 
        color: "#97C2FC",
        font: { color: "#2d3748", size: 16, face: "Poppins" },
        borderWidth: 2,
        borderWidthSelected: 3,
        size: 30,
        shape: "dot"
      }))
    );

    // ---------------- EDGES ----------------
    edgesRef.current = new DataSet(
      parsed.map((e, index) => ({
        id: `e${index}`,
        from: String(e.from),
        to: String(e.to),
        label: String(e.weight),
        color: { color: "#848484", highlight: "#667eea" },
        width: 2,
        font: { size: 12, face: "Poppins", background: "white", strokeWidth: 0 },
        smooth: { enabled: true, type: "dynamic" },
        arrows: isDirected ? { to: { enabled: true, scaleFactor: 0.8 } } : undefined
      }))
    );

    const data = { nodes: nodesRef.current, edges: edgesRef.current };
    const options = { 
      nodes: {
        shape: "dot",
        size: 30,
        font: {
          size: 16,
          face: "Poppins",
          color: "#2d3748"
        },
        borderWidth: 2,
        borderWidthSelected: 3,
        color: {
          border: "#4a5568",
          background: "#97C2FC",
          highlight: {
            border: "#667eea",
            background: "#764ba2"
          }
        }
      },
      edges: {
        smooth: {
          enabled: true,
          type: "dynamic",
          roundness: 0.5
        },
        font: {
          size: 12,
          face: "Poppins",
          background: "white",
          strokeWidth: 0,
          align: "middle"
        },
        width: 2,
        selectionWidth: 3
      },
      physics: { 
        enabled: true,
        stabilization: { iterations: 100 },
        solver: "forceAtlas2Based"
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        navigationButtons: false,
        zoomView: true,
        dragView: true
      },
      layout: {
        improvedLayout: true,
        hierarchical: false
      }
    };

    // Destroy existing network if it exists
    if (networkRef.current) {
      networkRef.current.destroy();
    }
    
    networkRef.current = new Network(containerRef.current, data, options);
    
    // Center the graph
    networkRef.current.fit({ animation: true, duration: 500 });

    const adj = buildAdj(parsed, isDirected);

    // Set animating state
    setIsAnimating(true);

    // ---------------- BFS ----------------
    if (algo === "bfs") {
      const order = bfs(start, adj);
      order.forEach((node, i) => {
        const timeout = setTimeout(() => {
          nodesRef.current.update({ 
            id: String(node), 
            color: "#FFA07A",
            borderWidth: 3,
            borderColor: "#ff6b6b"
          });
        }, i * 500);
        animationTimeoutsRef.current.push(timeout);
      });
      
      // Reset colors after animation
      const resetTimeout = setTimeout(() => {
        if (nodesRef.current) {
          order.forEach(node => {
            nodesRef.current.update({ 
              id: String(node), 
              color: "#97C2FC",
              borderWidth: 2,
              borderColor: "#4a5568"
            });
          });
        }
        setIsAnimating(false);
      }, order.length * 500);
      animationTimeoutsRef.current.push(resetTimeout);
    }

    // ---------------- DFS ----------------
    if (algo === "dfs") {
      const order = dfs(start, adj);
      order.forEach((node, i) => {
        const timeout = setTimeout(() => {
          nodesRef.current.update({ 
            id: String(node), 
            color: "#DDA0DD",
            borderWidth: 3,
            borderColor: "#9370db"
          });
        }, i * 500);
        animationTimeoutsRef.current.push(timeout);
      });
      
      // Reset colors after animation
      const resetTimeout = setTimeout(() => {
        if (nodesRef.current) {
          order.forEach(node => {
            nodesRef.current.update({ 
              id: String(node), 
              color: "#97C2FC",
              borderWidth: 2,
              borderColor: "#4a5568"
            });
          });
        }
        setIsAnimating(false);
      }, order.length * 500);
      animationTimeoutsRef.current.push(resetTimeout);
    }

    // ---------------- DIJKSTRA ----------------
    if (algo === "dijkstra") {
      if (!start || !target) {
        setIsAnimating(false);
        return;
      }

      const { dist, prev } = dijkstra(start, adj);
      
      // Check if target is reachable
      if (dist[target] === Infinity) {
        console.warn(`Target node ${target} is not reachable from start node ${start}`);
        setIsAnimating(false);
        return;
      }

      // Reconstruct path from start → target
      const path = [];
      let current = target;
      while (current !== null) {
        path.push(current);
        current = prev[current];
      }
      path.reverse();

      if (path[0] !== start) {
        console.warn("Path reconstruction failed");
        setIsAnimating(false);
        return;
      }

      // Display shortest path distance
      console.log(`Shortest path distance from ${start} to ${target}: ${dist[target]}`);

      // Highlight nodes along path
      path.forEach((node, i) => {
        const timeout = setTimeout(() => {
          nodesRef.current.update({ 
            id: node, 
            color: "#6BCB77",
            borderWidth: 4,
            borderColor: "#2e7d32"
          });
        }, i * 500);
        animationTimeoutsRef.current.push(timeout);
      });

      // Highlight edges along path
      for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];
        
        // Try to find edge in forward direction
        let edge = edgesRef.current.get({
          filter: e => e.from === from && e.to === to
        })[0];
        
        // If not found and graph is undirected, try the reverse direction
        if (!edge && !isDirected) {
          edge = edgesRef.current.get({
            filter: e => e.from === to && e.to === from
          })[0];
        }
        
        if (edge) {
          const timeout = setTimeout(() => {
            edgesRef.current.update({ 
              id: edge.id, 
              color: { color: "#6BCB77", highlight: "#4caf50" }, 
              width: 5,
              shadow: { enabled: true, color: "#6BCB77", size: 10, x: 0, y: 0 }
            });
          }, i * 500);
          animationTimeoutsRef.current.push(timeout);
        }
      }
      
      // Reset colors after animation
      const resetTimeout = setTimeout(() => {
        if (nodesRef.current) {
          path.forEach(node => {
            nodesRef.current.update({ 
              id: node, 
              color: "#97C2FC",
              borderWidth: 2,
              borderColor: "#4a5568"
            });
          });
        }
        if (edgesRef.current) {
          for (let i = 0; i < path.length - 1; i++) {
            const from = path[i];
            const to = path[i + 1];
            
            let edge = edgesRef.current.get({
              filter: e => e.from === from && e.to === to
            })[0];
            
            if (!edge && !isDirected) {
              edge = edgesRef.current.get({
                filter: e => e.from === to && e.to === from
              })[0];
            }
            
            if (edge) {
              edgesRef.current.update({ 
                id: edge.id, 
                color: { color: "#848484" }, 
                width: 2,
                shadow: false
              });
            }
          }
        }
        setIsAnimating(false);
      }, path.length * 500);
      animationTimeoutsRef.current.push(resetTimeout);
    }

    // Cleanup function to reset colors and clear timeouts when dependencies change
    return () => {
      clearAllTimeouts();
      if (networkRef.current) {
        networkRef.current.destroy();
      }
    };
  }, [edgesInput, isDirected, algo, startNode, endNode]);

  return (
    <div className="graph-container">
     
      {isAnimating && (
        <div className="animation-overlay">
          <div className="spinner"></div>
          <p>Visualizing Algorithm...</p>
        </div>
      )}
      <div ref={containerRef} className="graph-canvas" />
    </div>
  );
}
export function bfs(start, adj) {
  const visited = new Set();
  const order = [];
  const queue = [start];

  while (queue.length) {
    const node = queue.shift();
    if (visited.has(node)) continue;
    visited.add(node);
    order.push(node);
    (adj[node] || []).forEach(nei => {
      if (!visited.has(nei.node)) queue.push(nei.node);
    });
  }

  return order;
}
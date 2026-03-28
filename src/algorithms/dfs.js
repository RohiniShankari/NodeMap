export function dfs(start, adj, visited = new Set(), order = []) {
  visited.add(start);
  order.push(start);
  (adj[start] || []).forEach(nei => {
    if (!visited.has(nei.node)) dfs(nei.node, adj, visited, order);
  });
  return order;
}
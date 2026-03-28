// Min-heap implementation for priority queue
class MinHeap {
  constructor() {
    this.heap = [];
  }

  push(node) {
    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return min;
  }

  bubbleUp(index) {
    const node = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (node.dist >= parent.dist) break;
      this.heap[parentIndex] = node;
      this.heap[index] = parent;
      index = parentIndex;
    }
  }

  sinkDown(index) {
    const length = this.heap.length;
    const node = this.heap[index];
    
    while (true) {
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;
      let swap = null;
      let leftChild, rightChild;

      if (leftChildIndex < length) {
        leftChild = this.heap[leftChildIndex];
        if (leftChild.dist < node.dist) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        rightChild = this.heap[rightChildIndex];
        if ((swap === null && rightChild.dist < node.dist) ||
            (swap !== null && rightChild.dist < leftChild.dist)) {
          swap = rightChildIndex;
        }
      }

      if (swap === null) break;
      this.heap[index] = this.heap[swap];
      this.heap[swap] = node;
      index = swap;
    }
  }

  isEmpty() {
    return this.heap.length === 0;
  }
}

export function dijkstra(start, adj) {
  const dist = {};
  const prev = {};
  const visited = new Set();
  const pq = new MinHeap();

  start = String(start);

  // Get all nodes (both keys and values in adjacency)
  const allNodes = new Set();
  Object.keys(adj).forEach(node => {
    allNodes.add(node);
    adj[node].forEach(neighbor => {
      allNodes.add(String(neighbor.node));
    });
  });

  // Initialize distances and previous nodes
  allNodes.forEach(node => {
    dist[node] = Infinity;
    prev[node] = null;
  });

  dist[start] = 0;
  pq.push({ node: start, dist: 0 });

  while (!pq.isEmpty()) {
    const { node: currentNode, dist: currentDist } = pq.pop();

    // Skip if already visited
    if (visited.has(currentNode)) {
      continue;
    }

    visited.add(currentNode);

    // Process neighbors
    const neighbors = adj[currentNode] || [];
    for (const neighbor of neighbors) {
      const neighborNode = String(neighbor.node);
      
      // Skip if already visited
      if (visited.has(neighborNode)) {
        continue;
      }
      
      const newDist = dist[currentNode] + neighbor.weight;
      
      // If we found a shorter path, update
      if (newDist < dist[neighborNode]) {
        dist[neighborNode] = newDist;
        prev[neighborNode] = currentNode;
        pq.push({ node: neighborNode, dist: newDist });
      }
    }
  }

  return { dist, prev };
}
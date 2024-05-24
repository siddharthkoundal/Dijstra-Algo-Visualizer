export function astar(grid, startNode, finishNode) {
  const openSet = [];
  const closedSet = new Set();
  startNode.g = 0;
  startNode.h = heuristic(startNode, finishNode);
  startNode.f = startNode.g + startNode.h;
  openSet.push(startNode);

  while (openSet.length > 0) {
    openSet.sort((nodeA, nodeB) => nodeA.f - nodeB.f);
    const currentNode = openSet.shift();

    if (currentNode === finishNode) {
      return getNodesInShortestPathOrder(finishNode);
    }

    closedSet.add(currentNode);

    for (const neighbor of getNeighbors(currentNode, grid)) {
      if (closedSet.has(neighbor) || neighbor.isWall) continue;

      const tentativeGScore = currentNode.g + 1;
      if (tentativeGScore < neighbor.g) {
        neighbor.previousNode = currentNode;
        neighbor.g = tentativeGScore;
        neighbor.h = heuristic(neighbor, finishNode);
        neighbor.f = neighbor.g + neighbor.h;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return [];
}

function heuristic(nodeA, nodeB) {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

function getNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors;
}

function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}

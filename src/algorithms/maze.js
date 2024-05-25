// maze.js
export function generateMaze(
  grid,
  startNodeRow,
  startNodeCol,
  finishNodeRow,
  finishNodeCol
) {
  const newGrid = grid.slice();
  const rows = newGrid.length;
  const cols = newGrid[0].length;

  // Clear the grid first
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!newGrid[row][col].isStart && !newGrid[row][col].isFinish) {
        newGrid[row][col].isWall = false;
      }
    }
  }

  // Place walls randomly
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (
        Math.random() < 0.3 &&
        !newGrid[row][col].isStart &&
        !newGrid[row][col].isFinish
      ) {
        newGrid[row][col].isWall = true;
      }
    }
  }

  // Ensure there's a path from start to finish
  const stack = [];
  const visited = new Set();
  const startNode = newGrid[startNodeRow][startNodeCol];
  const finishNode = newGrid[finishNodeRow][finishNodeCol];

  stack.push(startNode);
  visited.add(`${startNode.row}-${startNode.col}`);

  while (stack.length) {
    const currentNode = stack.pop();
    const neighbors = getUnvisitedNeighbors(currentNode, newGrid, visited);

    for (const neighbor of neighbors) {
      if (neighbor === finishNode) return newGrid; // Path found
      if (!neighbor.isWall) {
        stack.push(neighbor);
        visited.add(`${neighbor.row}-${neighbor.col}`);
      }
    }
  }

  return newGrid;
}

function getUnvisitedNeighbors(node, grid, visited) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(
    (neighbor) => !visited.has(`${neighbor.row}-${neighbor.col}`)
  );
}

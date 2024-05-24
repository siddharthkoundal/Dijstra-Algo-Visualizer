export function generateMaze(grid) {
  const newGrid = grid.slice();
  for (let row = 0; row < newGrid.length; row++) {
    for (let col = 0; col < newGrid[0].length; col++) {
      if (
        Math.random() < 0.3 &&
        !newGrid[row][col].isStart &&
        !newGrid[row][col].isFinish
      ) {
        newGrid[row][col].isWall = true;
      }
    }
  }
  return newGrid;
}

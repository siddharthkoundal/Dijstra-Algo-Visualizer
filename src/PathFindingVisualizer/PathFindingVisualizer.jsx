import React, { Component } from "react";
import Node from "./Node/Node";
import Navbar from "../Components/Navbar";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import { bfs } from "../algorithms/bfs";
import { dfs } from "../algorithms/dfs";
import { generateMaze } from "../algorithms/maze";
import "./PathFindingVisualizer.css";

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: false,
    isFinish: false,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

export default class PathFindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      selectingStart: false,
      selectingEnd: false,
      startNode: null,
      finishNode: null,
      selectedAlgorithm: "dijkstra",
      performanceMetrics: {
        visitedNodes: 0,
        shortestPathNodes: 0, // New state for shortest path nodes
        timeTaken: 0,
      },
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    if (this.state.selectingStart) {
      this.setStartNode(row, col);
    } else if (this.state.selectingEnd) {
      this.setEndNode(row, col);
    } else {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  setStartNode(row, col) {
    const newGrid = this.state.grid.slice();
    if (this.state.startNode) {
      newGrid[this.state.startNode.row][
        this.state.startNode.col
      ].isStart = false;
    }
    newGrid[row][col].isStart = true;
    this.setState({
      grid: newGrid,
      startNode: { row, col },
      selectingStart: false,
    });
  }

  setEndNode(row, col) {
    const newGrid = this.state.grid.slice();
    if (this.state.finishNode) {
      newGrid[this.state.finishNode.row][
        this.state.finishNode.col
      ].isFinish = false;
    }
    newGrid[row][col].isFinish = true;
    this.setState({
      grid: newGrid,
      finishNode: { row, col },
      selectingEnd: false,
    });
  }

  resetBoard() {
    const grid = getInitialGrid();
    this.setState({
      grid,
      startNode: null,
      finishNode: null,
      selectedAlgorithm: "dijkstra",
      performanceMetrics: {
        visitedNodes: 0,
        timeTaken: 0,
        shortestPathNodes: 0,
      },
    });

    // Reset the DOM elements for nodes
    grid.forEach((row) => {
      row.forEach((node) => {
        const nodeElement = document.getElementById(
          `node-${node.row}-${node.col}`
        );
        if (nodeElement) {
          nodeElement.className = "node";
        }
      });
    });
  }

  visualizeAlgorithm() {
    const { grid, startNode, finishNode, selectedAlgorithm } = this.state;
    if (!startNode || !finishNode) {
      alert("Please select a start and end node!");
      return;
    }
    const start = grid[startNode.row][startNode.col];
    const finish = grid[finishNode.row][finishNode.col];
    let visitedNodesInOrder, nodesInShortestPathOrder;
    const startTime = performance.now();

    switch (selectedAlgorithm) {
      case "dijkstra":
        visitedNodesInOrder = dijkstra(grid, start, finish);
        nodesInShortestPathOrder = getNodesInShortestPathOrder(finish);
        break;
      case "bfs":
        visitedNodesInOrder = bfs(grid, start, finish);
        nodesInShortestPathOrder = getNodesInShortestPathOrder(finish);
        break;
      case "dfs":
        const result = dfs(grid, start, finish);
        visitedNodesInOrder = result.visitedNodesInOrder;
        nodesInShortestPathOrder = result.shortestPath;
        break;
      default:
        break;
    }

    const endTime = performance.now();
    const timeTaken = endTime - startTime;

    this.setState({
      performanceMetrics: {
        visitedNodes: visitedNodesInOrder.length,
        timeTaken: timeTaken.toFixed(2),
      },
    });

    this.animateAlgorithm(
      visitedNodesInOrder,
      nodesInShortestPathOrder,
      startTime
    );
  }

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder, startTime) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder, startTime);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";

        const currentTime = performance.now();
        const timeTaken = (currentTime - startTime).toFixed(2);

        this.setState((prevState) => ({
          performanceMetrics: {
            visitedNodes: i + 1,
            timeTaken,
          },
        }));
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder, startTime) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";

        const currentTime = performance.now();
        const timeTaken = (currentTime - startTime).toFixed(2);

        this.setState((prevState) => ({
          performanceMetrics: {
            ...prevState.performanceMetrics,
            timeTaken,
            shortestPathNodes: i + 1, // Update the shortest path nodes count
          },
        }));
      }, 50 * i);
    }

    // Reset the start and end node colors after visualization
    setTimeout(() => {
      const { startNode, finishNode } = this.state;

      if (startNode) {
        document.getElementById(
          `node-${startNode.row}-${startNode.col}`
        ).className = "node node-start";
      }

      if (finishNode) {
        document.getElementById(
          `node-${finishNode.row}-${finishNode.col}`
        ).className = "node node-finish";
      }
    }, nodesInShortestPathOrder.length * 50 + 50);
  }

  handleAlgorithmChange(event) {
    this.setState({ selectedAlgorithm: event.target.value });
  }

  generateMaze() {
    const { grid, startNode, finishNode } = this.state;

    if (!startNode || !finishNode) {
      alert("Please select a start and end node before generating a maze!");
      return;
    }

    const newGrid = generateMaze(
      grid,
      startNode.row,
      startNode.col,
      finishNode.row,
      finishNode.col
    );

    this.setState({ grid: newGrid });
  }

  render() {
    const {
      grid,
      mouseIsPressed,
      selectingStart,
      selectingEnd,
      performanceMetrics,
      selectedAlgorithm,
    } = this.state;

    return (
      <>
        <div className="container">
          <Navbar
            onVisualize={() => this.visualizeAlgorithm()}
            onGenerateMaze={() => this.generateMaze()}
            onResetBoard={() => this.resetBoard()}
            selectingStart={selectingStart}
            selectingEnd={selectingEnd}
            onSelectStart={() => this.setState({ selectingStart: true })}
            onSelectEnd={() => this.setState({ selectingEnd: true })}
            onAlgorithmChange={(e) => this.handleAlgorithmChange(e)}
            selectedAlgorithm={selectedAlgorithm}
          />
          <div className="performance-metrics">
            <div>
              <span>{performanceMetrics.visitedNodes}</span>
              Visited Nodes
            </div>
            <div>
              <span>{performanceMetrics.shortestPathNodes}</span>
              Shortest Path Nodes
            </div>
            <div>
              <span>{performanceMetrics.timeTaken} ms</span>
              Time Taken
            </div>
          </div>
          <div className="legend">
            <div className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: "#43a047" }}
              ></div>
              <span className="legend-label">Start Node</span>
            </div>
            <div className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: "#e53935" }}
              ></div>
              <span className="legend-label">End Node</span>
            </div>
            <div className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: "#32012f" }}
              ></div>
              <span className="legend-label">Wall Node</span>
            </div>
            <div className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: "rgba(0, 190, 218, 0.75)" }}
              ></div>
              <span className="legend-label">Visited Node</span>
            </div>
            <div className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: "#ffeb3b" }}
              ></div>
              <span className="legend-label">Shortest Path Node</span>
            </div>
          </div>
          <div className="grid">
            {grid.map((row, rowIdx) => {
              return (
                <div key={rowIdx} className="grid-row">
                  {row.map((node, nodeIdx) => {
                    const { row, col, isFinish, isStart, isWall } = node;
                    return (
                      <Node
                        key={nodeIdx}
                        col={col}
                        isFinish={isFinish}
                        isStart={isStart}
                        isWall={isWall}
                        mouseIsPressed={mouseIsPressed}
                        onMouseDown={(row, col) =>
                          this.handleMouseDown(row, col)
                        }
                        onMouseEnter={(row, col) =>
                          this.handleMouseEnter(row, col)
                        }
                        onMouseUp={() => this.handleMouseUp()}
                        row={row}
                      ></Node>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <footer className="footer">Made with ♥ by Siddharth Koundal</footer>
        </div>
      </>
    );
  }
}

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

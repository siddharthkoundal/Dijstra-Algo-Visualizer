// PathFindingVisualizer.jsx
import React, { Component } from "react";
import Node from "./Node/Node";
import Navbar from "../Components/Navbar";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import { bfs } from "../algorithms/bfs";
import { dfs } from "../algorithms/dfs";
import { generateMaze } from "../algorithms/maze";
import "./PathFindingVisualizer.css";

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

const ANIMATION_SPEED = 10; // milliseconds
export default class PathFindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      selectingStart: false,
      selectingEnd: false,
      startNode: { row: START_NODE_ROW, col: START_NODE_COL },
      finishNode: { row: FINISH_NODE_ROW, col: FINISH_NODE_COL },
    };
  }

  componentDidMount() {
    const grid = getInitialGrid(this.state.startNode, this.state.finishNode);
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    if (this.state.selectingStart) {
      this.setState({
        startNode: { row, col },
        selectingStart: false,
      });
    } else if (this.state.selectingEnd) {
      this.setState({
        finishNode: { row, col },
        selectingEnd: false,
      });
    } else {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  }

  handleMouseEnter(row, col) {
    if (
      !this.state.mouseIsPressed ||
      this.state.selectingStart ||
      this.state.selectingEnd
    )
      return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, ANIMATION_SPEED * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, ANIMATION_SPEED * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, ANIMATION_SPEED * i);
    }
  }

  animateBFS(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, ANIMATION_SPEED * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, ANIMATION_SPEED * i);
    }
  }

  animateDFS(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, ANIMATION_SPEED * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, ANIMATION_SPEED * i);
    }
  }

  visualizeAlgorithm(algorithm) {
    const { grid, startNode, finishNode } = this.state;
    const start = grid[startNode.row][startNode.col];
    const finish = grid[finishNode.row][finishNode.col];
    let visitedNodesInOrder, nodesInShortestPathOrder;

    switch (algorithm) {
      case "dijkstra":
        visitedNodesInOrder = dijkstra(grid, start, finish);
        nodesInShortestPathOrder = getNodesInShortestPathOrder(finish);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
        break;
      case "bfs":
        visitedNodesInOrder = bfs(grid, start, finish);
        nodesInShortestPathOrder = getNodesInShortestPathOrder(finish);
        this.animateBFS(visitedNodesInOrder, nodesInShortestPathOrder);
        break;
      case "dfs":
        visitedNodesInOrder = dfs(grid, start, finish);
        nodesInShortestPathOrder = getNodesInShortestPathOrder(finish);
        this.animateDFS(visitedNodesInOrder, nodesInShortestPathOrder);
        break;
      default:
        break;
    }
  }

  generateMaze() {
    const { grid } = this.state;
    const newGrid = generateMaze(
      grid,
      this.state.startNode.row,
      this.state.startNode.col,
      this.state.finishNode.row,
      this.state.finishNode.col
    );
    this.setState({ grid: newGrid });
  }

  resetBoard() {
    const grid = getInitialGrid(this.state.startNode, this.state.finishNode);
    grid.forEach((row) => {
      row.forEach((node) => {
        const nodeElement = document.getElementById(
          `node-${node.row}-${node.col}`
        );
        if (node.isStart) {
          nodeElement.className = "node node-start";
        } else if (node.isFinish) {
          nodeElement.className = "node node-finish";
        } else {
          nodeElement.className = "node";
        }
      });
    });
    this.setState({ grid });
  }

  setSelectingStart = () => {
    this.setState({ selectingStart: true, selectingEnd: false });
  };

  setSelectingEnd = () => {
    this.setState({ selectingEnd: true, selectingStart: false });
  };

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <div className="container">
        <Navbar
          onVisualize={(algorithm) => this.visualizeAlgorithm(algorithm)}
          onGenerateMaze={() => this.generateMaze()}
          onReset={() => this.resetBoard()}
          onSetStart={() => this.setSelectingStart()}
          onSetEnd={() => this.setSelectingEnd()}
        />
        <div className="grid">
          {grid.map((row, rowIdx) => (
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
                    onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                    onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                    onMouseUp={() => this.handleMouseUp()}
                    row={row}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const getInitialGrid = (startNode, finishNode) => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row, startNode, finishNode));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row, startNode, finishNode) => {
  return {
    col,
    row,
    isStart: row === startNode.row && col === startNode.col,
    isFinish: row === finishNode.row && col === finishNode.col,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

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

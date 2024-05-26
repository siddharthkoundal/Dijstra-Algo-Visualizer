import React from "react";
import "./Navbar.css";

export default function Navbar({
  onVisualize,
  onGenerateMaze,
  onResetBoard,
  selectingStart,
  selectingEnd,
  onSelectStart,
  onSelectEnd,
  onAlgorithmChange,
  selectedAlgorithm,
}) {
  return (
    <div className="navbar">
      <div className="navbar-title">Algorithm Visualizer</div>
      <div className="navbar-controls">
        <select
          className="navbar-select"
          value={selectedAlgorithm}
          onChange={onAlgorithmChange}
        >
          <option value="dijkstra">Dijkstra's Algorithm</option>
          <option value="bfs">BFS</option>
          <option value="dfs">DFS</option>
        </select>
        <button className="navbar-button" onClick={onVisualize}>
          Visualize
        </button>
        <button
          className={`navbar-button ${selectingStart ? "selecting" : ""}`}
          onClick={onSelectStart}
        >
          {selectingStart
            ? "Select Start Node (Click on Grid)"
            : "Select Start Node"}
        </button>
        <button
          className={`navbar-button ${selectingEnd ? "selecting" : ""}`}
          onClick={onSelectEnd}
        >
          {selectingEnd ? "Select End Node (Click on Grid)" : "Select End Node"}
        </button>
        <button className="navbar-button" onClick={onGenerateMaze}>
          Generate Maze
        </button>
        <button className="navbar-button" onClick={onResetBoard}>
          Reset Board
        </button>
      </div>
    </div>
  );
}

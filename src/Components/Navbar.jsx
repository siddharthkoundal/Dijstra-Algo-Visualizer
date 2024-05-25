// Navbar.jsx
import React, { useState } from "react";
import "./Navbar.css";

const Navbar = ({ onVisualize, onGenerateMaze, onReset }) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("dijkstra");

  const handleSelectChange = (event) => {
    setSelectedAlgorithm(event.target.value);
  };

  return (
    <nav className="navbar">
      <div className="navbar-title">Algorithm Visualizer</div>
      <div className="navbar-controls">
        <select
          className="navbar-select"
          value={selectedAlgorithm}
          onChange={handleSelectChange}
        >
          <option value="dijkstra">Dijkstra's Algorithm</option>
          <option value="bfs">Breadth-First Search</option>
          <option value="dfs">Depth-First Search</option>
        </select>
        <button
          className="navbar-button"
          onClick={() => onVisualize(selectedAlgorithm)}
        >
          Visualize
        </button>
        <button className="navbar-button" onClick={onGenerateMaze}>
          Generate Maze
        </button>
        <button className="navbar-button" onClick={onReset}>
          Reset
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./HardwareAssets.css"; 

const HardwareAssets = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("ALL");

  // Fetch data from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/hardware-assets")
      .then((res) => res.json())
      .then((data) => setAssets(data))
      .catch((err) => console.error("Error fetching assets:", err));
  }, []);

  // Filter assets based on search term & category filter
  const filteredAssets = assets.filter((asset) => {
    return (
      (filter === "ALL" || asset.status?.toLowerCase() === filter.toLowerCase()) &&
      asset.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="hardware-assets-container">
      <Sidebar />

      <div className="hardware-assets-content">
        {/* Top Bar */}
        <div className="top-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />

          <h3>HARDWARE ASSETS</h3>
          <button className="add-asset-btn" onClick={() => navigate("/add-asset")}>
            ➕ Add New
          </button>
        </div>

        {/* Filter Buttons */}
       <div className="filter-container">
        <div className="filter-buttons">
          {["ALL", "STATUS", "ASSIGNED", "UNASSIGNED", "HISTORY", "DISPOSED", "WARRANTY", "LOCATION", "PROJECT", "RETAILER"].map((category) => (
            <button
              key={category}
              className={filter === category ? "active" : ""}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
       </div>

        {/* Asset Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Asset Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Location</th>
                <th>Warranty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr key={asset.id}>
                  <td>{asset.name}</td>
                  <td>{asset.category}</td>
                  <td>{asset.status}</td>
                  <td>{asset.location}</td>
                  <td>{asset.warranty}</td>
                  <td>
                    <button className="edit-btn">✏️</button>
                    <button className="history-btn">🔄</button>
                    <button className="delete-btn">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HardwareAssets;

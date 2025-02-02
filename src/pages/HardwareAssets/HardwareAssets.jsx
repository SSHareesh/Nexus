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
    fetch("http://localhost:5000/api/assets")
      .then((res) => res.json())
      .then((data) => setAssets(data)) // Assuming the API returns an array of assets
      .catch((err) => console.error("Error fetching assets:", err));
  }, []);

  // Map filters to asset properties for sorting
  const filterMapping = {
    ALL: null,
    ASSIGNED: "status",
    UNASSIGNED: "status",
    HISTORY: "status",
    DISPOSED: "status",
    LOCATION: "location",
    PROJECT: "project",
    RETAILER: "retailer"
  };

  // Filter and sort assets
  const filteredAssets = assets
    .filter((asset) => {
      if (filter === "ASSIGNED") return asset.status?.toLowerCase() === "assigned";
      if (filter === "UNASSIGNED") return asset.status?.toLowerCase() === "unassigned";
      if (filter === "HISTORY") return asset.status?.toLowerCase() === "history";
      if (filter === "DISPOSED") return asset.status?.toLowerCase() === "disposed";
      return true; // For ALL or other filters
    })
    .sort((a, b) => {
      const key = filterMapping[filter];
      if (key && a[key] && b[key]) {
        return a[key].toString().localeCompare(b[key].toString());
      }
      return 0;
    })
    .filter((asset) => {
      // Apply search term filter
      return (
        asset.assetid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.productid?.toLowerCase().includes(searchTerm.toLowerCase())
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
            {["ALL", "ASSIGNED", "UNASSIGNED", "HISTORY", "DISPOSED", "LOCATION", "RETAILER"].map((category) => (
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
                <th>Asset ID</th>
                <th>Asset Type</th>
                <th>Make</th>
                <th>Retailer</th>
                <th>Assigned User</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr key={asset.assetid}>
                  <td>{asset.assetid}</td>
                  <td>{asset.assettype}</td>
                  <td>{asset.make}</td>
                  <td>{asset.retailer}</td>
                  <td>{asset.assigneduser}</td>
                  <td>{asset.location}</td>
                  <td>{asset.status}</td>
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

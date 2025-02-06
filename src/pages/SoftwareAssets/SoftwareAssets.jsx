import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./SoftwareAssets.css";

const SoftwareAssets = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "ALL", direction: "asc" });

  useEffect(() => {
    fetch("http://localhost:5000/api/software")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data); // Debug API data
        setAssets(data);
      })
      .catch((err) => console.error("Error fetching assets:", err));
  }, []);
  // Function to handle sorting when a filter button is clicked
  const handleSort = (key) => {
    let direction = "asc";

    // Toggle direction if the same key is clicked again
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    
    setSortConfig({ key, direction });
  };

  // Apply search and sort
  const filteredAndSortedAssets = assets
    .filter((asset) => {
      const matchesSearchTerm =
        (typeof asset.softwarename === 'string' && asset.softwarename.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (typeof asset.assetid === 'string' && asset.assetid.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (typeof asset.licensetype === 'string' && asset.licensetype.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (typeof asset.softwareid === 'string' && asset.softwareid.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (typeof asset.assigneduserid === 'string' && asset.assigneduserid.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (typeof asset.project === 'string' && asset.project.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesSearchTerm;
    })
    .sort((a, b) => {
      if (sortConfig.key === "ALL") return 0; // No sorting if "ALL" is selected

      const key = sortConfig.key.toLowerCase().replace(" ", "");

      // Handle undefined or null values
      const aValue = a[key] ? a[key].toString().toLowerCase() : "";
      const bValue = b[key] ? b[key].toString().toLowerCase() : "";

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

  return (
    <div className="software-assets-container">
      <Sidebar />

      <div className="software-assets-content">
        <div className="top-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
          <h3>SOFTWARE ASSETS</h3>
          <button className="add-asset-btn" onClick={() => navigate("/AddSoftwareAssets")}>
            ➕ Add New
          </button>
        </div>

        <div className="filter-container">
          <div className="filter-buttons">
            {["ALL", "Software Name", "License Type", "Project", "Assigned User Id"].map((category) => (
              <button
                key={category}
                className={sortConfig.key === category ? "active" : ""}
                onClick={() => handleSort(category)}
              >
                {category}
                {sortConfig.key === category ? (sortConfig.direction === "asc") : ""}
              </button>
            ))}
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Software Id</th>
                <th>Software Name</th>
                <th>Asset Id</th>
                <th>License Type</th>
                <th>Assigned User Id</th>
                <th>Project</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedAssets.map((asset) => (
                <tr key={asset.softwareid || asset.assetid}>
                  <td>{asset.softwareid || "N/A"}</td>
                  <td>{asset.softwarename || "N/A"}</td>
                  <td>{asset.assetid || "N/A"}</td>
                  <td>{asset.licensetype || "N/A"}</td>
                  <td>{asset.assigneduserid || "N/A"}</td>
                  <td>{asset.project || "N/A"}</td>
                  <td>
                    <button className="edit-btn">✏️</button>
                    <button className="view-more">▶️</button>
                    <button className="history-btn">🔄</button>
                    <button className="delete-btn" onClick={() => openDeleteDialog(asset.softwareid)}>🗑️</button> 
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

export default SoftwareAssets;

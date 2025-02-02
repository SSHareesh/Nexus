import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./SoftwareAssets.css"; 

const SoftwareAssets = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetch("http://localhost:5000/api/software")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);  // Debug API data
        setAssets(data);
      })
      .catch((err) => console.error("Error fetching assets:", err));
  }, []);

  const filteredAssets = assets.filter((asset) => {
    return (
      (filter === "ALL" || asset.userstatus?.toLowerCase() === filter.toLowerCase()) &&
      asset.softwarename?.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
          <button className="add-asset-btn" onClick={() => navigate("/add-asset")}>
            ➕ Add New
          </button>
        </div>

        <div className="filter-container">
          <div className="filter-buttons">
            {["ALL", "NAME", "LICENSE TYPE", "ASSIGNED PROJECT", "ASSIGNED USER"].map((category) => (
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
              {filteredAssets.map((asset) => (
                <tr key={asset.softwareid || asset.assetid}>
                  <td>{asset.softwareid}</td>
                  <td>{asset.softwarename}</td>
                  <td>{asset.assetid}</td>
                  <td>{asset.licensetype}</td>
                  <td>{asset.assigneduserid}</td>
                  <td>{asset.project}</td>
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

export default SoftwareAssets;

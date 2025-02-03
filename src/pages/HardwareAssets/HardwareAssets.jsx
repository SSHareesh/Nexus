import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./HardwareAssets.css";

const HardwareAssets = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("ALL");
  
  // Fix: Add states for dialog and asset deletion
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [assetIdToDelete, setAssetIdToDelete] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/assets")
      .then((res) => res.json())
      .then((data) => setAssets(data))
      .catch((err) => console.error("Error fetching assets:", err));
  }, []);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/assets/${assetIdToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete asset with ID: ${assetIdToDelete}`);
      }

      // Remove the deleted asset from the list
      setAssets((prevAssets) => prevAssets.filter((asset) => asset.assetid !== assetIdToDelete));
      setDialogOpen(false);
      alert('Asset deleted successfully!');
    } catch (error) {
      console.error("Error deleting asset:", error);
      alert(error.message);
    }
  };

  const openDeleteDialog = (id) => {
    setAssetIdToDelete(id);
    setDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDialogOpen(false);
    setAssetIdToDelete(null);
  };

  const filterMapping = {
    ALL: null,
    ASSIGNED: "status",
    UNASSIGNED: "status",
    TYPE: "assettype",
    DISPOSED: "status",
    LOCATION: "location",
    PROJECT: "project",
    RETAILER: "retailer"
  };

  const filteredAssets = assets
  .filter((asset) => {
    if (filter === "ASSIGNED") return asset.status?.toLowerCase() === "assigned";
    if (filter === "UNASSIGNED") return asset.status?.toLowerCase() === "unassigned";
    if (filter === "DISPOSED") return asset.status?.toLowerCase() === "disposed";
    return true; // For ALL, TYPE, LOCATION, RETAILER, etc.
  })
  .sort((a, b) => {
    const key = filterMapping[filter];
    if (key && a[key] && b[key]) {
      return a[key].toString().localeCompare(b[key].toString());
    }
    return 0; // No sorting if key is null (like for ALL)
  })
  .filter((asset) => {
    return (
      asset.assetid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.retailer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assigneduser?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="hardware-assets-container">
      <Sidebar />

      <div className="hardware-assets-content">
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

        <div className="filter-container">
          <div className="filter-buttons">
            {["ALL", "ASSIGNED", "UNASSIGNED", "TYPE", "DISPOSED", "LOCATION", "RETAILER"].map((category) => (
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
                    <button className="view-more">▶️</button>
                    <button className="edit-btn">✏️</button>
                    <button className="history-btn">🔄</button>
                    <button className="delete-btn" onClick={() => openDeleteDialog(asset.assetid)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isDialogOpen && (
        <div className="confirmation-dialog">
          <div className="dialog-content">
            <h3>Are you sure you want to dispose of this asset?</h3>
            <p>Asset ID: {assetIdToDelete}</p>
            <button className="y1" onClick={handleDelete}>Yes</button>
            <button className="y1" onClick={closeDeleteDialog}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HardwareAssets;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./HardwareAssets.css";

const HardwareAssets = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("ALL");

  const [availableSubFilter, setAvailableSubFilter] = useState("INSTOCK"); // Default to 'INSTOCK'

  
  // Dialog and disposal form state
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [assetIdToDelete, setAssetIdToDelete] = useState(null);
  const [isDisposalFormOpen, setDisposalFormOpen] = useState(false);
  const [disposalData, setDisposalData] = useState({
    repaired_on: "",
    disposaldate: "",
    reason: ""
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/assets")
      .then((res) => res.json())
      .then((data) => setAssets(data))
      .catch((err) => console.error("Error fetching assets:", err));
  }, []);

  const handleDelete = async () => {
    setDialogOpen(false); // Close the confirmation dialog

    // Open the disposal form
    setDisposalFormOpen(true);
  };

  const handleDispose = async () => {
    // Prepare data for disposal
    const { repaired_on, disposaldate, reason } = disposalData;

    try {
      const response = await fetch("http://localhost:5000/api/disposal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assetid: assetIdToDelete,
          repaired_on,
          disposaldate,
          reason
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to insert into disposal table");
      }

      // Now, call the delete API
      await fetch(`http://localhost:5000/api/assets/${assetIdToDelete}`, {
        method: 'DELETE',
      });

      // Remove the asset from the UI list after successful deletion
      setAssets((prevAssets) => prevAssets.filter((asset) => asset.assetid !== assetIdToDelete));

      // Close the disposal form
      setDisposalFormOpen(false);
      alert('Asset disposed and deleted successfully!');
    } catch (error) {
      console.error("Error disposing asset:", error);
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

  const closeDisposalForm = () => {
    setDisposalFormOpen(false);
    setAssetIdToDelete(null);
    setDisposalData({ repaired_on: "", disposaldate: "", reason: "" });
  };

  const handleDisposalDataChange = (e) => {
    const { name, value } = e.target;
    setDisposalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const filterMapping = {
    ALL: null,
    ASSIGNED: "status",
    AVAILABLE: "status", // Renamed from UNASSIGNED
    TYPE: "assettype",
    DISPOSED: "status",
    LOCATION: "location",
    PROJECT: "project",
    RETAILER: "retailer"
  };

  const filteredAssets = assets
    .filter((asset) => {
      if (filter === "ASSIGNED") return asset.status?.toLowerCase() === "assigned";
      if (filter === "DISPOSED") return asset.status?.toLowerCase() === "disposed";
      if (filter === "AVAILABLE") {
        if (availableSubFilter === "INSTOCK") return asset.status?.toLowerCase() === "instock";
        if (availableSubFilter === "UNASSIGNED") return asset.status?.toLowerCase() === "unassigned";
      }
      return true;
    })
    .sort((a, b) => {
      const key = filterMapping[filter];
      if (key && a[key] && b[key]) {
        return a[key].toString().localeCompare(b[key].toString());
      }
      return 0;
    })
    .filter((asset) => {
      return (
        asset.assetid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.retailer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.assigneduserid?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <button className="add-asset-btn" onClick={() => navigate("/AddHardwareAsset")}>
            ➕ Add New
          </button>
        </div>

        <div className="filter-container">
          <div className="filter-buttons">
            {["ALL", "ASSIGNED", "AVAILABLE", "TYPE", "DISPOSED", "LOCATION", "RETAILER"].map((category) => (
              <button
                key={category}
                className={filter === category ? "active" : ""}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {filter === "AVAILABLE" && (
  <div className="sub-filter-container">
    <button
      className={`sub-filter-btn ${availableSubFilter === "INSTOCK" ? "active" : ""}`}
      onClick={() => setAvailableSubFilter("INSTOCK")}
    >
      In Stock
    </button>
    <button
      className={`sub-filter-btn ${availableSubFilter === "UNASSIGNED" ? "active" : ""}`}
      onClick={() => setAvailableSubFilter("UNASSIGNED")}
    >
      Unassigned
    </button>
  </div>
)}

        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Asset Type</th>
                <th>Make</th>
                <th>Retailer</th>
                <th>Assigned User ID</th>
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
                  <td>{asset.assigneduserid}</td>
                  <td>{asset.location}</td>
                  <td>{asset.status}</td>
                  <td>
                    <button className="edit-btn" onClick={() => navigate(`/edit-hardware/${asset.assetid}`)}>✏️</button>
                    <button className="view-more" onClick={() => navigate(`/edit-hardware/${asset.assetid}`)}>▶️</button>
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
            <h3>Are you sure you want to dispose this asset?</h3>
            <p>Asset ID: {assetIdToDelete}</p>
            <button className="y1" onClick={handleDelete}>Yes</button>
            <button className="y1" onClick={closeDeleteDialog}>No</button>
          </div>
        </div>
      )}

      {isDisposalFormOpen && (
        <div className="disposal-form-popup">
          <div className="form-content">
            <h3>Disposal Form</h3>
            <p>Asset ID: {assetIdToDelete}</p>
            <form>
              <input
                type="date"
                name="repaired_on"
                value={disposalData.repaired_on}
                onChange={handleDisposalDataChange}
                placeholder="Repaired On"
              />
              <input
                type="date"
                name="disposaldate"
                value={disposalData.disposaldate}
                onChange={handleDisposalDataChange}
                placeholder="Disposal Date"
              />
              <textarea
                name="reason"
                value={disposalData.reason}
                onChange={handleDisposalDataChange}
                placeholder="Reason for Disposal"
              />
            </form>
            <button onClick={handleDispose}>Confirm</button>
            <button onClick={closeDisposalForm}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HardwareAssets;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./AddHardwareAsset.css";

const AddHardwareAsset = () => {
  const navigate = useNavigate();
  const [asset, setAsset] = useState({
    assetid: "",
    assettype: "",
    make: "",
    productid: "",
    purchasedate: "",
    retailer: "",
    warrantyexpiry: "",
    assigneduserid: "",
    location: "",
    status: "",
    lastcheckoutdate: "",
    size: "",
    operatingsystem: "",
    typeofos: "",
    productkey: "",
    processor: "",
    ram: "",
    harddisktype: "",
    harddisksize: "",
    harddiskmodel: "",
    resolution: "",
    graphicscardmodel: "",
    externaldongledetails: ""
  });

  const handleChange = (e) => {
    setAsset({ ...asset, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting asset with data:", asset);  // Log the asset data

    // Check if assetid is provided
    if (!asset.assetid) {
      alert("Asset ID is required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(asset),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Asset added successfully!");
        navigate("/HardwareAssets");
      } else {
        alert(`Failed to add asset: ${result.message}`);
      }
    } catch (err) {
      console.error("Error adding asset:", err);
      alert("Error adding asset.");
    }
  };

  return (
    <div className="edit-hardware-container">
      <FaArrowLeft className="back-icon" onClick={() => navigate("/HardwareAssets")} />
      <h2>Add New Hardware Asset</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        {Object.entries(asset).map(([key, value]) => (
          <div key={key} className="form-group">
            <label>{key.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase()}:</label>
            <input
              type="text"
              name={key}
              value={value}
              onChange={handleChange}
              required={key === "assetid"} // Make Asset ID mandatory
            />
          </div>
        ))}

        <div className="button-group">
          <button type="submit">Add Asset</button>
        </div>
      </form>
    </div>
  );
};

export default AddHardwareAsset;

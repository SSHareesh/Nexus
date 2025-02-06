import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./AddSoftwareAssets.css";

const AddSoftwareAssets = () => {
  const navigate = useNavigate();
  const [asset, setAsset] = useState({
        softwareid: "",
        softwarename: "",
        softwareversion: "",
        purchasedate: "",
        assetid: "",
        licensetype: "",
        licenseexpirydate: "",
        assigneduserid: "",
        project: "",
        userstatus: "",
        vendor: "",
        licensepurchasedate: "",
        licensekey: "",
        serialnumber: "",
        licenseduration: "",
        licensecost: "",
        username: "",
        password: "",
        expiredstatus: "",
        renewaldate: "",
        renewalcost: "",
        comments: "",
  });

  const handleChange = (e) => {
    setAsset({ ...asset, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting asset with data:", asset);  // Log the asset data

    // Check if assetid is provided
    if (!asset.softwareid) {
      alert("Software ID is required!");
      return;
    }

    const sanitizedAsset = Object.fromEntries(
        Object.entries(asset).map(([key, value]) => [key, value === "" ? null : value])
    );

    try {
      const response = await fetch("http://localhost:5000/api/software", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedAsset),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Asset added successfully!");
        navigate("/SoftwareAssets");
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
      <FaArrowLeft className="back-icon" onClick={() => navigate("/SoftwareAssets")} />
      <h2>Add New Software Asset</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        {Object.entries(asset).map(([key, value]) => (
          <div key={key} className="form-group">
            <label>{key.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase()}:</label>
            <input
              type="text"
              name={key}
              value={value}
              onChange={handleChange}
              required={key === "softwareid"} // Make Asset ID mandatory
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

export default AddSoftwareAssets;
 
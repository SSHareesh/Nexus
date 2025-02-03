import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./EditHardwareAsset.css";

const EditHardwareAsset = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [originalAsset, setOriginalAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/assets/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setAsset(data);
        setOriginalAsset(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching asset:", err));
  }, [id]);

  const handleChange = (e) => {
    setAsset({ ...asset, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setAsset(originalAsset);
    setEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/assets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(asset),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Asset updated successfully!");
        navigate("/HardwareAssets");
      } else {
        alert(`Failed to update asset: ${result.message}`);
      }
    } catch (err) {
      console.error("Error updating asset:", err);
      alert("Error updating asset.");
    }
  };

  if (loading) return <p>Loading asset...</p>;

  return (
    <div className="edit-hardware-container">
      <FaArrowLeft className="back-icon" onClick={() => navigate("/HardwareAssets")} />
      <h2>Edit Hardware Asset</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        {Object.entries(asset).map(([key, value]) => (
          <div key={key} className="form-group">
            <label>{key.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase()}:</label>
            <input
              type="text"
              name={key}
              value={value || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
        ))}

        {/* <div className="button-group">
          <button type="button" onClick={() => setEditing(!editing)}>
            {editing ? "Cancel" : "Edit"}
          </button>
          {editing && <button type="button" onClick={handleCancel}>Cancel</button>}
          {editing && <button type="submit">Save</button>}
        </div> */}

<div className="button-group">
  {!editing ? (
    <button type="button" onClick={() => setEditing(true)}>Edit</button>
  ) : (
    <>
      <button type="button" onClick={handleCancel}>Cancel</button>
      <button type="submit">Save</button>
    </>
  )}
</div>


      </form>
    </div>
  );
};

export default EditHardwareAsset;
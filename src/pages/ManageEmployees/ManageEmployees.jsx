import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./ManageEmployees.css"; 

const ManageEmployees = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetch("http://localhost:5000/api/software-assets")
      .then((res) => res.json())
      .then((data) => setEmployee(data))
      .catch((err) => console.error("Error fetching employee data:", err));
  }, []);

  const filteredEmployee = employee.filter((employee) => {
    return (
      (filter === "ALL" || employee.status?.toLowerCase() === filter.toLowerCase()) &&
      employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="manage-employee-container">
      <Sidebar />

      <div className="manage-employee-content">
        <div className="top-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
            <h3>MANAGE EMPLOYEES</h3>
          <button className="add-asset-btn" onClick={() => navigate("/add-employee")}>
            ➕ Add New Employee
          </button>
        </div>

       <div className="filter-container">
        <div className="filter-buttons">
          {["ALL", "STATUS", "PROJECT", "ASSET COUNT", "REQUESTS COUNT"].map((category) => (
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
                <th>Asset Name</th>
                <th>License Type</th>
                <th>Purchase Date</th>    
                <th>Assigned Project</th>
                <th>Expiry Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployee.map((employee) => (
                <tr key={asset.id}>
                  <td>{employee.name}</td>
                  <td>{employee.status}</td>
                  <td>{employee.project}</td>
                  <td>{employee.assetCount}</td>
                  <td>{ employee.requestsCount}</td>
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

export default ManageEmployees;

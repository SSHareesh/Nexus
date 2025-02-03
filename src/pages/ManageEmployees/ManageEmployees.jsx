import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./ManageEmployees.css";

const ManageEmployees = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("ALL");

  // Fetch employee data
  useEffect(() => {
    fetch("http://localhost:5000/api/employee")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched employee data:", data); // Debugging: Log fetched data
        setEmployee(data);
      })
      .catch((err) => console.error("Error fetching employee data:", err));
  }, []);

  // Sorting and filtering employees based on search term and filter
  const filteredEmployee = employee.filter((emp) => {
    // Filter based on search term
    return (
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.project?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sorting employees based on selected filter
  const sortedEmployee = filteredEmployee.sort((a, b) => {
    if (filter === "STATUS") {
      return (a.status || "").localeCompare(b.status || ""); // Sorting by status
    } else if (filter === "PROJECT") {
      return (a.project || "").localeCompare(b.project || ""); // Sorting by project
    } else if (filter === "UID") {
      // Ensure userid is a string before calling localeCompare
      const useridA = String(a.userid || "");
      const useridB = String(b.userid || "");
      return useridA.localeCompare(useridB); // Sorting by UID
    }
    return 0; // No sorting for "ALL"
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
            {["ALL", "STATUS", "PROJECT", "UID"].map((category) => (
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
                <th>User ID</th>
                <th>User Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Employee Type</th>
                <th>Project</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedEmployee.length > 0 ? (
                sortedEmployee.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.userid}</td>
                    <td>{emp.name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.phone}</td>
                    <td>{emp.status}</td>
                    <td>{emp.employee_type}</td>
                    <td>{emp.project}</td>
                    <td>
                      <button className="edit-btn">✏️</button>
                      <button className="history-btn">🔄</button>
                      <button className="delete-btn">🗑️</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No employees found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageEmployees;
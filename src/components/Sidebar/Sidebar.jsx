import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h1>NEXUS</h1>
      </div>
      <div className="sidebar-menu">
      <ul>
        <li><Link to="/Dashboard">Dashboard</Link></li>
        <li><Link to="/HardwareAssets">Hardware Assets</Link></li>
        <li><Link to="/SoftwareAssets">Software Assets</Link></li>
        <li><Link to="/maintenance">Maintenance</Link></li>
        <li><Link to="/ManageEmployees">Manage Employee</Link></li>
        <li><Link to="/audit-logs">Audit Logs</Link></li>
        <li><Link to="/reports">Reports</Link></li>
        <li><Link to="/notifications">Notifications</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
      </div>
    </div>
  );
};

export default Sidebar;

import React from 'react';
import { useState,useEffect } from 'react';
import './Dashboard.css'; 
import axios from "axios";

const Dashboard = () => {
    const [data, setData] = useState({
        totalAssets: '',
        inUse: '',
        maintenance: '',
        inStock: '',
        hardwareAssets: '',
        softwareAssets: '',
        expiringLicenses: '',
        disposed: '',
      });
    
      useEffect(() => {
        
        axios
          .get("http://localhost:5000/api/dashboard-data") 
          .then((response) => {
            setData(response.data);
          })
          .catch((error) => {
            console.error("Error fetching dashboard data:", error);
          });
       }, []);

  return (
    <div className="dashboard">
      <h1>DASHBOARD</h1>
      <div className="dashboard-container">
        <div className="dashboard-box">
        <h3>Total Assets</h3>
          <p>{data.totalAssets}</p>
        </div>
        <div className="dashboard-box">
          <h3>In Use</h3>
          <p>{data.inUse}</p>
        </div>
        <div className="dashboard-box">
          <h3>Maintenance</h3>
          <p>{data.maintenance}</p>
        </div>
        <div className="dashboard-box">
          <h3>In Stock</h3>
          <p>{data.inStock}</p>
        </div>
        <div className="dashboard-box">
          <h3>Hardware Assets</h3>
          <p>{data.hardwareAssets}</p>
        </div>
        <div className="dashboard-box">
          <h3>Software Assets</h3>
          <p>{data.softwareAssets}</p>
        </div>
        <div className="dashboard-box">
          <h3>Expiring Licenses</h3>
          <p>{data.expiringLicenses}</p>
        </div>
        <div className="dashboard-box">
          <h3>Disposed</h3>
          <p>{data.disposed}</p>
        </div>  
      </div>
    </div>
    
  );
};

export default Dashboard;

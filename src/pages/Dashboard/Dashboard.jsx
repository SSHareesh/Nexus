// import React from 'react';
// import { useState,useEffect } from 'react';
// import './Dashboard.css'; 
// import axios from "axios";

// const Dashboard = () => {
//     const [data, setData] = useState({
//         totalAssets: '',
//         inUse: '',
//         maintenance: '',
//         inStock: '',
//         hardwareAssets: '',
//         softwareAssets: '',
//         expiringLicenses: '',
//         disposed: '',
//       });
    
//       useEffect(() => {
        
//         axios
//           .get("http://localhost:5000/api/dashboard-data") 
//           .then((response) => {
//             setData(response.data);
//           })
//           .catch((error) => {
//             console.error("Error fetching dashboard data:", error);
//           });
//        }, []);

//   return (
//     <div className="dashboard">
//       <h1>DASHBOARD</h1>
//       <div className="dashboard-container">
//         <div className="dashboard-box">
//         <h3>Total Assets</h3>
//           <p>{data.totalAssets}</p>
//         </div>
//         <div className="dashboard-box">
//           <h3>In Use</h3>
//           <p>{data.inUse}</p>
//         </div>
//         <div className="dashboard-box">
//           <h3>Maintenance</h3>
//           <p>{data.maintenance}</p>
//         </div>
//         <div className="dashboard-box">
//           <h3>In Stock</h3>
//           <p>{data.inStock}</p>
//         </div>
//         <div className="dashboard-box">
//           <h3>Hardware Assets</h3>
//           <p>{data.hardwareAssets}</p>
//         </div>
//         <div className="dashboard-box">
//           <h3>Software Assets</h3>
//           <p>{data.softwareAssets}</p>
//         </div>
//         <div className="dashboard-box">
//           <h3>Expiring Licenses</h3>
//           <p>{data.expiringLicenses}</p>
//         </div>
//         <div className="dashboard-box">
//           <h3>Disposed</h3>
//           <p>{data.disposed}</p>
//         </div>  
//       </div>
//     </div>
    
//   );
// };

// export default Dashboard;




import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./Dashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();

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

  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = () => {
      axios.get("http://localhost:5000/api/assets/count")
        .then((response) => {
          const totalAssets = Number(response.data.asset_count) + Number(response.data.software_count);
          setData({
            totalAssets,
            hardwareAssets: response.data.asset_count,
            disposed: response.data.disposal_count,
            softwareAssets: response.data.software_count,
            inUse: response.data.usage_count,
            maintenance: response.data.maintenance_count,
            expiringLicenses: response.data.expiry_count,
            inStock: response.data.stock_count
          });
        })
        .catch((error) => console.error("Error fetching dashboard data:", error));
    };

    const fetchChartData = () => {
      axios.get("http://localhost:5000/api/assets")
        .then((response) => {
          const { inUse, maintenance, unassigned, disposed, depreciated } = response.data;

          setChartData({
            labels: ["In Use", "Under Maintenance", "Unassigned", "Disposed", "Depreciated"],
            datasets: [
              {
                data: [inUse, maintenance, unassigned, disposed, depreciated],
                backgroundColor: ["#007bff", "#ffc107", "#17a2b8", "#dc3545", "#6c757d"],
                hoverBackgroundColor: ["#0056b3", "#d39e00", "#138496", "#bd2130", "#5a6268"],
              },
            ],
          });
        })
        .catch((error) => {
          console.error("Error fetching pie chart data:", error);
        });
    };

    fetchDashboardData();  // Initial fetch for dashboard data
    fetchChartData();      // Initial fetch for chart data

    const interval = setInterval(fetchDashboardData, 5000);  // Refresh dashboard data every 5 seconds

    return () => clearInterval(interval);  // Cleanup on unmount
  }, []);

  return (
    <div className="dashboard">
      <h1>DASHBOARD</h1>
      
      {/* Dashboard Stats */}
      <div className="dashboard-container">
        <div className="dashboard-box"><h3>Total Assets</h3><p>{data.totalAssets}</p></div>
        <div className="dashboard-box"><h3>In Use</h3><p>{data.inUse}</p></div>
        <div className="dashboard-box"><h3>Maintenance</h3><p>{data.maintenance}</p></div>
        <div className="dashboard-box"><h3>In Stock</h3><p>{data.inStock}</p></div>
        <div className="dashboard-box"><h3>Hardware Assets</h3><p>{data.hardwareAssets}</p></div>
        <div className="dashboard-box"><h3>Software Assets</h3><p>{data.softwareAssets}</p></div>
        <div className="dashboard-box"><h3>Expiring Licenses</h3><p>{data.expiringLicenses}</p></div>
        <div className="dashboard-box"><h3>Disposed</h3><p>{data.disposed}</p></div>
      </div>

      {/* Quick Actions */}
      <h2>Quick Actions</h2>
      <div className="quick-actions">
        <button className="action-btn" onClick={() => navigate("/add-asset")}>🖥️ Add new Asset</button>
        <button className="action-btn" onClick={() => navigate("/add-license")}>📜 Add new License</button>
        <button className="action-btn" onClick={() => navigate("/maintenance-request")}>⚙️ Maintenance Request</button>
        <button className="action-btn" onClick={() => navigate("/check-in-out")}>🔄 Check in/out</button>
      </div>

      {/* Pie Chart */}
      <h2>Asset by Status Type</h2>
      <div className="chart-container">
        {chartData ? <Pie data={chartData} /> : <p>Loading chart...</p>}
      </div>
    </div>
  );
};

export default Dashboard;

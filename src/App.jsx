import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/login';
import Signup from './pages/signup/signup';
import Dashboard from "./pages/Dashboard/Dashboard";
import HardwareAssets from './pages/HardwareAssets/HardwareAssets';
import SoftwareAssets from './pages/SoftwareAssets/SoftwareAssets';
import ManageEmployees from './pages/ManageEmployees/ManageEmployees';
import Layout from './components/Layout/Layout';
import EditHardwareAsset from "./pages/EditHardwareAsset.js/EditHarrdwareAsset.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />


        <Route path="/Dashboard" element={<Layout> <Dashboard /> </Layout> } />
        <Route path="/HardwareAssets" element={<Layout> <HardwareAssets /> </Layout>} />
        <Route path="/SoftwareAssets" element={<Layout> <SoftwareAssets /> </Layout>} />
        <Route path="/ManageEmployees" element={<Layout> <ManageEmployees /></Layout>} />
        <Route path="/edit-hardware/:id" element={<EditHardwareAsset />} />
        {/* <Route path="/HardwareAssets" element={<HardwareAssets />} />     */}
      </Routes> 
    </Router>
  );
};

export default App;
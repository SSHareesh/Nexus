import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/login';
import Signup from './pages/signup/signup';
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />


        <Route path="/Dashboard" element={<> <Sidebar /><Dashboard /></> } />
        {/* <Route path="/Dashboard" element={<Dashboard />} /> */}    
      </Routes> 
    </Router>
  );
};

export default App;
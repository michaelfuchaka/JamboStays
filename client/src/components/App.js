import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "../pages/Home";
import PropertyDetails from "../pages/PropertyDetails";
import OwnerDashboard from "../pages/OwnerDashboard";
import UserDashboard from "../pages/UserDashboard";

function App() {
  return (
    <Router>
      <Navbar />
     <Routes>
  <Route path="/" element={<Home />} />
  <Route 
    path="/property/:id" 
    element={<div className="container mx-auto p-4"><PropertyDetails /></div>} 
  />
  <Route 
    path="/owner-dashboard" 
    element={<div className="container mx-auto p-4"><OwnerDashboard /></div>} 
  />
  <Route 
    path="/user-dashboard" 
    element={<div className="container mx-auto p-4"><UserDashboard /></div>} 
  />
</Routes>
    </Router>
  );
}

export default App;

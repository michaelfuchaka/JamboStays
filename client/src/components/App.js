import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "../pages/Home";
import PropertyDetails from "../pages/PropertyDetails";
import OwnerDashboard from "../pages/OwnerDashboard";
import AuthPage from "../pages/AuthPage"; // NEW

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/auth" element={<AuthPage />} /> {/* NEW */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

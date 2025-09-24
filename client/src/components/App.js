import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "../pages/Home";
import PropertyDetails from "../pages/PropertyDetails";
import OwnerDashboard from "../pages/OwnerDashboard";
import UserDashboard from "../pages/UserDashboard";
import AuthPage from "../pages/AuthPage"; // ✅ Import AuthPage

function App() {
  return (
    <Router>
      <Navbar />

      {/* ✅ Sign In button at top-right */}
      <div className="absolute top-4 right-6">
        <Link to="/auth">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Sign In
          </button>
        </Link>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/property/:id"
          element={
            <div className="container mx-auto p-4">
              <PropertyDetails />
            </div>
          }
        />
        <Route
          path="/owner-dashboard"
          element={
            <div
              className="container mx-auto p-4"
              style={{ paddingTop: "80px" }}
            >
              <OwnerDashboard />
            </div>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <div
              className="container mx-auto p-4"
              style={{ paddingTop: "80px" }}
            >
              <UserDashboard />
            </div>
          }
        />
        {/* ✅ Auth route */}
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;

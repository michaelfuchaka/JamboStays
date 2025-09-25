

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ADD THIS IMPORT

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  // ADD THESE STATE VARIABLES
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    userType: "guest"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate(); // ADD THIS HOOK

  // ADD THIS FUNCTION - Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  // ADD THIS FUNCTION - Form validation
  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return false;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (!isLogin) {
      if (!formData.name || formData.name.length < 2) {
        setError("Name must be at least 2 characters long");
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
    }

    return true;
  };

  // ADD THIS FUNCTION - Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/api/login" : "/api/register";
      const payload = isLogin 
        ? {
            email: formData.email,
            password: formData.password
          }
        : {
            email: formData.email,
            password: formData.password,
            name: formData.name,
            user_type: formData.userType
          };

      console.log("Making request to:", `http://127.0.0.1:5555${endpoint}`);
      console.log("Payload:", payload);

      // YOUR FLASK APP RUNS ON PORT 5555 - Update this
      const response = await fetch(`http://127.0.0.1:5555${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        // Store token and user data
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Navigate based on user type
        if (data.user.user_type === "owner") {
          navigate("/owner-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (error) {
      console.error("Auth error:", error);
      setError(`Network error: ${error.message}. Please check if the backend server is running on port 5555.`);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f8fafc",
    paddingTop: "60px",
  };

  const cardStyle = {
    background: "white",
    padding: "2.5rem",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  };

  const titleStyle = {
    fontSize: "1.5rem",
    fontWeight: "700",
    marginBottom: "1.5rem",
    color: "#2c3e50",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    marginBottom: "1rem",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "1rem",
    boxSizing: "border-box", // ADD THIS
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.75rem",
    border: "none",
    borderRadius: "8px",
    background: loading ? "#94a3b8" : "#3b82f6", // CHANGE THIS - Show loading state
    color: "white",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: loading ? "not-allowed" : "pointer", // CHANGE THIS
    transition: "all 0.2s ease",
  };

  const linkStyle = {
    marginTop: "1rem",
    color: "#64748b",
    fontSize: "0.9rem",
    cursor: "pointer",
  };

  // ADD THIS STYLE - Error message styling
  const errorStyle = {
    color: "#ef4444",
    fontSize: "0.875rem",
    marginBottom: "1rem",
    padding: "0.5rem",
    background: "#fef2f2",
    borderRadius: "4px",
    border: "1px solid #fecaca",
  };

  // ADD THIS STYLE - Select styling
  const selectStyle = {
    ...inputStyle,
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.7rem center",
    backgroundSize: "1rem",
    paddingRight: "2.5rem",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>{isLogin ? "Sign In" : "Sign Up"}</h2>
        
        {/* ADD THIS - Error display */}
        {error && <div style={errorStyle}>{error}</div>}
        
        {/* CHANGE THIS - Add onSubmit handler */}
        <form onSubmit={handleSubmit}>
          {/* CHANGE THIS - Add name and value props, onChange handler */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            style={inputStyle}
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          
          {/* ADD THIS - Name field for registration */}
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              style={inputStyle}
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          )}
          
          {/* CHANGE THIS - Add name and value props, onChange handler */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            style={inputStyle}
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          
          {/* CHANGE THIS - Add name and value props, onChange handler */}
          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              style={inputStyle}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          )}
          
          {/* ADD THIS - User type selection for registration */}
          {!isLogin && (
            <select
              name="userType"
              style={selectStyle}
              value={formData.userType}
              onChange={handleInputChange}
            >
              <option value="guest">Guest (Book Properties)</option>
              <option value="owner">Owner (List Properties)</option>
            </select>
          )}
          
          {/* CHANGE THIS - Add disabled state */}
          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading 
              ? (isLogin ? "Signing In..." : "Registering...") 
              : (isLogin ? "Login" : "Register")
            }
          </button>
        </form>
        
        <p style={linkStyle} onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
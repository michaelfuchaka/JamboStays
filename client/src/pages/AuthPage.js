import React, { useState } from "react";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f8fafc", // light background like home
    paddingTop: "60px", // offset for navbar
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
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.75rem",
    border: "none",
    borderRadius: "8px",
    background: "#3b82f6",
    color: "white",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  const linkStyle = {
    marginTop: "1rem",
    color: "#64748b",
    fontSize: "0.9rem",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>{isLogin ? "Sign In" : "Sign Up"}</h2>
        <form>
          <input type="email" placeholder="Email Address" style={inputStyle} />
          <input type="password" placeholder="Password" style={inputStyle} />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              style={inputStyle}
            />
          )}
          <button type="submit" style={buttonStyle}>
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <p
          style={linkStyle}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}

export default AuthPage;

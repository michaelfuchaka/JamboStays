import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const navbarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem 2rem",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  position: "absolute",
  top: 0,
  width: "100%",
  zIndex: 1000,
  borderRadius: "0 0 20px 20px",
};

  const brandStyle = {
    fontSize: "1.4rem",
  fontWeight: "700",
  color: "#2c3e50",
  letterSpacing: "0.5px"
  };

  const linksStyle = {
  display: "flex",
  listStyle: "none",
  gap: "2rem",
  margin: 0,
  padding: 0,
  alignItems: "center",
};

  const linkStyle = {
  textDecoration: "none",
  fontSize: "1rem",
  fontWeight: "500",
  color: "#64748b",
  transition: "all 0.2s ease",
};

  const hoverStyle = {
    color: "#fff",
    transform: "scale(1.05)",
  };

  return (
    <nav style={navbarStyle}>
      <div style={brandStyle}>JamboStays</div>
      <ul style={linksStyle}>
        <li>
          <Link
            to="/"
            style={linkStyle}
           onMouseEnter={(e) => (e.target.style.color = "#3b82f6")}
           onMouseLeave={(e) => (e.target.style.color = "#64748b")}
          >
            Home
          </Link>
        </li>
          <li>
          <Link
            to="/owner-dashboard"
            style={linkStyle}
            onMouseEnter={(e) => (e.target.style.color = "#3b82f6")}
            onMouseLeave={(e) => (e.target.style.color = "#64748b")}
          >
            Owner Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/user-dashboard"
            style={linkStyle}
            onMouseEnter={(e) => (e.target.style.color = "#3b82f6")}
            onMouseLeave={(e) => (e.target.style.color = "#64748b")}
          >
            User Dashboard
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

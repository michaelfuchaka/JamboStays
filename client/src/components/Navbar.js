import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const navbarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    background: "rgba(0, 0, 0, 0.6)", // semi-transparent
    backdropFilter: "blur(6px)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  };

  const brandStyle = {
    fontSize: "1.6rem",
    fontWeight: "800",
    color: "#fff",
    letterSpacing: "1px",
  };

  const linksStyle = {
    listStyle: "none",
    display: "flex",
    gap: "1.5rem",
    margin: 0,
    padding: 0,
  };

  const linkStyle = {
    textDecoration: "none",
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#ffca28",
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
            onMouseEnter={(e) => (e.target.style.color = "#fff")}
            onMouseLeave={(e) => (e.target.style.color = "#ffca28")}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/owner-dashboard"
            style={linkStyle}
            onMouseEnter={(e) => (e.target.style.color = "#fff")}
            onMouseLeave={(e) => (e.target.style.color = "#ffca28")}
          >
            Owner Dashboard
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

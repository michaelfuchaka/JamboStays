import React, { useEffect, useState } from "react";
import api from "../services/api";

const OwnerDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("properties");
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  useEffect(() => {
    fetchProperties();
    fetchBookings();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await api.get("/properties");
      setProperties(res.data);
    } catch (err) {
      setError("Failed to load properties. Please try again.");
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data);
    } catch (err) {
      setError("Failed to load bookings. Please try again.");
    }
  };

  const handleDeleteProperty = async (id) => {
    try {
      await api.delete(`/properties/${id}`);
      fetchProperties();
    } catch (err) {
      setError("Failed to delete property.");
    }
  };

  return (
    <div style={{ paddingTop: "80px" }}>
      {/* Hero Section */}
      <div className="dashboard-hero">
        <div className="hero-overlay">
          <h1 className="dashboard-title">Luxury Rooms & Suites</h1>
          <p className="dashboard-subtitle">Manage Your Properties</p>
        </div>
      </div>

      <div className="dashboard-container">
        {/* Error Message */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button
            onClick={() => setActiveTab("properties")}
            className={`tab-button ${activeTab === "properties" ? "active" : ""}`}
          >
            Properties
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`tab-button ${activeTab === "bookings" ? "active" : ""}`}
          >
            Bookings
          </button>
        </div>

        {/* Properties Tab */}
        {activeTab === "properties" && (
          <div>
            <div className="section-header">
              <h2 className="section-title">Your Properties</h2>
              <button
                onClick={() => {
                  setEditingProperty(null);
                  setShowPropertyForm(true);
                }}
                className="add-property-btn"
              >
                Add Property
              </button>
            </div>

            {properties.length === 0 ? (
              <p className="no-properties">No properties available.</p>
            ) : (
              <div className="properties-grid">
                {properties.map((property) => (
                  <div key={property.id} className="property-card">
                    <div className="property-image-container">
                      <img
                        src={property.image_url || "https://via.placeholder.com/400x250"}
                        alt={property.name}
                        className="property-image"
                      />
                      <div className="property-rating">
                        <span className="stars">★★★★★</span>
                        <span className="rating-number">4.8</span>
                      </div>
                    </div>
                    
                    <div className="property-details">
                      <h3 className="property-name">{property.name}</h3>
                      <p className="property-location">{property.location}</p>
                      
                      <div className="property-features">
                        <div className="feature">
                          <span className="feature-icon">🛏️</span>
                          <span>2 Beds</span>
                        </div>
                        <div className="feature">
                          <span className="feature-icon">🚿</span>
                          <span>2 Baths</span>
                        </div>
                        <div className="feature">
                          <span className="feature-icon">📐</span>
                          <span>850 sqft</span>
                        </div>
                      </div>

                      <div className="property-price">
                        <span className="price">${property.price_per_night}</span>
                        <span className="price-period">/night</span>
                      </div>

                      <div className="property-actions">
                        <button
                          onClick={() => {
                            setEditingProperty(property);
                            setShowPropertyForm(true);
                          }}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property.id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div>
            <h2 className="section-title">Your Bookings</h2>
            {bookings.length === 0 ? (
              <p className="no-bookings">No bookings yet.</p>
            ) : (
              <div className="bookings-list">
                {bookings.map((booking) => {
                  const property = properties.find(p => p.id === booking.property_id);
                  return (
                    <div key={booking.id} className="booking-card">
                      <div className="booking-info">
                        <h3 className="booking-property">{property?.name}</h3>
                        <p className="booking-guest">
                          {booking.guest_name} ({booking.guest_email})
                        </p>
                        <p className="booking-dates">
                          {booking.check_in_date} → {booking.check_out_date}
                        </p>
                      </div>
                      <span className={`booking-status ${booking.booking_status}`}>
                        {booking.booking_status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;


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

  
  const renderStars = (rating = 4.8) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    return stars;
  };

  return (
    <div className="luxury-dashboard"> 
      <div className="container"> 
        
        <div className="dashboard-header">
          <h1 className="main-title">Luxury Rooms & Suites</h1>
          <p className="subtitle">Manage Your Properties</p>
        </div>

       
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="error-close">×</button>
          </div>
        )}

      
        <div className="luxury-tabs">
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
          <div className="content-section"> 
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
              
              <div className="empty-state">
                <p>No properties available.</p>
              </div>
            ) : (
              <div className="properties-grid">
                {properties.map((property) => (
                  <div key={property.id} className="property-card">
                    <div className="property-image-container">
                      <img
                         src={property.images && property.images.length > 0 
                            ? (property.images.find(img => img.is_featured) || property.images[0]).image_url 
                            : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop"} 
                         alt={property.name}
                         className="property-image"
                         onError={(e) => { 
                           e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop'
                         }}
                      />
                    
                      <div className="property-rating">
                        <div className="stars">
                          {renderStars(4.8)}
                        </div>
                        <span className="rating-number">4.8</span>
                      </div>
                    </div>
                 
                    <div className="property-content"> 
                      <div className="property-header"> 
                        <h3 className="property-name">{property.name}</h3>
                      </div>
                      
                      <p className="property-location">{property.location}</p>
                      
                      
                      {property.description && (
                        <p className="property-description">{property.description}</p>
                      )}

                    
                      <div className="property-details">
                        <div className="guest-info"> 
                          <span className="detail-label">Maximum Guests</span>
                          <span className="detail-value">{property.max_guests || 2}</span>
                        </div>
                        
                        <div className="price-section"> 
                          <span className="price">${property.price_per_night}</span>
                          <span className="price-period">per night</span>
                        </div>
                      </div>

                      <div className="property-actions">
                        <button
                          onClick={() => {
                            setEditingProperty(property);
                            setShowPropertyForm(true);
                          }}
                          className="booking-action-btn secondary" 
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property.id)}
                          className="booking-action-btn danger" 
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
          <div className="content-section"> {/* ✨ CHANGED: Added content-section wrapper */}
            <h2 className="section-title">Your Bookings</h2>
            {bookings.length === 0 ? (
           
              <div className="empty-state">
                <p>No bookings yet.</p>
              </div>
            ) : (
              <div className="bookings-list">
                {bookings.map((booking) => {
                  const property = properties.find(p => p.id === booking.property_id);
                  return (
                    <div key={booking.id} className="booking-card">
                     
                      <div className="booking-content">
                        <div className="booking-info">
                          
                          {property && (
                            <img
                              src={property.images?.[0]?.image_url || "https://via.placeholder.com/120x80"}
                              alt={property.name}
                              className="booking-image"
                            />
                          )}
                          <div className="booking-details"> 
                            <h3 className="booking-property">{property?.name}</h3>
                            <p className="booking-location">{property?.location}</p>
                            <p className="booking-guest"> 
                              {booking.guest_name} ({booking.guest_email})
                            </p>
                            
                            <div className="booking-dates">
                              <div className="date-item">
                                <span className="date-label">Check-in</span>
                                <span className="date-value">{new Date(booking.check_in_date).toLocaleDateString()}</span>
                              </div>
                              <div className="date-item">
                                <span className="date-label">Check-out</span>
                                <span className="date-value">{new Date(booking.check_out_date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="booking-status-section">
                          <span className={`booking-status ${booking.booking_status}`}>
                            {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
                          </span>
                         
                          <div className="booking-total">${booking.total_price || 'N/A'}</div>
                        </div>
                      </div>
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
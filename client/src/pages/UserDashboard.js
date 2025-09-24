
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const UserDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("properties");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchProperties(),
        fetchBookings(),
        fetchFavorites()
      ]);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await axios.get("/api/properties");
      setProperties(res.data);
    } catch (err) {
      console.error("Failed to load properties:", err);
    }
  };

  const fetchBookings = async () => {
    try {
      setBookings([]);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    }
  };

  const fetchFavorites = async () => {
    try {
      setFavorites([]);
    } catch (err) {
      console.error("Failed to load favorites:", err);
    }
  };

  const toggleFavorite = async (propertyId) => {
    try {
      const isFavorite = favorites.some(fav => fav.property_id === propertyId);

      if (isFavorite) {
        setFavorites(favorites.filter(fav => fav.property_id !== propertyId));
      } else {
        setFavorites([...favorites, { property_id: propertyId, id: Date.now() }]);
      }
    } catch (err) {
      setError("Failed to update favorites. Please try again.");
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

try {
  setBookings(bookings.map(booking => 
    booking.id === bookingId 
      ? { ...booking, booking_status: "cancelled" }
      : booking
  ));
} catch (err) {
  setError("Failed to cancel booking. Please try again.");
}
  };

  const getFilteredProperties = () => {
    let filtered = properties;

if (searchTerm) {
  filtered = filtered.filter(property =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (property.amenities && property.amenities.toLowerCase().includes(searchTerm.toLowerCase()))
  );
}

if (filterBy === "favorites") {
  const favoriteIds = favorites.map(fav => fav.property_id);
  filtered = filtered.filter(property => favoriteIds.includes(property.id));
}

filtered.sort((a, b) => {
  switch (sortBy) {
    case "price_low":
      return a.price_per_night - b.price_per_night;
    case "price_high":
      return b.price_per_night - a.price_per_night;
    case "guests":
      return b.max_guests - a.max_guests;
    default:
      return a.name.localeCompare(b.name);
  }
});

return filtered;
  };

  const getBookingStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "status-confirmed";
      case "pending":
        return "status-pending";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-default";
    }
  };

  const isPropertyFavorite = (propertyId) => {
    return favorites.some(fav => fav.property_id === propertyId);
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="luxury-spinner"></div>
          <p>Loading your luxury experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="luxury-dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="main-title">Luxury Rooms & Suites</h1>
          <p className="subtitle">Discover exceptional accommodations crafted for the discerning traveler</p>
        </div>

    {/* Error Message */}
    {error && (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={() => setError(null)} className="error-close">×</button>
      </div>
    )}

    {/* Navigation Tabs */}
    <div className="luxury-tabs">
      <button
        onClick={() => setActiveTab("properties")}
        className={`tab-button ${activeTab === "properties" ? "active" : ""}`}
      >
        Browse Suites
      </button>
      <button
        onClick={() => setActiveTab("favorites")}
        className={`tab-button ${activeTab === "favorites" ? "active" : ""}`}
      >
        Favorites ({favorites.length})
      </button>
      <button
        onClick={() => setActiveTab("bookings")}
        className={`tab-button ${activeTab === "bookings" ? "active" : ""}`}
      >
        Reservations ({bookings.length})
      </button>
    </div>

    {/* Properties Tab */}
    {(activeTab === "properties" || activeTab === "favorites") && (
      <div className="content-section">
        {/* Search and Filters */}
        <div className="filters-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search luxury accommodations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="luxury-search"
            />
          </div>

          <div className="filter-controls">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="luxury-select"
            >
              <option value="all">All Properties</option>
              <option value="favorites">Favorites Only</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="luxury-select"
            >
              <option value="name">Sort by Name</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="guests">Max Guests</option>
            </select>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="properties-section">
          {getFilteredProperties().length === 0 ? (
            <div className="empty-state">
              <p>
                {activeTab === "favorites" 
                  ? "No favorite properties selected yet." 
                  : "No properties match your search criteria."}
              </p>
            </div>
          ) : (
            <div className="properties-grid">
              {getFilteredProperties().map((property) => (
                <div key={property.id} className="property-card">
                  <div className="property-image-container">
                    <img
                      src={property.images && property.images.length > 0 
                         ? (property.images.find(img => img.is_featured) || property.images[0]).image_url 
                         : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop'}
                      alt={property.name}
                      className="property-image"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop'
                      }}
                    />
                    <button
                      onClick={() => toggleFavorite(property.id)}
                      className={`favorite-btn ${isPropertyFavorite(property.id) ? "favorited" : ""}`}
                    >
                      ♥
                    </button>
                  </div>
                  
                  <div className="property-content">
                    <div className="property-header">
                      <h3 className="property-name">{property.name}</h3>
                      <div className="property-rating">
                        <div className="stars">
                          {renderStars(4.8)}
                        </div>
                        <span className="rating-number">4.8</span>
                      </div>
                    </div>
                    
                    <p className="property-location">{property.location}</p>
                    <p className="property-description">{property.description}</p>
                    
                    <div className="property-details">
                      <div className="guest-info">
                        <span className="detail-label">Maximum Guests</span>
                        <span className="detail-value">{property.max_guests}</span>
                      </div>
                      
                      <div className="price-section">
                        <span className="price">${property.price_per_night}</span>
                        <span className="price-period">per night</span>
                      </div>
                    </div>
                    
                    <div className="property-actions">
                      <Link to={`/property/${property.id}`} className="view-details-btn">
                        View Details & Book
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )}

    {/* Bookings Tab */}
    {activeTab === "bookings" && (
      <div className="content-section">
        <h2 className="section-title">Your Reservations</h2>
        
        {bookings.length === 0 ? (
          <div className="empty-state">
            <p>No reservations found.</p>
            <Link to="/" className="cta-button">
              Explore Our Suites
            </Link>
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
                          src={property.image_url || "https://via.placeholder.com/120x80"}
                          alt={property.name}
                          className="booking-image"
                        />
                      )}
                      <div className="booking-details">
                        <h3 className="booking-property">{property?.name || "Property Not Found"}</h3>
                        <p className="booking-location">{property?.location}</p>
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
                      <span className={`booking-status ${getBookingStatusColor(booking.booking_status)}`}>
                        {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
                      </span>
                      <div className="booking-total">${booking.total_price}</div>
                      
                      <div className="booking-actions">
                        {property && (
                          <Link to={`/property/${property.id}`} className="booking-action-btn secondary">
                            View Property
                          </Link>
                        )}
                        {booking.booking_status === "confirmed" && (
                          <button
                            onClick={() => cancelBooking(booking.id)}
                            className="booking-action-btn danger"
                          >
                            Cancel Reservation
                          </button>
                        )}
                      </div>
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

export default UserDashboard;


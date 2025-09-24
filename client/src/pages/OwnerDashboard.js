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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-6xl bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-blue-800">
            🏡 Owner Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Easily manage your properties and bookings
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-lg shadow">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => setActiveTab("properties")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === "properties"
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🏢 Properties
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === "bookings"
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            📅 Bookings
          </button>
        </div>

        {/* Properties Tab */}
        {activeTab === "properties" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Your Properties
              </h2>
              <button
                onClick={() => {
                  setEditingProperty(null);
                  setShowPropertyForm(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                ➕ Add Property
              </button>
            </div>

            {properties.length === 0 ? (
              <p className="text-center text-gray-500">
                No properties available.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                          className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property.id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                        >
                          🗑️ Delete
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
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Your Bookings
            </h2>
            {bookings.length === 0 ? (
              <p className="text-center text-gray-500">No bookings yet.</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => {
                  const property = properties.find(
                    (p) => p.id === booking.property_id
                  );
                  return (
                    <div
                      key={booking.id}
                      className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">
                            {property?.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {booking.guest_name} ({booking.guest_email})
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.check_in_date} → {booking.check_out_date}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.booking_status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {booking.booking_status}
                        </span>
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

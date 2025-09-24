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
      // Mock data for now - replace with actual API call
      setBookings([]);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    }
  };

  const fetchFavorites = async () => {
    try {
      // Mock data for now - replace with actual API call
      setFavorites([]);
    } catch (err) {
      console.error("Failed to load favorites:", err);
    }
  };

  const toggleFavorite = async (propertyId) => {
    try {
      const isFavorite = favorites.some(fav => fav.property_id === propertyId);
      
      if (isFavorite) {
        // Remove from favorites
        setFavorites(favorites.filter(fav => fav.property_id !== propertyId));
      } else {
        // Add to favorites
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

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (property.amenities && property.amenities.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (filterBy === "favorites") {
      const favoriteIds = favorites.map(fav => fav.property_id);
      filtered = filtered.filter(property => favoriteIds.includes(property.id));
    }

    // Sort
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
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const isPropertyFavorite = (propertyId) => {
    return favorites.some(fav => fav.property_id === propertyId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-blue-800 mb-2">
            User Dashboard
          </h1>
          <p className="text-gray-600">
            Explore properties, manage favorites, and track your bookings
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-lg shadow">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => setActiveTab("properties")}
            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
              activeTab === "properties"
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow"
            }`}
          >
            Browse Properties
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
              activeTab === "favorites"
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow"
            }`}
          >
            Favorites ({favorites.length})
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
              activeTab === "bookings"
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow"
            }`}
          >
            My Bookings ({bookings.length})
          </button>
        </div>

        {/* Properties Tab */}
        {(activeTab === "properties" || activeTab === "favorites") && (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8">
            {/* Search and Filters */}
            <div className="mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search properties, locations, amenities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-4">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Properties</option>
                  <option value="favorites">Favorites Only</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="guests">Max Guests</option>
                </select>
              </div>
            </div>

            {/* Properties Grid */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {activeTab === "favorites" ? "Your Favorite Properties" : "Available Properties"}
              </h2>

              {getFilteredProperties().length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {activeTab === "favorites" 
                      ? "No favorite properties yet. Start exploring!" 
                      : "No properties found. Try adjusting your search."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredProperties().map((property) => (
                    <div key={property.id} className="relative">
                      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden">
                        <div className="relative overflow-hidden">
                          <img
                            src={property.image_url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop'}
                            alt={property.name}
                            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop'
                            }}
                          />
                          <div className="absolute top-3 right-3">
                            <span className="bg-white/90 text-gray-900 px-2 py-1 rounded text-xs">
                              ⭐ 4.8
                            </span>
                          </div>
                          {/* Favorite Button */}
                          <button
                            onClick={() => toggleFavorite(property.id)}
                            className={`absolute top-3 left-3 p-2 rounded-full shadow-lg transition-all ${
                              isPropertyFavorite(property.id)
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-white text-gray-400 hover:text-red-500"
                            }`}
                          >
                            ❤
                          </button>
                        </div>
                        
                        <div className="p-4">
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-900">{property.name}</h3>
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="mr-1">📍</span>
                              <span>{property.location}</span>
                            </div>
                            <p className="text-sm text-gray-600">{property.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm text-gray-600">
                                <span className="mr-1">👥</span>
                                <span>Up to {property.max_guests} guests</span>
                              </div>
                              <div className="text-right">
                                <span className="text-2xl font-bold text-gray-900">${property.price_per_night}</span>
                                <span className="text-sm text-gray-600">/night</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 pt-0">
                          <Link to={`/property/${property.id}`} className="w-full">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition">
                              View Details
                            </button>
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
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Bookings</h2>
            
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No bookings yet.</p>
                <Link to="/">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Browse Properties
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => {
                  const property = properties.find(p => p.id === booking.property_id);
                  return (
                    <div
                      key={booking.id}
                      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border-l-4 border-blue-500"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          <div className="flex items-start space-x-4">
                            {property && (
                              <img
                                src={property.image_url || "https://via.placeholder.com/100x80"}
                                alt={property.name}
                                className="w-20 h-16 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {property?.name || "Property Not Found"}
                              </h3>
                              <p className="text-gray-600 text-sm mb-2">
                                📍 {property?.location}
                              </p>
                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                <div>
                                  <span className="font-semibold">Check-in:</span>
                                  <br />
                                  {new Date(booking.check_in_date).toLocaleDateString()}
                                </div>
                                <div>
                                  <span className="font-semibold">Check-out:</span>
                                  <br />
                                  {new Date(booking.check_out_date).toLocaleDateString()}
                                </div>
                                <div>
                                  <span className="font-semibold">Guest:</span>
                                  <br />
                                  {booking.guest_name}
                                </div>
                                <div>
                                  <span className="font-semibold">Total:</span>
                                  <br />
                                  <span className="text-lg font-bold text-green-600">
                                    ${booking.total_price}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end space-y-3">
                          <span
                            className={`px-4 py-2 rounded-full text-xs font-semibold border ${getBookingStatusColor(booking.booking_status)}`}
                          >
                            {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
                          </span>

                          <div className="flex space-x-2">
                            {property && (
                              <Link to={`/property/${property.id}`}>
                                <button className="px-4 py-2 text-sm bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition">
                                  View Property
                                </button>
                              </Link>
                            )}

                            {booking.booking_status === "confirmed" && (
                              <button
                                onClick={() => cancelBooking(booking.id)}
                                className="px-4 py-2 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition"
                              >
                                Cancel Booking
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
import React, { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get("/api/properties");
        setProperties(response.data);
      } catch (err) {
        setError("⚠️ Failed to load properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((property) =>
    property.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home-container">
      <h1>JamboStays</h1>
      <p className="subtitle">
        Discover handpicked properties for your next trip
      </p>

      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search by location, name, or amenities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p className="message">⏳ Loading properties...</p>}
      {error && <p className="message">{error}</p>}

      <div className="featured">
        <h2>Featured Properties</h2>

        {filteredProperties.length === 0 ? (
          <p className="message">
            No properties available. Check back soon for new listings.
          </p>
        ) : (
          <div className="property-grid">
            {filteredProperties.map((property) => (
              <div key={property.id} className="card">
                <img 
                 src={property.images && property.images.length > 0 
                   ? (property.images.find(img => img.is_featured) || property.images[0]).image_url 
                   : "https://via.placeholder.com/400x250"
             } 
                alt={property.name} 
            />
                <div className="card-body">
                  <h3>{property.name}</h3>
                  <p>{property.location}</p>
                  <p>${property.price_per_night} / night</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

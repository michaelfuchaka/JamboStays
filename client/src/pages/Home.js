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
    <div  className="homepage">
      <div className="hero-section">
  <div className="hero-content">
    <h1 className="hero-title">Finding Your New Home Is Simple</h1>
    <p className="hero-subtitle">
      Discover handpicked properties for your next trip
    </p>

      <div className="hero-search">
      <input
        type="text"
        placeholder="🔍 Search by location, name, or amenities..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  </div>
</div>

      {loading && <p className="message">⏳ Loading properties...</p>}
      {error && <p className="message">{error}</p>}
  <section className="most-viewed-section">
  <h2 className="section-title">Most Viewed</h2>

        {filteredProperties.length === 0 ? (
          <p className="message">
            No properties available. Check back soon for new listings.
          </p>
        ) : (
          <div className="property-grid">
            {filteredProperties.map((property) => (
              <div key={property.id} className="card">
                <img src={property.image_url} alt={property.name} />
                <div className="card-body">
                  <h3>{property.name}</h3>
                  <p>{property.location}</p>
                  <p>${property.price_per_night} / night</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;

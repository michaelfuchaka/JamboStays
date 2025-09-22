import { useEffect, useState } from "react";
import { getOwnerProperties } from "../utils/api";
import PropertyCard from "../components/PropertyCard";

export default function OwnerDashboard() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    getOwnerProperties(1).then(setProperties); // assume owner ID = 1 for now
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Owner Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";

export default function PropertyCard({ property }) {
  return (
    <div className="border rounded-lg shadow-md p-4">
      <img src={property.image || "/logo.png"} alt={property.name} className="w-full h-40 object-cover rounded" />
      <h2 className="text-xl font-semibold mt-2">{property.name}</h2>
      <p className="text-gray-600">Price: ${property.price} / night</p>
      <Link to={`/property/${property.id}`} className="text-blue-600 underline mt-2 inline-block">
        View Details
      </Link>
    </div>
  );
}

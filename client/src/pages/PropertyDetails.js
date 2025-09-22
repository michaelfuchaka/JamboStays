import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPropertyById } from "../utils/api";

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    getPropertyById(id).then(setProperty);
  }, [id]);

  if (!property) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold">{property.name}</h1>
      <img src={property.image || "/logo.png"} alt={property.name} className="w-full h-64 object-cover rounded my-4" />
      <p>{property.description}</p>
      <p className="font-semibold mt-2">Price: ${property.price} / night</p>
      {/* BookingForm (Person 2 will implement) */}
    </div>
  );
}

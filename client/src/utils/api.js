const API_URL = "http://localhost:5000"; // Flask backend

export async function getProperties() {
  const res = await fetch(`${API_URL}/properties`);
  return res.json();
}

export async function getPropertyById(id) {
  const res = await fetch(`${API_URL}/properties/${id}`);
  return res.json();
}

export async function getOwnerProperties(ownerId) {
  const res = await fetch(`${API_URL}/owners/${ownerId}/properties`);
  return res.json();
}

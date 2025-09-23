import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="font-bold text-lg">JamboStays</h1>
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/owner-dashboard">Owner Dashboard</Link>
      </div>
    </nav>
  );
}

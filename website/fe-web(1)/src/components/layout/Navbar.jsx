import { Link } from "react-router-dom";
import "../../styles/layout.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo"> FastFood</h2>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/login">Logout</Link></li>
      </ul>
    </nav>
  );
}

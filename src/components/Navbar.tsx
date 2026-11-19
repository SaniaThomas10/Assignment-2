
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">

      {/* Top section of the navbar */}
      <div className="navbar-top">

        {/* LYFE CHECK logo */}
        <NavLink to="/" className="navbar-logo">
          <img
            src="/images/lyfe-check-logo.png"
            alt="LYFE CHECK Logo"
          />
        </NavLink>

      </div>

      {/* Navigation links */}
      <nav className="navbar-links" aria-label="Main navigation">

        <NavLink to="/" end>
          Home
        </NavLink>

        <NavLink to="/calendar">
          Calendar
        </NavLink>

        <NavLink to="/todo">
          To-Do
        </NavLink>

        <NavLink to="/journal">
          Journal
        </NavLink>

        <NavLink to="/inspiration">
          Inspiration
        </NavLink>

      </nav>

    </header>
  );
}

export default Navbar;

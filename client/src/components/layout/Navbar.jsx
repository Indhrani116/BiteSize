import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">

      {/* Logo */}
      <Link
        to="/"
        className="navbar-logo"
        onClick={closeMenu}
      >
        🧠 BiteSize
      </Link>

      {/* Desktop Navigation */}
      <div className="navbar-links">

        <Link to="/">Home</Link>

        <Link to="/explore">Explore</Link>

        <Link to="/create">Create</Link>

        <Link to="/bookmarks">Saved</Link>

      </div>

      {/* Desktop Actions */}
      <div className="navbar-actions">

        <button className="navbar-icon">
          🔔
        </button>

        <Link
          to="/profile"
          className="navbar-profile"
        >
          👤
        </Link>

      </div>

      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">

          <Link to="/" onClick={closeMenu}>
            Home
          </Link>

          <Link to="/explore" onClick={closeMenu}>
            Explore
          </Link>

          <Link to="/create" onClick={closeMenu}>
            Create
          </Link>

          <Link to="/bookmarks" onClick={closeMenu}>
            Saved
          </Link>

          <Link to="/profile" onClick={closeMenu}>
            👤 Profile
          </Link>

        </div>
      )}

    </nav>
  );
}

export default Navbar;
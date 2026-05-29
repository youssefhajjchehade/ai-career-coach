import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const navClass = ({ isActive }) =>
    isActive ? "nav-item nav-item-active" : "nav-item";

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span className="logo-mark">AI</span>
        <span>Career Coach</span>
      </Link>

      <div className="nav-links">
        <NavLink to="/" className={navClass}>
          Home
        </NavLink>

        {token ? (
          <>
            <NavLink to="/dashboard" className={navClass}>
              Dashboard
            </NavLink>

            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={navClass}>
              Login
            </NavLink>

            <Link to="/register" className="nav-cta">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
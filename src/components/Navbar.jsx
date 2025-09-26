// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo.png";
import { useAuth } from "../context/AuthContextProvider";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const navRef = useRef(null);
  const navigate = useNavigate();

  // ✅ from AuthContext
  const { isLoggedIn, logout } = useAuth();

  // Close menus when clicking/tapping outside the navbar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
        setServicesOpen(false);
        setResourcesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout(); // ✅ use same logout from AuthContext
    navigate("/login");
  };

  return (
    <nav
      ref={navRef}
      className="bg-white shadow-md px-6 py-3 flex justify-between items-center relative"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img src={Logo} alt="Logo" className="h-14 w-14 inline-block" />
      </Link>

      {/* Hamburger (Mobile) */}
      <button
        type="button"
        className="md:hidden text-2xl"
        onClick={() => setMenuOpen((v) => !v)}
        aria-expanded={menuOpen}
        aria-label="Toggle menu"
      >
        {menuOpen ? "✖" : "☰"}
      </button>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6 items-center">
        <li><Link to="/" className="hover:text-indigo-600">Home</Link></li>
        <li><Link to="/about" className="hover:text-indigo-600">About</Link></li>

        {/* Services Dropdown */}
        <li className="relative">
          <button
            type="button"
            onClick={() => {
              setServicesOpen((v) => !v);
              setResourcesOpen(false);
            }}
            className="hover:text-indigo-600"
            aria-expanded={servicesOpen}
          >
            Services ▾
          </button>
          {servicesOpen && (
            <ul className="absolute left-0 mt-2 w-56 bg-white border rounded-md shadow-lg z-50">
              <li>
                <Link to="/services/personal-wellness" className="block px-4 py-2 hover:bg-indigo-50">
                  Personal Wellness Programmes
                </Link>
              </li>
              <li>
                <Link to="/services/business-wellness" className="block px-4 py-2 hover:bg-indigo-50">
                  Business Wellness Programmes
                </Link>
              </li>
              <li>
                <Link to="/services/program-details" className="block px-4 py-2 hover:bg-indigo-50">
                  Wellness Program Details
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li><Link to="/marketplace" className="hover:text-indigo-600">Shop</Link></li>
        <li><Link to="/resources/podcasts" className="hover:text-indigo-600">Podcasts</Link></li>
        <li><Link to="/resources/webinars" className="hover:text-indigo-600">Webinars</Link></li>
        <li><Link to="/blog" className="hover:text-indigo-600">Blog</Link></li>
        <li><Link to="/ai-wellness" className="hover:text-indigo-600">AI Wellness</Link></li>
        <li><Link to="/membership" className="hover:text-indigo-600">Membership</Link></li>
        <li><Link to="/contact" className="hover:text-indigo-600">Contact Us</Link></li>

        {/* ✅ Auth Buttons */}
        {!isLoggedIn ? (
          <li>
            <Link
              to="/login"
              className="bg-[#006666] text-white px-4 py-2 rounded-md hover:bg-[#006666]/80"
            >
              Login
            </Link>
          </li>
        ) : (
          <li>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </li>
        )}
      </ul>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="absolute top-14 left-0 w-full bg-white border-t shadow-md flex flex-col space-y-2 p-4 md:hidden z-50">
          {/* ...same links as desktop... */}

          {/* ✅ Auth Buttons Mobile */}
          {!isLoggedIn ? (
            <li>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="bg-[#006666] text-white px-4 py-2 rounded-md hover:bg-[#006666]/80 block text-center"
              >
                Login
              </Link>
            </li>
          ) : (
            <li>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-full text-center"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/images/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  // Single ref for the entire navbar (used to detect clicks outside)
  const navRef = useRef(null);

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

  return (
    <nav ref={navRef} className="bg-white shadow-md px-6 py-3 flex justify-between items-center relative">
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
        <li>
          <Link to="/" className="hover:text-indigo-600">Home</Link>
        </li>
        <li>
          <Link to="/about" className="hover:text-indigo-600">About</Link>
        </li>

        {/* Services Dropdown (desktop) */}
        <li className="relative">
          <button
            type="button"
            onClick={() => {
              setServicesOpen((v) => !v);
              // close other dropdown if open
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
                <Link
                  to="/services/personal-wellness"
                  className="block px-4 py-2 hover:bg-indigo-50"
                  onClick={() => setServicesOpen(false)}
                >
                  Personal Wellness Programmes
                </Link>
              </li>
              <li>
                <Link
                  to="/services/business-wellness"
                  className="block px-4 py-2 hover:bg-indigo-50"
                  onClick={() => setServicesOpen(false)}
                >
                  Business Wellness Programmes
                </Link>
              </li>
              <li>
                <Link
                  to="/services/program-details"
                  className="block px-4 py-2 hover:bg-indigo-50"
                  onClick={() => setServicesOpen(false)}
                >
                  Wellness Program Details
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li>
          <Link to="/marketplace" className="hover:text-indigo-600">MarketPlace</Link>
        </li>

        {/* Resources Dropdown (desktop) */}
        <li className="relative">
          <button
            type="button"
            onClick={() => {
              setResourcesOpen((v) => !v);
              setServicesOpen(false);
            }}
            className="hover:text-indigo-600"
            aria-expanded={resourcesOpen}
          >
            Resources Hub ▾
          </button>
          {resourcesOpen && (
            <ul className="absolute left-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
              <li>
                <Link
                  to="/resources/podcasts"
                  className="block px-4 py-2 hover:bg-indigo-50"
                  onClick={() => setResourcesOpen(false)}
                >
                  Podcasts
                </Link>
              </li>
              <li>
                <Link
                  to="/resources/webinars"
                  className="block px-4 py-2 hover:bg-indigo-50"
                  onClick={() => setResourcesOpen(false)}
                >
                  Webinars
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li><Link to="/blog" className="hover:text-indigo-600">Blog</Link></li>
        <li><Link to="/ai-wellness" className="hover:text-indigo-600">AI Wellness</Link></li>
        <li><Link to="/membership" className="hover:text-indigo-600">Membership</Link></li>
        <li><Link to="/contact" className="hover:text-indigo-600">Contact Us</Link></li>
        <li>
          <Link
            to="/login"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Login
          </Link>
        </li>
      </ul>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <ul className="absolute top-14 left-0 w-full bg-white border-t shadow-md flex flex-col space-y-2 p-4 md:hidden z-50">
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-indigo-600 block">Home</Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setMenuOpen(false)} className="hover:text-indigo-600 block">About</Link>
          </li>

          {/* Services Submenu (mobile) */}
          <li>
            <button
              type="button"
              onClick={() => {
                setServicesOpen((v) => !v);
                // ensure other dropdown closes
                setResourcesOpen(false);
              }}
              className="w-full text-left hover:text-indigo-600"
              aria-expanded={servicesOpen}
            >
              Services ▾
            </button>
            {servicesOpen && (
              <ul className="pl-4 mt-1 space-y-1">
                <li>
                  <Link
                    to="/services/personal-wellness"
                    onClick={() => {
                      setMenuOpen(false);
                      setServicesOpen(false);
                    }}
                    className="block hover:text-indigo-600"
                  >
                    Personal Wellness Programmes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services/business-wellness"
                    onClick={() => {
                      setMenuOpen(false);
                      setServicesOpen(false);
                    }}
                    className="block hover:text-indigo-600"
                  >
                    Business Wellness Programmes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services/program-details"
                    onClick={() => {
                      setMenuOpen(false);
                      setServicesOpen(false);
                    }}
                    className="block hover:text-indigo-600"
                  >
                    Wellness Program Details
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/marketplace" onClick={() => setMenuOpen(false)} className="hover:text-indigo-600 block">MarketPlace</Link>
          </li>

          {/* Resources Submenu (mobile) */}
          <li>
            <button
              type="button"
              onClick={() => {
                setResourcesOpen((v) => !v);
                setServicesOpen(false);
              }}
              className="w-full text-left hover:text-indigo-600"
              aria-expanded={resourcesOpen}
            >
              Resources Hub ▾
            </button>
            {resourcesOpen && (
              <ul className="pl-4 mt-1 space-y-1">
                <li>
                  <Link
                    to="/resources/podcasts"
                    onClick={() => {
                      setMenuOpen(false);
                      setResourcesOpen(false);
                    }}
                    className="block hover:text-indigo-600"
                  >
                    Podcasts
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources/webinars"
                    onClick={() => {
                      setMenuOpen(false);
                      setResourcesOpen(false);
                    }}
                    className="block hover:text-indigo-600"
                  >
                    Webinars
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li><Link to="/blog" onClick={() => setMenuOpen(false)} className="hover:text-indigo-600 block">Blog</Link></li>
          <li><Link to="/ai-wellness" onClick={() => setMenuOpen(false)} className="hover:text-indigo-600 block">AI Wellness</Link></li>
          <li><Link to="/membership" onClick={() => setMenuOpen(false)} className="hover:text-indigo-600 block">Membership</Link></li>
          <li><Link to="/contact" onClick={() => setMenuOpen(false)} className="hover:text-indigo-600 block">Contact Us</Link></li>
          <li>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 block text-center"
            >
              Login
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;

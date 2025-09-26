import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import Logo from "../assets/images/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const user = (() => {
    try {
      const raw =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

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
    <nav
      ref={navRef}
      className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img
                src={Logo}
                alt="Fifty Firsts Wellness"
                className="h-12 w-12 transition-transform group-hover:scale-105"
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-bold text-gray-900 group-hover:text-brand-green transition-colors font-heading">
                Fifty Firsts Wellness
              </span>
              <div className="text-xs text-brand-green font-medium uppercase tracking-wider font-primary">
                Wellness Solutions
              </div>
            </div>
          </Link>

          {/* Hamburger (Mobile) */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Menu - Centered */}
          <ul className="hidden md:flex space-x-6 items-center absolute left-1/2 transform -translate-x-1/2">
            {/* Services Dropdown (desktop) */}
            <li className="relative">
              <button
                type="button"
                onMouseEnter={() => {
                  setServicesOpen(true);
                  setResourcesOpen(false);
                }}
                onMouseLeave={() => {
                  setServicesOpen(false);
                }}
                className="flex items-center space-x-1 text-gray-700 hover:text-brand-green font-medium transition-colors px-3 py-2 rounded-lg hover:bg-brand-green/5 font-primary"
                aria-expanded={servicesOpen}
              >
                <span>Services</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    servicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {servicesOpen && (
                <ul
                  className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <li>
                    <Link
                      to="/services/personal-wellness"
                      className="block px-4 py-3 text-gray-700 hover:bg-brand-green/10 hover:text-brand-green transition-colors"
                      onClick={() => setServicesOpen(false)}
                    >
                      Personal Wellness Programmes
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/services/business-wellness"
                      className="block px-4 py-3 text-gray-700 hover:bg-brand-green/10 hover:text-brand-green transition-colors"
                      onClick={() => setServicesOpen(false)}
                    >
                      Business Wellness Programmes
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/services/program-details"
                      className="block px-4 py-3 text-gray-700 hover:bg-brand-green/10 hover:text-brand-green transition-colors"
                      onClick={() => setServicesOpen(false)}
                    >
                      Wellness Program Details
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link
                to="/marketplace"
                className="text-gray-700 hover:text-brand-green font-medium transition-colors px-3 py-2 rounded-lg hover:bg-brand-green/5 font-primary"
              >
                Marketplace
              </Link>
            </li>

            {/* Resources Dropdown (desktop) */}
            <li className="relative">
              <button
                type="button"
                onMouseEnter={() => {
                  setResourcesOpen(true);
                  setServicesOpen(false);
                }}
                onMouseLeave={() => {
                  setResourcesOpen(false);
                }}
                className="flex items-center space-x-1 text-gray-700 hover:text-brand-green font-medium transition-colors px-3 py-2 rounded-lg hover:bg-brand-green/5 font-primary"
                aria-expanded={resourcesOpen}
              >
                <span>Resources</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    resourcesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {resourcesOpen && (
                <ul
                  className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2"
                  onMouseEnter={() => setResourcesOpen(true)}
                  onMouseLeave={() => setResourcesOpen(false)}
                >
                  <li>
                    <Link
                      to="/resources/podcasts"
                      className="block px-4 py-3 text-gray-700 hover:bg-brand-green/10 hover:text-brand-green transition-colors"
                      onClick={() => setResourcesOpen(false)}
                    >
                      Podcasts
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/resources/webinars"
                      className="block px-4 py-3 text-gray-700 hover:bg-brand-green/10 hover:text-brand-green transition-colors"
                      onClick={() => setResourcesOpen(false)}
                    >
                      Webinars
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* <li>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-brand-green font-medium transition-colors px-3 py-2 rounded-lg hover:bg-brand-green/5 font-primary"
              >
                Contact
              </Link>
            </li> */}
          </ul>

          {/* Login Button - Right aligned */}
          <div className="hidden md:flex items-center gap-3">
            {user?.role === "ADMIN" && (
              <Link
                to="/admin/overview"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Admin
              </Link>
            )}
            <Link
              to="/login"
              className="bg-brand-green text-white px-6 py-2 rounded-lg hover:bg-brand-green-dark font-medium transition-colors shadow-sm hover:shadow-md font-primary"
            >
              Login
            </Link>
          </div>

          {/* Mobile Dropdown Menu */}
          {menuOpen && (
            <div className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-xl md:hidden z-50">
              <ul className="flex flex-col py-4">
                {/* Services Submenu (mobile) */}
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setServicesOpen((v) => !v);
                      setResourcesOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-brand-green/10 hover:text-brand-green font-medium transition-colors"
                    aria-expanded={servicesOpen}
                  >
                    <span>Services</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        servicesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {servicesOpen && (
                    <ul className="bg-gray-50">
                      <li>
                        <Link
                          to="/services/personal-wellness"
                          onClick={() => {
                            setMenuOpen(false);
                            setServicesOpen(false);
                          }}
                          className="block px-8 py-3 text-gray-600 hover:bg-brand-green/10 hover:text-brand-green transition-colors"
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
                          className="block px-8 py-3 text-gray-600 hover:bg-brand-green/10 hover:text-brand-green transition-colors"
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
                          className="block px-8 py-3 text-gray-600 hover:bg-brand-green/10 hover:text-brand-green transition-colors"
                        >
                          Wellness Program Details
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                <li>
                  <Link
                    to="/marketplace"
                    onClick={() => setMenuOpen(false)}
                    className="block px-6 py-3 text-gray-700 hover:bg-brand-green/10 hover:text-brand-green font-medium transition-colors"
                  >
                    Marketplace
                  </Link>
                </li>

                {/* Resources Submenu (mobile) */}
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setResourcesOpen((v) => !v);
                      setServicesOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-brand-green/10 hover:text-brand-green font-medium transition-colors"
                    aria-expanded={resourcesOpen}
                  >
                    <span>Resources</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        resourcesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {resourcesOpen && (
                    <ul className="bg-gray-50">
                      <li>
                        <Link
                          to="/resources/podcasts"
                          onClick={() => {
                            setMenuOpen(false);
                            setResourcesOpen(false);
                          }}
                          className="block px-8 py-3 text-gray-600 hover:bg-brand-green/10 hover:text-brand-green transition-colors"
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
                          className="block px-8 py-3 text-gray-600 hover:bg-brand-green/10 hover:text-brand-green transition-colors"
                        >
                          Webinars
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                <li>
                  <Link
                    to="/ai-wellness"
                    onClick={() => setMenuOpen(false)}
                    className="block px-6 py-3 text-gray-700 hover:bg-brand-green/10 hover:text-brand-green font-medium transition-colors"
                  >
                    AI Wellness
                  </Link>
                </li>

                {/* <li>
                  <Link
                    to="/contact"
                    onClick={() => setMenuOpen(false)}
                    className="block px-6 py-3 text-gray-700 hover:bg-brand-green/10 hover:text-brand-green font-medium transition-colors"
                  >
                    Contact
                  </Link>
                </li> */}
                <li className="px-6 py-3">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full bg-brand-green text-white px-6 py-3 rounded-lg hover:bg-brand-green-dark font-medium transition-colors text-center shadow-sm"
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

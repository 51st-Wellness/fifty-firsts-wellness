import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import Logo from "../assets/images/logo-with-name.png";
import { UserAvatar } from "./UserAvatar";
import { useAuth } from "../context/AuthContextProvider";
import CartIcon from "./CartIcon";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  // Timeout refs for delayed closing
  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resourcesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get auth state from context
  const { user, isAuthenticated } = useAuth();

  // Single ref for the entire navbar (used to detect clicks outside)
  const navRef = useRef<HTMLElement>(null);

  // Helper functions for dropdown management with delay
  const handleServicesMouseEnter = () => {
    // Clear any pending close timeout
    if (servicesTimeoutRef.current) {
      clearTimeout(servicesTimeoutRef.current);
      servicesTimeoutRef.current = null;
    }
    setServicesOpen(true);
    setResourcesOpen(false);
  };

  const handleServicesMouseLeave = () => {
    // Set a delay before closing
    servicesTimeoutRef.current = setTimeout(() => {
      setServicesOpen(false);
    }, 300); // 300ms delay
  };

  const handleResourcesMouseEnter = () => {
    // Clear any pending close timeout
    if (resourcesTimeoutRef.current) {
      clearTimeout(resourcesTimeoutRef.current);
      resourcesTimeoutRef.current = null;
    }
    setResourcesOpen(true);
    setServicesOpen(false);
  };

  const handleResourcesMouseLeave = () => {
    // Set a delay before closing
    resourcesTimeoutRef.current = setTimeout(() => {
      setResourcesOpen(false);
    }, 300); // 300ms delay
  };

  // Close menus when clicking/tapping outside the navbar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
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
      // Clean up any pending timeouts
      if (servicesTimeoutRef.current) {
        clearTimeout(servicesTimeoutRef.current);
      }
      if (resourcesTimeoutRef.current) {
        clearTimeout(resourcesTimeoutRef.current);
      }
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className="bg-white border-b border-gray-100 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src={Logo}
              alt="Fifty Firsts Wellness"
              className="h-10 sm:h-12 w-auto transition-transform group-hover:scale-[1.01]"
            />
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
            <li>
              <Link
                to="/about"
                className="text-gray-700 hover:text-brand-green font-medium transition-colors px-3 py-2 rounded-lg font-primary"
              >
                About
              </Link>
            </li>
            {/* Services Dropdown (desktop) */}
            <li className="relative">
              <button
                type="button"
                onMouseEnter={handleServicesMouseEnter}
                onMouseLeave={handleServicesMouseLeave}
                className="flex items-center space-x-1 text-gray-700 hover:text-brand-green font-medium transition-colors px-3 py-2 rounded-lg font-primary"
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
                  onMouseEnter={handleServicesMouseEnter}
                  onMouseLeave={handleServicesMouseLeave}
                >
                  <li>
                    <Link
                      to="/services/personal-wellness"
                      className="block px-4 py-3 text-gray-700  hover:text-brand-green transition-colors"
                      onClick={() => setServicesOpen(false)}
                    >
                      Personal Wellness Programmes
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/services/business-wellness"
                      className="block px-4 py-3 text-gray-700  hover:text-brand-green transition-colors"
                      onClick={() => setServicesOpen(false)}
                    >
                      Business Wellness Programmes
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/services/program-details"
                      className="block px-4 py-3 text-gray-700  hover:text-brand-green transition-colors"
                      onClick={() => setServicesOpen(false)}
                    >
                      Wellness Program Details
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <NavLink
                to="/marketplace"
                className={({ isActive }) =>
                  `text-gray-700 hover:text-brand-green font-medium transition-colors px-3 py-2 font-primary relative group ${isActive ? 'after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 after:h-0.5 after:w-12 after:bg-brand-green after:transition-all after:duration-300' : 'after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 after:h-0.5 after:w-0 group-hover:after:w-12 after:bg-brand-green after:transition-all after:duration-300'}`
                }
              >
                Marketplace
              </NavLink>
            </li>

            {/* Resources Dropdown (desktop) */}
            <li className="relative">
              <button
                type="button"
                onMouseEnter={handleResourcesMouseEnter}
                onMouseLeave={handleResourcesMouseLeave}
                className="flex items-center space-x-1 text-gray-700 hover:text-brand-green font-medium transition-colors px-3 py-2 rounded-lg font-primary"
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
                  onMouseEnter={handleResourcesMouseEnter}
                  onMouseLeave={handleResourcesMouseLeave}
                >
                  <li>
                    <Link
                      to="/resources/webinars"
                      className="block px-4 py-3 text-gray-700  hover:text-brand-green transition-colors"
                      onClick={() => setResourcesOpen(false)}
                    >
                      Webinars
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/podcasts"
                      className="block px-4 py-3 text-gray-700  hover:text-brand-green transition-colors"
                      onClick={() => setResourcesOpen(false)}
                    >
                      Podcasts
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/blog"
                      className="block px-4 py-3 text-gray-700  hover:text-brand-green transition-colors"
                      onClick={() => setResourcesOpen(false)}
                    >
                      Blog
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-brand-green font-medium transition-colors px-3 py-2 rounded-lg font-primary"
              >
                Contact
              </Link>
            </li>
          </ul>

          {/* User Avatar & Cart - Right aligned */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user?.role === "ADMIN" && (
              <Link
                to="/admin"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium text-sm"
              >
                Admin
              </Link>
            )}
            {isAuthenticated && <CartIcon />}
            <UserAvatar />
          </div>

          {/* Mobile Slide-in Menu */}
          {menuOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/50 md:hidden z-40"
                onClick={() => setMenuOpen(false)}
              />
              
              {/* Sidebar */}
              <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl md:hidden z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto animate-slide-in-right">
                {/* Close Button */}
                <div className="flex justify-end p-4">
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={24} className="text-gray-700" />
                  </button>
                </div>
                
              <ul className="flex flex-col py-4 px-2">
                {/* Services Submenu (mobile) */}
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setServicesOpen((v) => !v);
                      setResourcesOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-6 py-3 text-gray-700  hover:text-brand-green font-medium transition-colors"
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
                          className="block px-8 py-3 text-gray-600  hover:text-brand-green transition-colors"
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
                          className="block px-8 py-3 text-gray-600  hover:text-brand-green transition-colors"
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
                          className="block px-8 py-3 text-gray-600  hover:text-brand-green transition-colors"
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
                    className="block px-6 py-3 text-gray-700  hover:text-brand-green font-medium transition-colors"
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
                          to="/resources/webinars"
                          onClick={() => {
                            setMenuOpen(false);
                            setResourcesOpen(false);
                          }}
                          className="block px-8 py-3 text-gray-600  hover:text-brand-green transition-colors"
                        >
                          Webinars
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/podcasts"
                          onClick={() => {
                            setMenuOpen(false);
                            setResourcesOpen(false);
                          }}
                          className="block px-8 py-3 text-gray-600  hover:text-brand-green transition-colors"
                        >
                          Podcasts
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/blog"
                          onClick={() => {
                            setMenuOpen(false);
                            setResourcesOpen(false);
                          }}
                          className="block px-8 py-3 text-gray-600  hover:text-brand-green transition-colors"
                        >
                          Blog
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Admin (mobile) */}
                {isAuthenticated && user?.role === "ADMIN" && (
                  <li>
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="block px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 font-medium transition-colors rounded-lg mx-4 my-2 text-center"
                    >
                      Admin
                    </Link>
                  </li>
                )}

                <li>
                  <Link
                    to="/ai-wellness"
                    onClick={() => setMenuOpen(false)}
                    className="block px-6 py-3 text-gray-700  hover:text-brand-green font-medium transition-colors"
                  >
                    AI Wellness
                  </Link>
                </li>

                <li>
                  <Link
                    to="/contact"
                    onClick={() => setMenuOpen(false)}
                    className="block px-6 py-3 text-gray-700  hover:text-brand-green font-medium transition-colors"
                  >
                    Contact
                  </Link>
                </li>

                {/* Mobile Cart & User Avatar/Auth */}
                {isAuthenticated && (
                  <li className="px-6 py-3 flex items-center justify-center">
                    <CartIcon />
                  </li>
                )}
                <li className="px-6 py-3">
                  <UserAvatar className="w-full" />
                </li>
              </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

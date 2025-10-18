import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Illustration */}
          <div className="flex justify-center lg:justify-start">
            <img 
              src="/assets/404-img.svg" 
              alt="404 Error" 
              className="w-full max-w-md lg:max-w-lg"
            />
          </div>

          {/* Right Side - Content */}
          <div className="text-center lg:text-left">
            <h1 
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              PAGE NOT FOUND
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md mx-auto lg:mx-0">
              Sorry, we couldn't find the page you were looking for. Try reloading the page or go back to home
            </p>

            <Link
              to="/"
              className="inline-flex items-center justify-center bg-brand-green text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-green-dark transition-colors"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

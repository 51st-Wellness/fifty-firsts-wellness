import React, { useState, useEffect } from "react";
import { X, Cookie, Settings, Check } from "lucide-react";
import { Link } from "react-router-dom";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieConsent: React.FC = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consentGiven = localStorage.getItem("cookie-consent");
    if (!consentGiven) {
      // Show consent popup after a short delay
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    localStorage.setItem("cookie-consent", JSON.stringify(allPreferences));
    setShowConsent(false);
    // Here you would typically initialize analytics and marketing cookies
  };

  const handleRejectAll = () => {
    const minimalPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    localStorage.setItem("cookie-consent", JSON.stringify(minimalPreferences));
    setShowConsent(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences));
    setShowConsent(false);
    setShowSettings(false);
    // Here you would initialize cookies based on preferences
  };

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    if (key === "necessary") return; // Can't change necessary cookies
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (!showConsent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      
      {/* Consent Modal */}
      <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {!showSettings ? (
          // Main consent view
          <div className="p-4 sm:p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Cookie className="w-4 h-4 sm:w-5 sm:h-5 text-brand-green" />
              </div>
              <h2 
                className="text-lg sm:text-xl font-semibold text-gray-900"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Cookie Preferences
              </h2>
            </div>

            {/* Content */}
            <div className="mb-4 sm:mb-6">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                We use cookies to enhance your browsing experience, serve personalized content, 
                and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                You can customize your preferences or learn more in our{" "}
                <Link 
                  to="/cookie-policy" 
                  onClick={() => setShowConsent(false)}
                  className="text-brand-green hover:text-brand-green-dark underline"
                >
                  Cookie Policy
                </Link>
                .
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={handleRejectAll}
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium hover:bg-gray-50 transition-colors"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Reject All
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium hover:bg-gray-50 transition-colors"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 inline sm:mr-2" />
                <span className="hidden sm:inline">Customize</span>
                <span className="sm:hidden">Settings</span>
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-brand-green text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-medium hover:bg-brand-green-dark transition-colors"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          // Settings view
          <div className="p-4 sm:p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 
                className="text-lg sm:text-xl font-semibold text-gray-900"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Cookie Settings
              </h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Cookie Categories */}
            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
              {/* Necessary Cookies */}
              <div className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 
                    className="text-sm sm:text-base font-semibold text-gray-900"
                    style={{ fontFamily: '"League Spartan", sans-serif' }}
                  >
                    Necessary Cookies
                  </h3>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-brand-green" />
                    Always Active
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  These cookies are essential for the website to function properly. 
                  They cannot be disabled.
                </p>
              </div>

              {/* Analytics Cookies */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 
                    className="font-semibold text-gray-900"
                    style={{ fontFamily: '"League Spartan", sans-serif' }}
                  >
                    Analytics Cookies
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => handlePreferenceChange("analytics", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  These cookies help us understand how visitors interact with our website 
                  by collecting and reporting information anonymously.
                </p>
              </div>

              {/* Marketing Cookies */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 
                    className="font-semibold text-gray-900"
                    style={{ fontFamily: '"League Spartan", sans-serif' }}
                  >
                    Marketing Cookies
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => handlePreferenceChange("marketing", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  These cookies are used to track visitors across websites to display 
                  relevant and engaging advertisements.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSavePreferences}
                className="flex-1 px-6 py-3 bg-brand-green text-white rounded-xl font-medium hover:bg-brand-green-dark transition-colors"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieConsent;

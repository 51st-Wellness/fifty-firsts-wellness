import React from "react";
import { Link } from "react-router-dom";
import {
  Compass,
  Home,
  Search,
  BookOpen,
  Headphones,
  Video,
  Users,
  Heart,
  ArrowRight,
} from "lucide-react";

const NotFound: React.FC = () => {
  const quickLinks = [
    {
      title: "Home",
      description: "Return to our wellness hub",
      icon: <Home className="w-6 h-6" />,
      link: "/",
      color: "bg-blue-500",
    },
    {
      title: "Wellness Programmes",
      description: "Discover personalized wellness journeys",
      icon: <Users className="w-6 h-6" />,
      link: "/programmes",
      color: "bg-green-500",
    },
    {
      title: "Webineers",
      description: "Join interactive wellness sessions",
      icon: <Video className="w-6 h-6" />,
      link: "/resources/webinars",
      color: "bg-purple-500",
    },
    {
      title: "Podcasts",
      description: "Listen to wellness conversations",
      icon: <Headphones className="w-6 h-6" />,
      link: "/podcasts",
      color: "bg-orange-500",
    },
    {
      title: "Blog",
      description: "Read expert wellness insights",
      icon: <BookOpen className="w-6 h-6" />,
      link: "/blog",
      color: "bg-teal-500",
    },
    {
      title: "Contact Us",
      description: "Get support on your wellness journey",
      icon: <Heart className="w-6 h-6" />,
      link: "/contact",
      color: "bg-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50">
      <div className="py-16 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Compass className="w-32 h-32 text-blue-400 animate-spin-slow" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-bold text-blue-600">404</span>
              </div>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Lost on Your Wellness Journey?
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Don't worry - even the best explorers sometimes take a wrong turn.
            The page you're looking for might have moved, been renamed, or
            doesn't exist. Let's help you find your way back to wellness.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Continue Your Wellness Journey
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our wellness resources and find exactly what you need to
              support your health and well-being goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.link}
                className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-gray-200"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`${link.color} text-white p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {link.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {link.description}
                    </p>
                    <div className="flex items-center text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Wellness Quote */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
            <div className="flex justify-center mb-6">
              <Heart className="w-12 h-12 text-pink-500" />
            </div>
            <blockquote className="text-xl sm:text-2xl font-medium text-gray-800 mb-4">
              "Wellness is not a destination, it's a journey. Every step, even
              the detours, teach us something valuable about ourselves."
            </blockquote>
            <p className="text-gray-600 font-medium">
              - FiftyFirst Wellness Team
            </p>
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
            <Search className="w-8 h-8 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Still Can't Find What You're Looking For?
            </h3>
            <p className="mb-4 opacity-90">
              Our wellness experts are here to help guide you to the right
              resources.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <Heart className="w-4 h-4" />
              Get Personal Guidance
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

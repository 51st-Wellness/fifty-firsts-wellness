import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  XCircle,
  Mail,
  Send,
  CheckCircle,
  ArrowLeft,
  BookOpen,
  Headphones,
  Video,
  Users,
  MessageSquare,
} from "lucide-react";

const PaymentCancel: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    issue: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Feedback submitted: ", formData);
    setIsSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ email: "", issue: "", message: "" });
    }, 3000);
  };

  const products = [
    {
      title: "Webineers",
      description: "Interactive wellness webinars and workshops",
      icon: <Video className="w-8 h-8" />,
      link: "/resources/webinars",
      color: "bg-blue-500",
    },
    {
      title: "Podcasts",
      description: "Inspiring wellness conversations and insights",
      icon: <Headphones className="w-8 h-8" />,
      link: "/podcasts",
      color: "bg-purple-500",
    },
    {
      title: "Blog",
      description: "Expert articles on health and wellness",
      icon: <BookOpen className="w-8 h-8" />,
      link: "/blog",
      color: "bg-green-500",
    },
    {
      title: "Programmes",
      description: "Personalized wellness programs",
      icon: <Users className="w-8 h-8" />,
      link: "/programmes",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="py-16 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <XCircle className="w-20 h-20 text-red-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Subscription Unsuccessful
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We're sorry, but your subscription could not be processed at this
            time. This could be due to a payment issue, technical error, or
            other factors. Don't worry - we're here to help you get back on
            track with your wellness journey.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Home
          </Link>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Help Us Improve
              </h2>
            </div>
            <p className="text-gray-600 mb-8">
              We'd love to hear about what went wrong so we can fix it and
              prevent future issues. Your feedback helps us provide better
              service.
            </p>

            {isSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Thank You!
                </h3>
                <p className="text-gray-600">
                  We've received your feedback and will get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="issue"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    What went wrong? *
                  </label>
                  <select
                    id="issue"
                    name="issue"
                    value={formData.issue}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select an issue</option>
                    <option value="payment-declined">
                      Payment was declined
                    </option>
                    <option value="technical-error">
                      Technical error occurred
                    </option>
                    <option value="page-crashed">Page crashed or froze</option>
                    <option value="unclear-pricing">Pricing was unclear</option>
                    <option value="changed-mind">Changed my mind</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Additional Details
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Please provide any additional details that might help us understand what happened..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Feedback
                </button>
              </form>
            )}
          </div>

          {/* Explore Other Products */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Explore Our Other Wellness Resources
            </h2>
            <p className="text-gray-600 mb-8">
              While we work on resolving your subscription issue, why not
              explore our free and premium wellness resources? There's something
              for everyone on their wellness journey.
            </p>

            <div className="space-y-4">
              {products.map((product, index) => (
                <Link
                  key={index}
                  to={product.link}
                  className="block p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`${product.color} text-white p-3 rounded-lg group-hover:scale-110 transition-transform`}
                    >
                      {product.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                Need Immediate Help?
              </h3>
              <p className="text-blue-800 text-sm mb-3">
                Our support team is here to help you resolve any issues.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;

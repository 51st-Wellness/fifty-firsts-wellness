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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const PaymentCancel: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    issue: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIssueChange = (value: string) => {
    setFormData({ ...formData, issue: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.issue) {
      return;
    }
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
      icon: <Video className="w-4 h-4 sm:w-5 sm:h-5" />,
      link: "/resources/webinars",
    },
    {
      title: "Podcasts",
      description: "Inspiring wellness conversations and insights",
      icon: <Headphones className="w-4 h-4 sm:w-5 sm:h-5" />,
      link: "/podcasts",
    },
    {
      title: "Blog",
      description: "Expert articles on health and wellness",
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />,
      link: "/blog",
    },
    {
      title: "Programmes",
      description: "Personalized wellness programs",
      icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
      link: "/programmes",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center mb-4 sm:mb-6">
            <XCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-500" />
          </div>
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Payment Unsuccessful
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mb-6">
            We're sorry, but your payment could not be processed at this time.
            This could be due to a payment issue, technical error, or other
            factors. Don't worry - we're here to help you get back on track.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-brand-green hover:text-brand-green-dark text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Home
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-brand-green" />
              <h2
                className="text-xl sm:text-2xl font-semibold text-gray-900"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Help Us Improve
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-6">
              We'd love to hear about what went wrong so we can fix it and
              prevent future issues. Your feedback helps us provide better
              service.
            </p>

            {isSubmitted ? (
              <div className="text-center py-6 sm:py-8">
                <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-brand-green mx-auto mb-3 sm:mb-4" />
                <h3
                  className="text-lg sm:text-xl font-semibold text-gray-900 mb-2"
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
                >
                  Thank You!
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  We've received your feedback and will get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5"
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
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="issue"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5"
                  >
                    What went wrong? *
                  </label>
                  <Select
                    value={formData.issue}
                    onValueChange={handleIssueChange}
                  >
                    <SelectTrigger id="issue" className="w-full">
                      <SelectValue placeholder="Select an issue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="payment-declined">
                      Payment was declined
                      </SelectItem>
                      <SelectItem value="technical-error">
                      Technical error occurred
                      </SelectItem>
                      <SelectItem value="page-crashed">
                        Page crashed or froze
                      </SelectItem>
                      <SelectItem value="unclear-pricing">
                        Pricing was unclear
                      </SelectItem>
                      <SelectItem value="changed-mind">
                        Changed my mind
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Additional Details
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all resize-none"
                    placeholder="Please provide any additional details..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-green text-white py-2.5 px-5 rounded-full text-sm font-semibold hover:bg-brand-green-dark transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Feedback
                </button>
              </form>
            )}
          </div>

          {/* Explore Other Products */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6 lg:p-8">
            <h2
              className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-5"
              style={{ fontFamily: '"League Spartan", sans-serif' }}
            >
              Explore Our Wellness Resources
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mb-6">
              While we work on resolving your payment issue, why not explore our
              free and premium wellness resources?
            </p>

            <div className="space-y-3 sm:space-y-4">
              {products.map((product, index) => (
                <Link
                  key={index}
                  to={product.link}
                  className="block p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-brand-green hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="bg-brand-green text-white p-2 sm:p-2.5 rounded-lg group-hover:scale-105 transition-transform flex-shrink-0">
                      {product.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-sm sm:text-base font-semibold text-gray-900 mb-1 group-hover:text-brand-green transition-colors"
                        style={{ fontFamily: '"League Spartan", sans-serif' }}
                      >
                        {product.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6 sm:mt-8 p-4 bg-brand-green/5 rounded-xl border border-brand-green/20">
              <h3
                className="font-semibold text-gray-900 mb-2 text-sm sm:text-base"
                style={{ fontFamily: '"League Spartan", sans-serif' }}
              >
                Need Immediate Help?
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3">
                Our support team is here to help you resolve any issues.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold hover:bg-brand-green-dark transition-colors"
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

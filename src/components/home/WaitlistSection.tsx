import React, { useState } from "react";
import { Mail } from "lucide-react";
import { subscribeToWaitlist } from "@/api/contact-subscription.api";

const WaitlistSection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email address");
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await subscribeToWaitlist({ email });

      if (response.success) {
        setMessage(response.message);
        setIsSuccess(true);
        setEmail(""); // Clear the form
      } else {
        setMessage(response.message);
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again later.");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);

      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage("");
        setIsSuccess(false);
      }, 5000);
    }
  };
  return (
    <section className="w-full py-12 sm:py-16 bg-[#580F41]">
      <div
        className="max-w-7xl mx-auto px-4 rounded-3xl bg-no-repeat min-h-[320px] sm:min-h-[380px]"
        style={{
          backgroundImage: "url(/assets/homepage/waitlist-bg.svg)",
          backgroundSize: "250% 250%",
          backgroundPosition: "center",
        }}
      >
        <div className="py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-2 items-start gap-8 lg:gap-6">
          <div className="lg:mr-8">
            <h2
              className="text-white text-6xl sm:text-7xl lg:text-8xl font-normal"
              style={{ fontFamily: '"Lilita One", sans-serif' }}
            >
              Join Our
              <br />
              Product Waitlist!
            </h2>
          </div>

          <div className="relative mt-20 sm:mt-28 lg:ml-16">
            <div className="absolute -top-10 -left-2 sm:-top-12 sm:-left-4 w-20 sm:w-24 z-10">
              <img src="/assets/homepage/waitlist-icon.svg" alt="mail" />
            </div>

            <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-xl max-w-xl relative">
              <label className="block text-xs pt-5 text-gray-500 ml-1 mb-1"></label>
              {/* Small notification text */}
              <p className="text-xs text-gray-500 ml-1 mb-3">
                We'll notify you as soon as products are available.
              </p>

              {/* Success/Error Message */}
              {message && (
                <div
                  className={`mb-3 p-3 rounded-lg text-sm ${
                    isSuccess
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                  }`}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    placeholder="john.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent disabled:opacity-50"
                    required
                  />
                </div>
                <div className="flex justify-start">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-full bg-brand-green text-white px-6 py-3 font-semibold hover:bg-brand-green-dark transition-colors whitespace-nowrap mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Subscribing..." : "Subscribe"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaitlistSection;

import React from "react";
import {
  ShoppingCart,
  ArrowRight,
  Star,
  Play,
  Download,
  Mail,
} from "lucide-react";
import StarRating from "../components/StarRating";
// import family from "../assets/images/family.png";
import womanBreathing from "../assets/images/woman-breathing.jpg";
import serenity from "../assets/images/serenity.png";
import yoga from "../assets/images/yoga.png";
import screenshot from "../assets/images/screenshot.png";
import podcast from "../assets/images/podcast.png";
import comment from "../assets/images/comment.png";
import profilepic from "../assets/images/profilepic.png";
import diary from "../assets/images/diary.png";
import skincare from "../assets/images/skincare.png";
import bathtub from "../assets/images/bathtub.png";
import selflove from "../assets/images/selflove.png";
import jump from "../assets/images/jump.png";
import stretch from "../assets/images/stretch.png";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 via-white to-brand-purple/5"></div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-brand-green/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-brand-purple/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-brand-green/15 rounded-full blur-lg"></div>

        <div className="relative w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left">
              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight font-heading mb-6">
                <span className="block text-gray-900">Transform Your</span>
                <span className="block bg-gradient-to-r from-brand-green to-brand-green-light bg-clip-text text-transparent">
                  Wellness Journey
                </span>
                <span className="block text-gray-900">Today</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed font-primary max-w-2xl">
                Discover personalized wellness programs, expert guidance, and a
                supportive community designed to help you achieve your health
                and happiness goals.
              </p>

              {/* Key Benefits */}
              <div className="flex flex-wrap gap-4 mb-8 justify-center lg:justify-start">
                <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <div className="w-2 h-2 bg-brand-green rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Personalized Plans
                  </span>
                </div>
                <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <div className="w-2 h-2 bg-brand-purple rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Expert Guidance
                  </span>
                </div>
                <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <div className="w-2 h-2 bg-brand-green rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-gray-700">
                    24/7 Support
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  className="bg-brand-green text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-brand-green-dark transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-primary"
                  href="/signup"
                >
                  Start Your Journey
                  <ArrowRight className="inline ml-2" size={20} />
                </a>
              </div>
            </div>

            {/* Right Column - Visual Content */}
            <div className="relative">
              {/* Main Image with Overlay Elements */}
              <div className="relative">
                <img
                  src={womanBreathing}
                  alt="Wellness family"
                  className="w-full h-auto rounded-3xl shadow-2xl"
                />

                {/* Floating Cards */}
                <div className="absolute -top-4 -left-4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-brand-green/10 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-brand-green" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        5-Star Rating
                      </div>
                      <div className="text-xs text-gray-600">
                        From our community
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-brand-purple/10 rounded-full flex items-center justify-center">
                      <Download className="w-5 h-5 text-brand-purple" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        Free Guide
                      </div>
                      <div className="text-xs text-gray-600">
                        Wellness starter pack
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Decorative Elements */}
              <div className="absolute -z-10 top-8 right-8 w-32 h-32 bg-gradient-to-br from-brand-green/20 to-brand-purple/20 rounded-full blur-2xl"></div>
              <div className="absolute -z-10 bottom-8 left-8 w-24 h-24 bg-gradient-to-br from-brand-purple/20 to-brand-green/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Services Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our Services
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Get instant, personalized wellness tips, mindfulness routines, or
              healthy meal suggestions based on your needs and goals
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Personal Wellness */}
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Personal Wellness
                </h3>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Get instant, personalized wellness tips, mindfulness routines,
                  or healthy meal suggestions based on your needs and goals.
                </p>
                <button className="bg-brand-green text-white px-8 py-4 rounded-lg font-semibold hover:bg-brand-green-dark transition-colors shadow-lg">
                  See Programmes
                  <ArrowRight className="inline ml-2" size={20} />
                </button>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <img
                src={serenity}
                alt="Personal Wellness"
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </div>

            {/* Business Wellness */}
            <div className="order-3">
              <img
                src={yoga}
                alt="Business Wellness"
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </div>
            <div className="order-4">
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Business Wellness
                </h3>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Comprehensive wellness programs designed for organizations to
                  improve employee health, productivity, and workplace
                  satisfaction.
                </p>
                <button className="bg-brand-green text-white px-8 py-4 rounded-lg font-semibold hover:bg-brand-green-dark transition-colors shadow-lg">
                  See Programmes
                  <ArrowRight className="inline ml-2" size={20} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* AI Assistant */}
        <section className="py-20 bg-gradient-to-r from-brand-green/10 to-brand-purple/10 rounded-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Your Personal Wellness Assistant, Powered by{" "}
              <span className="bg-gradient-to-r from-brand-green to-brand-purple bg-clip-text text-transparent">
                AI
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Get instant, personalized wellness tips, mindfulness routines, or
              healthy meal suggestions based on your needs and goals.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <img
              src={screenshot}
              alt="AI Wellness Assistant"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
        </section>

        {/* Podcast Section */}
        <section className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Wellness Podcasts
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Listen to expert insights, guided meditations, and wellness
              discussions to support your journey.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <img
              src={podcast}
              alt="Wellness Podcasts"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What Our Community Says
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Words of praise from others about our presence and impact on their
              wellness journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Gabrielle Williams",
                role: "CEO, Mandilla Inc.",
                content:
                  "The wellness programs have transformed our workplace culture. Our team is more engaged and productive than ever before.",
              },
              {
                name: "Michael Chen",
                role: "HR Director, TechCorp",
                content:
                  "Exceptional service and personalized approach. The AI wellness assistant has been a game-changer for our employees.",
              },
              {
                name: "Sarah Johnson",
                role: "Wellness Coordinator",
                content:
                  "The comprehensive approach to wellness has helped our organization reduce stress and improve overall employee satisfaction.",
              },
              {
                name: "David Rodriguez",
                role: "Operations Manager",
                content:
                  "Outstanding support and resources. The wellness programs have significantly improved our team's mental health and productivity.",
              },
              {
                name: "Emily Davis",
                role: "HR Manager, StartupXYZ",
                content:
                  "Professional, effective, and transformative. The wellness solutions have created a positive impact on our company culture.",
              },
              {
                name: "James Wilson",
                role: "CEO, HealthTech Solutions",
                content:
                  "The personalized wellness approach has exceeded our expectations. Highly recommend for any organization serious about employee wellness.",
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={comment}
                    alt="Quote"
                    className="w-8 h-8 text-indigo-600"
                  />
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <img
                    src={profilepic}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Products */}
        <section className="py-20 bg-gray-50 rounded-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Featured Products
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our curated selection of wellness products designed to
              support your health and well-being journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[
              {
                img: diary,
                name: "Wellness Journal",
                price: 22.5,
                originalPrice: 32.5,
                discount: 14,
                rating: 4.5,
                reviews: 124,
              },
              {
                img: skincare,
                name: "Organic Skincare Set",
                price: 45.99,
                originalPrice: 59.99,
                discount: 23,
                rating: 4.8,
                reviews: 89,
              },
              {
                img: bathtub,
                name: "Relaxation Bath Kit",
                price: 28.75,
                originalPrice: 35.0,
                discount: 18,
                rating: 4.3,
                reviews: 156,
              },
              {
                img: diary,
                name: "Mindfulness Planner",
                price: 19.99,
                originalPrice: 24.99,
                discount: 20,
                rating: 4.7,
                reviews: 203,
              },
              {
                img: skincare,
                name: "Natural Face Mask",
                price: 15.5,
                originalPrice: 20.0,
                discount: 22,
                rating: 4.4,
                reviews: 78,
              },
              {
                img: bathtub,
                name: "Essential Oils Bundle",
                price: 34.99,
                originalPrice: 42.99,
                discount: 19,
                rating: 4.6,
                reviews: 142,
              },
              {
                img: diary,
                name: "Gratitude Journal",
                price: 18.75,
                originalPrice: 25.0,
                discount: 25,
                rating: 4.9,
                reviews: 267,
              },
              {
                img: skincare,
                name: "Herbal Tea Collection",
                price: 24.99,
                originalPrice: 29.99,
                discount: 17,
                rating: 4.2,
                reviews: 95,
              },
            ].map((product, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative mb-4">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{product.discount}%
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={product.rating} size="sm" />
                  <span className="text-sm text-gray-500">
                    ({product.reviews} reviews)
                  </span>
                </div>

                <button className="w-full bg-brand-green text-white py-3 px-4 rounded-lg font-semibold hover:bg-brand-green-dark transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Featured Blog Content
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Stay informed with our latest wellness insights, tips, and expert
              advice to support your health journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                img: jump,
                title:
                  "10 Innovative Workplace Wellness Tips: Unlocking Happiness at Work",
                excerpt:
                  "Discover practical and creative ways to boost morale, reduce stress, and create a happier, healthier work environment.",
                date: "March 4, 2025",
                tags: ["Wellness", "Mindfulness", "Workplace"],
              },
              {
                img: stretch,
                title:
                  "The Science of Stress Management: Evidence-Based Techniques",
                excerpt:
                  "Learn about the latest research on stress reduction and practical techniques you can implement today.",
                date: "March 1, 2025",
                tags: ["Stress", "Research", "Techniques"],
              },
              {
                img: selflove,
                title: "Building Self-Compassion: A Path to Mental Wellness",
                excerpt:
                  "Explore the transformative power of self-compassion and how it can improve your overall mental health and well-being.",
                date: "February 28, 2025",
                tags: ["Self-Care", "Mental Health", "Compassion"],
              },
            ].map((post, idx) => (
              <article
                key={idx}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 px-3 py-1 rounded-full">
                    {post.date}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button className="text-brand-green font-semibold hover:text-brand-green-dark transition-colors flex items-center gap-2">
                    Read More
                    <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gray-50"></div>
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 bg-brand-green rounded-full"></div>
            <div className="absolute top-20 right-20 w-24 h-24 bg-brand-purple rounded-full"></div>
            <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-brand-green rounded-full"></div>
            <div className="absolute bottom-10 right-1/3 w-28 h-28 bg-brand-purple rounded-full"></div>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Header with accent */}
              <div className="relative bg-brand-green px-8 py-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                <div className="relative text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4">
                    <Mail size={16} className="mr-2" />
                    Newsletter
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 font-heading">
                    Join Our Wellness Community
                  </h2>
                  <p className="text-lg text-white/90 max-w-2xl mx-auto">
                    Get exclusive wellness insights, expert tips, and community
                    updates delivered to your inbox.
                  </p>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* Left Side - Benefits */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900 font-heading mb-6">
                      What You'll Get:
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-brand-green/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 font-primary">
                            Weekly Wellness Tips
                          </h4>
                          <p className="text-gray-600 text-sm font-primary">
                            Expert advice from our wellness professionals
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-brand-purple/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-brand-purple rounded-full"></div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 font-primary">
                            Exclusive Content
                          </h4>
                          <p className="text-gray-600 text-sm font-primary">
                            Access to member-only resources and guides
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-brand-green/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 font-primary">
                            Community Updates
                          </h4>
                          <p className="text-gray-600 text-sm font-primary">
                            Stay connected with our wellness community
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Form */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 font-heading">
                      Ready to Get Started?
                    </h3>
                    <form className="space-y-4">
                      <div>
                        <label
                          htmlFor="newsletter-email"
                          className="block text-sm font-medium text-gray-700 mb-2 font-primary"
                        >
                          Email Address
                        </label>
                        <input
                          id="newsletter-email"
                          type="email"
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-colors font-primary"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="newsletter-name"
                          className="block text-sm font-medium text-gray-700 mb-2 font-primary"
                        >
                          First Name (Optional)
                        </label>
                        <input
                          id="newsletter-name"
                          type="text"
                          placeholder="Your first name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-colors font-primary"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-brand-green text-white py-3 px-6 rounded-lg font-semibold hover:bg-brand-green-dark transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-primary"
                      >
                        Join Our Community
                        <ArrowRight className="inline ml-2" size={18} />
                      </button>
                    </form>
                    <p className="text-xs text-gray-500 mt-4 text-center font-primary">
                      We respect your privacy. Unsubscribe at any time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
};

export default Home;

import React from "react";
import Hero from "../components/home/Hero";
import AboutSection from "../components/home/AboutSection";
import ServicesSection from "../components/home/ServicesSection";
import FeaturedSection from "../components/home/FeaturedSection";
import WaitlistSection from "../components/home/WaitlistSection";
import BlogSection from "../components/home/BlogSection";
import TeamSection from "../components/home/TeamSection";
import PodcastSection from "../components/home/PodcastSection";
import FAQSection from "../components/home/FAQSection";

// Home page landing component
const Home: React.FC = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Hero />
      <AboutSection />
      <ServicesSection />
      <FeaturedSection />
      <WaitlistSection />
      <BlogSection />
      <TeamSection />
      <PodcastSection />
      <FAQSection />
    </main>
  );
};

export default Home;

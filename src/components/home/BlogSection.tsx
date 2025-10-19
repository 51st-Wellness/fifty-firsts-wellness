import React from "react";
import { Link } from "react-router-dom";

type BlogCardProps = {
  imageSrc: string;
  title: string;
  excerpt: string;
  to: string;
};

const BlogCard: React.FC<BlogCardProps> = ({ imageSrc, title, excerpt, to }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col items-center text-center border border-gray-100">
      <div className="w-full overflow-hidden rounded-2xl">
        <img src={imageSrc} alt={title} className="w-full h-72 sm:h-80 object-cover" />
      </div>
      <h3
        className="mt-6 text-xl sm:text-2xl font-semibold text-gray-900 leading-snug"
        style={{ fontFamily: '"League Spartan", sans-serif' }}
      >
        {title}
      </h3>
      <p className="mt-4 text-sm sm:text-base text-gray-600 leading-7">
        {excerpt}
      </p>
      <Link
        to={to}
        className="mt-6 inline-block bg-brand-green text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-brand-green-dark transition-colors"
      >
        Read More
      </Link>
    </div>
  );
};

const BlogSection: React.FC = () => {
  return (
    <section
      className="w-full py-40 lg:py-52 min-h-[1100px] lg:min-h-[1400px] bg-no-repeat"
      style={{
        backgroundImage: "url(/assets/homepage/blog-bg.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-40">
        <div className="text-center mb-12 lg:mb-16">
          <h2
            className="text-3xl sm:text-4xl font-normal text-white"
            style={{ fontFamily: '"Lilita One", sans-serif' }}
          >
            Read Our Blog
          </h2>
          <div className="w-16 h-1 bg-brand-green mx-auto rounded-full mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-8 lg:mt-12">
          <BlogCard
            imageSrc="/assets/homepage/blog/blog-1.svg"
            title="5 Ways to Look Younger Than Ever"
            excerpt="This wellness brand empowers healthier living through nutrition, wellness, and quality supplements designed to support your everyday lifestyle."
            to="/blog"
          />
          <BlogCard
            imageSrc="/assets/homepage/blog/blog-2.svg"
            title="10 Whole Foods for a Healthy Gut"
            excerpt="This wellness brand empowers healthier living through nutrition, wellness, and quality supplements designed to support your everyday lifestyle."
            to="/blog"
          />
          <BlogCard
            imageSrc="/assets/homepage/blog/blog-3.svg"
            title="5 Smoothie Recipes for Better Sleep"
            excerpt="This wellness brand empowers healthier living through nutrition, wellness, and quality supplements designed to support your everyday lifestyle."
            to="/blog"
          />
        </div>
      </div>
    </section>
  );
};

export default BlogSection;



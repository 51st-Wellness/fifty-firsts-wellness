import React from "react";
import { ShoppingCart, Heart } from "lucide-react";

type FeaturedCard = {
  title: string;
  price: string;
  oldPrice?: string;
};

const cards: FeaturedCard[] = [
  { title: "Wellness Journal/Planner", price: "$22.50", oldPrice: "$32.50" },
  { title: "Eye Mask Sleep Support Bundle by Bundle", price: "$22.50", oldPrice: "$32.50" },
  { title: "Aromatherapy Diffuser + Essential Oils", price: "$22.50", oldPrice: "$32.50" },
  { title: "Eye Mask Sleep Support Bundle by Bundle", price: "$22.50", oldPrice: "$32.50" },
];

const FeaturedSection: React.FC = () => {
  return (
    <section className="relative z-0 w-full pt-48 sm:pt-56 pb-24 sm:pb-28 bg-[#580F41]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2
            className="text-white text-3xl sm:text-4xl font-normal"
            style={{ fontFamily: '"Lilita One", sans-serif' }}
          >
            Featured Products
          </h2>
          <div className="w-16 h-1 bg-brand-green mx-auto mt-2 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cards.map((c, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md p-3">
              <div className="relative w-full h-40 sm:h-44 bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src="/assets/homepage/featured-cards/featured-placeholder.svg"
                  alt={c.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow">
                  <Heart className="w-4 h-4 text-gray-700" />
                </div>
              </div>
              <div className="p-4 flex flex-col">
                <h3 className="text-base font-normal text-gray-900 leading-snug line-clamp-2 font-primary min-h-[44px]">
                  {c.title}
                </h3>
                <div className="mt-4 flex items-center justify-between min-h-[28px]">
                  <span className="text-2xl font-semibold text-gray-900">{c.price}</span>
                  <div className="flex items-center gap-2">
                    {c.oldPrice && (
                      <span className="text-gray-500 line-through text-sm">{c.oldPrice}</span>
                    )}
                    <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
                      -14%
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 min-h-[20px]">
                  {/* Simple star rating visuals */}
                  <span className="text-yellow-400">★★★★</span>
                  <span className="text-gray-500">(124 reviews)</span>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-brand-green-dark transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;



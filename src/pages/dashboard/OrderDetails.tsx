import React from "react";
import { CheckCircle } from "lucide-react";

const OrderDetails: React.FC = () => {
  return (
    <div className="">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <h2
          className="text-2xl font-semibold text-gray-900"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          Order Summary
        </h2>
        <div className="mt-3 flex items-center gap-3 text-sm text-gray-600">
          <span>Order No: 236736821991</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
            Delivered
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">29 July, 2025 18:00:21</p>
      </div>

      {/* Items */}
      <div className="py-4 space-y-3">
        <p className="text-sm text-gray-600 mb-2">Items in your order</p>

        {[{
          name: 'Mandi Face Masks and Scrubs',
          price: '$14.99',
          img: '/assets/marketplace/mandi-face-masks.jpg',
          category: 'Natural Skincare & Beauty',
        }, {
          name: 'Afrilet Multivitamin',
          price: '$79.99',
          img: '/assets/marketplace/afrilet-multivitamin.jpg',
          category: 'Tea & Supplements',
        }, {
          name: 'Afrilet Multivitamin',
          price: '$9.50',
          img: '/assets/marketplace/chara-lip-balm.jpg',
          category: 'Tea & Supplements',
        }].map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 bg-white rounded-xl  p-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
              <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900" style={{ fontFamily: '"League Spartan", sans-serif' }}>{item.name}</h3>
              <p className="text-xs text-gray-500">Category: {item.category}</p>
              <p className="text-xs text-gray-500">Quantity: 1</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">{item.price}</p>
              <button className="mt-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-green text-white hover:bg-brand-green-dark">Buy Again</button>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="pb-6">
        <div className="bg-white rounded-xl ">
          <div className="p-4 grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-gray-600">Item’s total (4)</span>
            <span className="text-right text-gray-900">$248.99</span>
            <span className="text-gray-600">Shipping</span>
            <span className="text-right text-gray-900">$8.99</span>
            <span className="text-gray-600">Discount</span>
            <span className="text-right text-gray-900">$0.99</span>
            <div className="col-span-2 border-t border-gray-200 my-2" />
            <span className="text-gray-900 font-semibold">Total</span>
            <span className="text-right text-gray-900 font-semibold">$257.99</span>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="pb-6">
        <div className="bg-white rounded-xl  p-4">
          <p className="text-sm text-gray-700 mb-2">Shipping Address</p>
          <p className="text-sm text-gray-600">12, Tafawa Balewa Avenue, Igando, Lekki, Lagos</p>
          <p className="text-sm text-gray-600">+234 9082947920</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;



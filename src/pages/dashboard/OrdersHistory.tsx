import React, { useState } from "react";
import { Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrdersHistory: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const navigate = useNavigate();

  const filters = ["All", "Delivered", "Cancelled", "Ongoing"];

  const orders = [
    {
      id: "236736821991",
      productName: "Mandi Face Masks and Scrubs",
      productImage: "/assets/marketplace/mandi-face-masks.jpg",
      date: "29 July, 2025 18:00:21",
      status: "Delivered",
      statusColor: "bg-green-100 text-green-800"
    },
    {
      id: "236736821991",
      productName: "Afrilet Multivitamin",
      productImage: "/assets/marketplace/afrilet-multivitamin.jpg",
      date: "29 July, 2025 18:00:21",
      status: "Cancelled - Payment Unsuccessful",
      statusColor: "bg-red-100 text-red-800"
    },
    {
      id: "236736821991",
      productName: "Chara Lip Balm",
      productImage: "/assets/marketplace/chara-lip-balm.jpg",
      date: "29 July, 2025 18:00:21",
      status: "Delivery in progress",
      statusColor: "bg-orange-100 text-orange-800"
    },
    {
      id: "236736821991",
      productName: "Mandi Face Masks and Scrubs",
      productImage: "/assets/marketplace/mandi-face-masks-2.jpg",
      date: "29 July, 2025 18:00:21",
      status: "Delivered",
      statusColor: "bg-green-100 text-green-800"
    },
    {
      id: "236736821991",
      productName: "Chara Lip Balm",
      productImage: "/assets/marketplace/chara-lip-balm-2.jpg",
      date: "29 July, 2025 18:00:21",
      status: "Delivered",
      statusColor: "bg-green-100 text-green-800"
    }
  ];

  const getStatusFilter = (status: string) => {
    if (status === "All") return orders;
    if (status === "Delivered") return orders.filter(order => order.status === "Delivered");
    if (status === "Cancelled") return orders.filter(order => order.status.includes("Cancelled"));
    if (status === "Ongoing") return orders.filter(order => order.status === "Delivery in progress");
    return orders;
  };

  const filteredOrders = getStatusFilter(activeFilter);

  return (
    <div className="rounded-lg">
      <div className="border-b border-gray-200">
        <h2 
          className="text-2xl font-semibold text-gray-900 mb-6"
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          Orders History
        </h2>
        
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-2 rounded-full">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? "text-brand-green border border-brand-green"
                  : " text-gray-600  border border-transparent"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      <div className="pt-4">
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => (
              <div
                key={index}
                onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                className="relative flex items-center gap-4 p-4 bg-white rounded-xl hover:bg-brand-green/3 transition-colors border border-gray-100 cursor-pointer"
              >
                {/* See Details Link - top right on desktop */}
                <div className="hidden md:block absolute top-4 right-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/orders/${order.id}`);
                    }}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-brand-green"
                  >
                    See Details
                  </button>
                </div>
                {/* Product Image */}
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                  <img
                    src={order.productImage}
                    alt={order.productName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="w-full h-full bg-gray-200 items-center justify-center hidden">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 
                    className="text-base font-medium text-gray-900 truncate"
                    style={{ fontFamily: '"League Spartan", sans-serif' }}
                  >
                    {order.productName}
                  </h3>
                  <div className="text-xs text-gray-500 mb-2">
                    <p>Order {order.id}</p>
                    <p>{order.date}</p>
                  </div>
                  
                  {/* Status Badge - Now under product details */}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.statusColor}`}>
                    {order.status}
                  </span>
                </div>

                {/* See Details Link - hidden on mobile, handled above for md+ */}
                <div className="flex-shrink-0 md:hidden" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersHistory;


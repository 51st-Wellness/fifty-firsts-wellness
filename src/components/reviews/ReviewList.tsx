import React from "react";

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const ReviewList: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
  if (reviews.length === 0) {
    return <p className="text-sm text-gray-600">No reviews yet.</p>;
  }
  return (
    <ul className="space-y-4">
      {reviews.map((r) => (
        <li key={r.id} className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-gray-900">{r.author}</span>
            <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="text-yellow-500 text-sm mb-2">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
          <p className="text-sm text-gray-700">{r.comment}</p>
        </li>
      ))}
    </ul>
  );
};

export default ReviewList;



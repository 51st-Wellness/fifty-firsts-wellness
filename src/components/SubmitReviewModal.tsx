import React, { useState } from "react";
import { X, Star } from "lucide-react";
import { createReview } from "../api/review.api";
import toast from "react-hot-toast";

interface SubmitReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productId: string;
  orderItemId?: string;
  onSubmit?: (review: { rating: number; comment: string }) => void;
}

const SubmitReviewModal: React.FC<SubmitReviewModalProps> = ({
  isOpen,
  onClose,
  productName,
  productId,
  orderItemId,
  onSubmit,
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderItemId) {
      toast.error("Order item ID is required");
      return;
    }

    setSubmitting(true);
    try {
      await createReview(productId, orderItemId, { rating, comment });
      toast.success(
        "Review submitted successfully! It will be visible after approval."
      );
      onSubmit?.({ rating, comment });
      setComment("");
      setRating(5);
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md mx-4 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3
            className="text-xl font-semibold text-gray-900"
            style={{ fontFamily: '"League Spartan", sans-serif' }}
          >
            Submit Review
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product: {productName}
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
              placeholder="Share your thoughts about this product..."
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="flex-1 px-4 py-2 bg-brand-green text-white rounded-full font-semibold hover:bg-brand-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitReviewModal;

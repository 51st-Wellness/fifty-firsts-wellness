import React, { useState } from "react";

interface ReviewFormProps {
  onSubmit?: (data: { rating: number; comment: string }) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    onSubmit?.({ rating, comment });
    setSubmitting(false);
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm text-gray-700 mb-1">Rating</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border rounded-lg px-3 py-2">
          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} stars</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-700 mb-1">Comment</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} className="w-full border rounded-lg px-3 py-2" placeholder="Share your thoughts" />
      </div>
      <button disabled={submitting} className="px-6 py-2 rounded-full bg-brand-green hover:bg-brand-green-dark text-white font-semibold">
        {submitting ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
};

export default ReviewForm;



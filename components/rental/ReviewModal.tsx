/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Star, MessageSquare, Loader2 } from "lucide-react";

interface ReviewModalProps {
  propertyId: string;
  rentalRequestId: string;
  propertyTitle?: string;
  onSuccess?: () => void;
}

export const ReviewModal = ({
  propertyId,
  rentalRequestId,
  propertyTitle,
  onSuccess,
}: ReviewModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.reviews.create({
        propertyId,
        rentalRequestId,
        rating,
        comment: comment.trim() || undefined,
      });
      toast.success("Thank you! Your review has been submitted.");
      setIsOpen(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-medium hover:bg-muted transition-colors text-foreground"
      >
        <Star size={14} className="text-amber-500 fill-amber-500" /> Review
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold font-outfit text-foreground">
                  Write a Review
                </h2>
                {propertyTitle && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-70">
                    {propertyTitle}
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = star <= (hoverRating || rating);
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star
                          size={28}
                          className={
                            active
                              ? "text-amber-500 fill-amber-500"
                              : "text-muted-foreground/30"
                          }
                        />
                      </button>
                    );
                  })}
                  <span className="ml-2 text-sm font-semibold text-foreground">
                    {hoverRating || rating} / 5
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
                  <MessageSquare size={14} /> Comment (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Share your experience staying at this property..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-foreground font-medium hover:bg-muted text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />{" "}
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

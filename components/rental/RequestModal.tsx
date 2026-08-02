/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
  Calendar as CalendarIcon,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { rentalRequestSchema } from "@/lib/validations";

export function RequestModal({ propertyId }: { propertyId: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [moveInDate, setMoveInDate] = useState("");
  const [duration, setDuration] = useState("12");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (user.role !== "TENANT") {
      toast.error("Only tenants can request properties.");
      return;
    }

    // Zod validation
    const validationResult = rentalRequestSchema.safeParse({
      moveInDate,
      duration,
      message: message.trim() || undefined,
    });

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setLoading(true);
      await api.rentals.create({
        propertyId,
        moveInDate: new Date(moveInDate).toISOString(),
        duration: parseInt(duration),
        message: message.trim() || undefined,
      });
      toast.success("Rental request submitted successfully!");
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          if (!user) router.push("/auth/login");
          else setIsOpen(true);
        }}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all"
      >
        Request to Rent
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-bold">Rental Request</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
              <div>
                <label className="block text-sm font-medium mb-1.5  items-center gap-2">
                  <CalendarIcon size={14} /> Move-in Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full px-4 py-2 rounded-xl border bg-background focus:outline-none focus:ring-2 ${
                    errors.moveInDate
                      ? "border-destructive focus:ring-destructive/20"
                      : "border-border focus:ring-primary/20"
                  }`}
                  value={moveInDate}
                  onChange={(e) => {
                    setMoveInDate(e.target.value);
                    if (errors.moveInDate)
                      setErrors((prev) => ({ ...prev, moveInDate: "" }));
                  }}
                />
                {errors.moveInDate && (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.moveInDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Duration (Months)
                </label>
                <select
                  className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option value="6">6 Months</option>
                  <option value="12">12 Months (1 Year)</option>
                  <option value="24">24 Months (2 Years)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5  items-center gap-2">
                  <MessageSquare size={14} /> Message to Landlord (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Introduce yourself or ask questions..."
                  className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

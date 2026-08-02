/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { RentalRequest } from "@/types";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "../shared/StatusBadge";
import { Check, X, FileText } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const LandlordRequestsTable = ({
  requests,
  onStatusChange,
}: {
  requests: RentalRequest[];
  onStatusChange?: () => void;
}) => {
  const [processingId, setProcessingId] = useState<string | null>(null);

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card border border-border rounded-xl text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileText size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold text-foreground">No requests found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          There are no rental requests matching this filter.
        </p>
      </div>
    );
  }

  const handleUpdateStatus = async (
    id: string,
    status: "APPROVED" | "REJECTED",
  ) => {
    try {
      setProcessingId(id);
      await api.rentals.updateStatus(id, status);
      toast.success(`Request ${status.toLowerCase()} successfully`);
      if (onStatusChange) onStatusChange();
    } catch (error: any) {
      toast.error(error.message || "Failed to update request");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {[
                "Tenant",
                "Property",
                "Move-in",
                "Duration",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-5 py-4 font-semibold text-xs uppercase tracking-wide text-muted-foreground"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr
                key={req.id}
                className="border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-bold text-primary">
                        {req.tenant?.name?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {req.tenant?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {req.tenant?.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium text-foreground max-w-37.5 truncate">
                    {req.property?.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {req.property?.city}
                  </p>
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {formatDate(req.moveInDate)}
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {req.duration} mo
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={req.status} />
                </td>
                <td className="px-5 py-4">
                  {req.status === "PENDING" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateStatus(req.id, "APPROVED")}
                        disabled={processingId === req.id}
                        className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                        title="Approve"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(req.id, "REJECTED")}
                        disabled={processingId === req.id}
                        className="p-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                        title="Reject"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

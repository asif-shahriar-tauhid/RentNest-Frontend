/* eslint-disable react/no-unescaped-entities */
"use client";

import { RentalRequest } from "@/types";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "../shared/StatusBadge";
import Link from "next/link";
import { CreditCard, Home } from "lucide-react";
import { ReviewModal } from "./ReviewModal";

export const RequestsTable = ({ requests }: { requests: RentalRequest[] }) => {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card border border-border rounded-xl text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Home size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold text-foreground">No requests found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          You haven't made any rental requests yet. Start exploring properties
          to find your next home.
        </p>
        <Link
          href="/properties"
          className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90"
        >
          Browse Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {[
                "Property",
                "Move-in Date",
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
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-muted">
                      {req.property?.images &&
                        req.property.images.length > 0 && (
                          <img
                            src={req.property.images[0]}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground max-w-50 truncate">
                        {req.property?.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {req.property?.city}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {formatDate(req.moveInDate)}
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {req.duration} months
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={req.status} />
                </td>
                <td className="px-5 py-4">
                  {req.status === "APPROVED" && (
                    <Link
                      href={`/dashboard/tenant/requests/${req.id}/pay`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90"
                    >
                      <CreditCard size={14} /> Pay Now
                    </Link>
                  )}
                  {req.status === "ACTIVE" || req.status === "COMPLETED" ? (
                    <ReviewModal
                      propertyId={req.propertyId}
                      rentalRequestId={req.id}
                      propertyTitle={req.property?.title}
                    />
                  ) : null}
                  {req.status !== "APPROVED" &&
                    req.status !== "ACTIVE" &&
                    req.status !== "COMPLETED" && (
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

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { RentalRequest, Payment } from "@/types";
import { StatsCard } from "@/components/shared/StatsCard";
import { RequestsTable } from "@/components/rental/RequestsTable";
import { ProfileTab } from "@/components/shared/ProfileTab";
import { FileText, CheckCircle, Home, CreditCard } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DashboardOverviewSkeleton } from "@/components/shared/DashboardSkeleton";

const TenantDashboardContent = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "overview";

  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (tab === "overview" || tab === "requests") {
          const res: any = await api.rentals.getAll();
          const list = Array.isArray(res)
            ? res
            : res?.rentals || res?.requests || res?.data || [];
          setRequests(list);
        }
        if (tab === "overview" || tab === "payments") {
          const res: any = await api.payments.getAll();
          const list = Array.isArray(res)
            ? res
            : res?.payments || res?.data || [];
          setPayments(list);
        }
      } catch (error) {
        console.error("Failed to fetch tenant data", error);
        setRequests([]);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === "TENANT") {
      fetchData();
    }
  }, [user, tab]);

  if (!user || user.role !== "TENANT") return null;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-outfit text-foreground">
            Welcome, {user.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your rentals today.
          </p>
        </div>
        <DashboardOverviewSkeleton />
      </div>
    );
  }

  // Calculate stats safely
  const safeRequests = Array.isArray(requests) ? requests : [];
  const safePayments = Array.isArray(payments) ? payments : [];

  const activeRentals = safeRequests.filter(
    (r) => r.status === "ACTIVE",
  ).length;
  const pendingRequests = safeRequests.filter(
    (r) => r.status === "PENDING",
  ).length;
  const approvedRequests = safeRequests.filter(
    (r) => r.status === "APPROVED",
  ).length;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-outfit text-foreground">
          Welcome, {user.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your rentals today.
        </p>
      </div>

      {tab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              label="Active Rentals"
              value={activeRentals}
              icon={Home}
              accent
            />
            <StatsCard
              label="Pending Requests"
              value={pendingRequests}
              icon={FileText}
            />
            <StatsCard
              label="Approved to Pay"
              value={approvedRequests}
              icon={CheckCircle}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">
                Recent Requests
              </h2>
            </div>
            <RequestsTable requests={safeRequests.slice(0, 5)} />
          </div>
        </div>
      )}

      {tab === "requests" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground">My Requests</h2>
          <RequestsTable requests={safeRequests} />
        </div>
      )}

      {tab === "payments" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground">Payment History</h2>

          {safePayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-card border border-border rounded-xl text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <CreditCard size={24} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                No payments found
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                You haven't made any payments yet.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-border overflow-hidden bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {[
                        "Transaction ID",
                        "Property",
                        "Amount",
                        "Date",
                        "Status",
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
                    {safePayments.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors"
                      >
                        <td className="px-5 py-4 font-mono text-xs">
                          {p.transactionId || p.id}
                        </td>
                        <td className="px-5 py-4 font-medium text-foreground">
                          {p.rentalRequest?.property?.title || "N/A"}
                        </td>
                        <td className="px-5 py-4 font-medium">
                          {formatCurrency(p.amount)}
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">
                          {formatDate(p.createdAt)}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={p.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "profile" && <ProfileTab user={user} />}
    </div>
  );
}

const TenantDashboard = () => {
  return (
    <Suspense fallback={<DashboardOverviewSkeleton />}>
      <TenantDashboardContent />
    </Suspense>
  );
};

export default TenantDashboard;

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { Property, RentalRequest } from "@/types";
import { StatsCard } from "@/components/shared/StatsCard";
import { LandlordRequestsTable } from "@/components/rental/LandlordRequestsTable";
import { ProfileTab } from "@/components/shared/ProfileTab";
import { Building2, FileText, CheckCircle } from "lucide-react";
import PropertyCard from "@/components/property/PropertyCard";
import { AddPropertyModal } from "@/components/property/AddPropertyModal";
import { EditPropertyModal } from "@/components/property/EditPropertyModal";
import { DashboardOverviewSkeleton } from "@/components/shared/DashboardSkeleton";

const LandlordDashboardContent = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "overview";

  const [properties, setProperties] = useState<Property[]>([]);
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [propsRes, rentalsRes]: [any, any] = await Promise.all([
        api.properties
          .getAll(`landlordId=${user.id}&status=ALL&limit=100`)
          .catch(() => []),
        api.rentals.getAll().catch(() => []),
      ]);

      let listProps = Array.isArray(propsRes)
        ? propsRes
        : propsRes?.properties || propsRes?.data || [];

      // If landlordId query returned empty list, fallback to fetching all properties and filtering locally
      if (listProps.length === 0) {
        const allPropsRes: any = await api.properties
          .getAll("status=ALL&limit=100")
          .catch(() => []);
        const allList = Array.isArray(allPropsRes)
          ? allPropsRes
          : allPropsRes?.properties || allPropsRes?.data || [];
        listProps = allList.filter(
          (p: any) => p.landlordId === user.id || p.landlord?.id === user.id,
        );
      }

      const listRentals = Array.isArray(rentalsRes)
        ? rentalsRes
        : rentalsRes?.rentals || rentalsRes?.requests || rentalsRes?.data || [];
      setProperties(listProps);
      setRequests(listRentals);
    } catch (error) {
      console.error("Failed to fetch landlord data", error);
      setProperties([]);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "LANDLORD") {
      fetchData();
    }
  }, [user, tab]);

  if (!user || user.role !== "LANDLORD") return null;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-outfit text-foreground">
            Landlord Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your properties and review incoming rental requests.
          </p>
        </div>
        <DashboardOverviewSkeleton />
      </div>
    );
  }

  // Calculate safe arrays
  const safeProperties = Array.isArray(properties) ? properties : [];
  const safeRequests = Array.isArray(requests) ? requests : [];

  const totalProperties = safeProperties.length;
  const pendingRequests = safeRequests.filter(
    (r) => r.status === "PENDING",
  ).length;
  const activeRentals = safeRequests.filter(
    (r) => r.status === "ACTIVE",
  ).length;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-outfit text-foreground">
          Landlord Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your properties and review incoming rental requests.
        </p>
      </div>

      {tab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              label="Total Properties"
              value={totalProperties}
              icon={Building2}
              accent
            />
            <StatsCard
              label="Pending Requests"
              value={pendingRequests}
              icon={FileText}
            />
            <StatsCard
              label="Active Rentals"
              value={activeRentals}
              icon={CheckCircle}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">
                Recent Rental Requests
              </h2>
            </div>
            <LandlordRequestsTable requests={safeRequests.slice(0, 5)} onStatusChange={fetchData} />
          </div>
        </div>
      )}

      {tab === "properties" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">My Properties</h2>
            <AddPropertyModal onSuccess={fetchData} />
          </div>

          {safeProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-card border border-border rounded-xl text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Building2 size={24} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                No properties yet
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Start by adding your first property listing.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {safeProperties.map((p) => {
                const isRented =
                  p.status?.toUpperCase() === "RENTED" ||
                  safeRequests.some(
                    (r) =>
                      (r.propertyId === p.id || r.property?.id === p.id) &&
                      (r.status === "ACTIVE" ||
                        r.status === "APPROVED" ||
                        r.status === "COMPLETED"),
                  );

                return (
                  <div key={p.id} className="relative group space-y-2">
                    <PropertyCard
                      property={{
                        ...p,
                        status: isRented ? "RENTED" : p.status,
                      }}
                    />
                    <div className="flex justify-end">
                      <EditPropertyModal property={p} onSuccess={fetchData} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === "requests" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground">All Requests</h2>
          <LandlordRequestsTable requests={safeRequests} onStatusChange={fetchData} />
        </div>
      )}

      {tab === "profile" && <ProfileTab user={user} />}
    </div>
  );
};

const LandlordDashboard = () => {
  return (
    <Suspense fallback={<DashboardOverviewSkeleton />}>
      <LandlordDashboardContent />
    </Suspense>
  );
};

export default LandlordDashboard;

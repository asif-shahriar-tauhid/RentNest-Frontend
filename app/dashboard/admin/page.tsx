/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { Property, RentalRequest, User } from "@/types";
import { StatsCard } from "@/components/shared/StatsCard";
import { ProfileTab } from "@/components/shared/ProfileTab";
import {
  Building2,
  FileText,
  Users,
  Loader2,
  UserCheck,
  UserX,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PropertyCard from "@/components/property/PropertyCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { DashboardOverviewSkeleton } from "@/components/shared/DashboardSkeleton";

function AdminDashboardContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "overview";

  const [properties, setProperties] = useState<Property[]>([]);
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // User Management Search & Pagination State
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<
    "ALL" | "TENANT" | "LANDLORD" | "ADMIN"
  >("ALL");
  const [userPage, setUserPage] = useState(1);
  const USERS_PER_PAGE = 8;

  const fetchData = async () => {
    try {
      setLoading(true);
      if (tab === "overview" || tab === "users") {
        const res: any = await api.admin.getUsers();
        const list = Array.isArray(res) ? res : res?.users || res?.data || [];
        setUsers(list);
      }
      if (tab === "overview" || tab === "properties") {
        const res: any = await api.admin.getProperties();
        const list = Array.isArray(res)
          ? res
          : res?.properties || res?.data || [];
        setProperties(list);
      }
      if (tab === "overview" || tab === "requests") {
        const res: any = await api.admin.getRentals();
        const list = Array.isArray(res)
          ? res
          : res?.rentals || res?.requests || res?.data || [];
        setRequests(list);
      }
    } catch (error) {
      console.error("Failed to fetch admin data", error);
      setUsers([]);
      setProperties([]);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "ADMIN") {
      fetchData();
    }
  }, [user, tab]);

  if (!user || user.role !== "ADMIN") return null;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-outfit text-foreground">
            Platform Administration
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage users, properties, and monitor platform activity.
          </p>
        </div>
        <DashboardOverviewSkeleton />
      </div>
    );
  }

  const handleUpdateUserStatus = async (
    id: string,
    status: "ACTIVE" | "BANNED",
  ) => {
    setActionLoadingId(id);
    // Optimistically update local users array
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    try {
      await api.admin.updateUserStatus(id, status);
      toast.success(`User status updated to ${status}`);
    } catch (error: any) {
      // Revert on error
      const originalStatus = status === "ACTIVE" ? "BANNED" : "ACTIVE";
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: originalStatus } : u)),
      );
      toast.error(error.message || "Failed to update user status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    try {
      await api.properties.delete(id);
      toast.success("Property deleted");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete property");
    }
  };

  // Calculate stats safely
  const safeUsers = Array.isArray(users) ? users : [];
  const safeProperties = Array.isArray(properties) ? properties : [];
  const safeRequests = Array.isArray(requests) ? requests : [];

  // User Filtering & Pagination Logic
  const filteredUsers = safeUsers.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearchQuery.toLowerCase());
    const matchesRole = userRoleFilter === "ALL" || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const totalUserPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE) || 1;
  const paginatedUsers = filteredUsers.slice(
    (userPage - 1) * USERS_PER_PAGE,
    userPage * USERS_PER_PAGE,
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-outfit text-foreground">
          Platform Administration
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage users, properties, and monitor platform activity.
        </p>
      </div>

      {tab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              label="Total Users"
              value={safeUsers.length}
              icon={Users}
              accent
            />
            <StatsCard
              label="Total Properties"
              value={safeProperties.length}
              icon={Building2}
            />
            <StatsCard
              label="Total Rentals"
              value={safeRequests.length}
              icon={FileText}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">
                  Recent Users
                </h2>
              </div>
              <div className="rounded-xl border border-border overflow-hidden bg-card">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-5 py-4 font-semibold text-xs uppercase text-muted-foreground">
                        User
                      </th>
                      <th className="px-5 py-4 font-semibold text-xs uppercase text-muted-foreground">
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {safeUsers.slice(0, 5).map((u) => (
                      <tr
                        key={u.id}
                        className="border-b border-border/50 hover:bg-muted/10 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <p className="font-medium">{u.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {u.email}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={u.role} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">
                  Recent Properties
                </h2>
              </div>
              <div className="rounded-xl border border-border overflow-hidden bg-card">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-5 py-4 font-semibold text-xs uppercase text-muted-foreground">
                        Property
                      </th>
                      <th className="px-5 py-4 font-semibold text-xs uppercase text-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {safeProperties.slice(0, 5).map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-border/50 hover:bg-muted/10 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <p className="font-medium truncate max-w-50">
                            {p.title}
                          </p>
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
          </div>
        </div>
      )}

      {tab === "users" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-foreground">
              User Management
            </h2>

            {/* Search Input & Role Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={userSearchQuery}
                  onChange={(e) => {
                    setUserSearchQuery(e.target.value);
                    setUserPage(1);
                  }}
                />
              </div>

              <select
                className="w-full sm:w-36 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={userRoleFilter}
                onChange={(e) => {
                  setUserRoleFilter(e.target.value as any);
                  setUserPage(1);
                }}
              >
                <option value="ALL">All Roles</option>
                <option value="TENANT">Tenant</option>
                <option value="LANDLORD">Landlord</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-5 py-4 font-semibold text-xs uppercase text-muted-foreground">
                      User
                    </th>
                    <th className="px-5 py-4 font-semibold text-xs uppercase text-muted-foreground">
                      Role
                    </th>
                    <th className="px-5 py-4 font-semibold text-xs uppercase text-muted-foreground">
                      Joined
                    </th>
                    <th className="px-5 py-4 font-semibold text-xs uppercase text-muted-foreground">
                      Status
                    </th>
                    <th className="px-5 py-4 font-semibold text-xs uppercase text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-8 text-center text-muted-foreground"
                      >
                        No users found matching "{userSearchQuery}".
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <p className="font-medium text-foreground">
                            {u.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {u.email}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={u.role} />
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">
                          {formatDate(u.createdAt)}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={u.status} />
                        </td>
                        <td className="px-5 py-4">
                          {u.role?.toUpperCase() !== "ADMIN" && (
                            <div className="flex gap-2">
                              {u.status?.toUpperCase() === "BANNED" ? (
                                <button
                                  disabled={actionLoadingId === u.id}
                                  onClick={() =>
                                    handleUpdateUserStatus(u.id, "ACTIVE")
                                  }
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 text-xs font-semibold transition-colors disabled:opacity-50"
                                >
                                  {actionLoadingId === u.id ? (
                                    <Loader2
                                      size={14}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <UserCheck size={14} />
                                  )}
                                  Unban User
                                </button>
                              ) : (
                                <button
                                  disabled={actionLoadingId === u.id}
                                  onClick={() =>
                                    handleUpdateUserStatus(u.id, "BANNED")
                                  }
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 text-xs font-semibold transition-colors disabled:opacity-50"
                                >
                                  {actionLoadingId === u.id ? (
                                    <Loader2
                                      size={14}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <UserX size={14} />
                                  )}
                                  Ban User
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredUsers.length > USERS_PER_PAGE && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-muted/20 text-xs">
                <span className="text-muted-foreground">
                  Showing {(userPage - 1) * USERS_PER_PAGE + 1} to{" "}
                  {Math.min(userPage * USERS_PER_PAGE, filteredUsers.length)} of{" "}
                  {filteredUsers.length} users
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={userPage <= 1}
                    onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="font-semibold text-foreground px-2">
                    Page {userPage} of {totalUserPages}
                  </span>
                  <button
                    disabled={userPage >= totalUserPages}
                    onClick={() =>
                      setUserPage((p) => Math.min(totalUserPages, p + 1))
                    }
                    className="p-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "properties" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground">
            Property Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {safeProperties.map((p) => (
              <div key={p.id} className="relative group">
                <PropertyCard property={p} />
                <button
                  onClick={() => handleDeleteProperty(p.id)}
                  className="absolute top-3 right-3 p-2 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-destructive/90 z-20"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "requests" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground">
            All Rental Requests
          </h2>
          <div className="rounded-xl border border-border overflow-hidden bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-5 py-4 font-semibold text-xs uppercase text-muted-foreground">
                      ID
                    </th>
                    <th className="px-5 py-4 font-semibold text-xs uppercase text-muted-foreground">
                      Property
                    </th>
                    <th className="px-5 py-4 font-semibold text-xs uppercase text-muted-foreground">
                      Tenant
                    </th>
                    <th className="px-5 py-4 font-semibold text-xs uppercase text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {safeRequests.map((req) => (
                    <tr
                      key={req.id}
                      className="border-b border-border/50 hover:bg-muted/10 transition-colors"
                    >
                      <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                        {req.id.split("-")[0]}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium truncate max-w-50">
                          {req.property?.title}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium">{req.tenant?.name}</p>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={req.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "profile" && <ProfileTab user={user} />}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<DashboardOverviewSkeleton />}>
      <AdminDashboardContent />
    </Suspense>
  );
}

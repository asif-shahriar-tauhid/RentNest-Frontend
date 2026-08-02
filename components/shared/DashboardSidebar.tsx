/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { User } from "@/types";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Home,
  FileText,
  CreditCard,
  User as UserIcon,
  LogOut,
  ArrowLeft,
  Settings,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

type NavItem = {
  id: string;
  label: string;
  icon: any;
  href: string;
};

const NAV_ITEMS: Record<string, NavItem[]> = {
  TENANT: [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      href: "/dashboard/tenant",
    },
    {
      id: "requests",
      label: "My Requests",
      icon: FileText,
      href: "/dashboard/tenant?tab=requests",
    },
    {
      id: "payments",
      label: "Payment History",
      icon: CreditCard,
      href: "/dashboard/tenant?tab=payments",
    },
    {
      id: "profile",
      label: "Profile Settings",
      icon: UserIcon,
      href: "/dashboard/tenant?tab=profile",
    },
  ],
  LANDLORD: [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      href: "/dashboard/landlord",
    },
    {
      id: "properties",
      label: "My Properties",
      icon: Home,
      href: "/dashboard/landlord?tab=properties",
    },
    {
      id: "requests",
      label: "Incoming Requests",
      icon: FileText,
      href: "/dashboard/landlord?tab=requests",
    },
    {
      id: "profile",
      label: "Profile Settings",
      icon: UserIcon,
      href: "/dashboard/landlord?tab=profile",
    },
  ],
  ADMIN: [
    {
      id: "overview",
      label: "Platform Overview",
      icon: LayoutDashboard,
      href: "/dashboard/admin",
    },
    {
      id: "users",
      label: "User Management",
      icon: Users,
      href: "/dashboard/admin?tab=users",
    },
    {
      id: "properties",
      label: "All Properties",
      icon: Home,
      href: "/dashboard/admin?tab=properties",
    },
    {
      id: "requests",
      label: "Rental Requests",
      icon: FileText,
      href: "/dashboard/admin?tab=requests",
    },
    {
      id: "profile",
      label: "Profile Settings",
      icon: Settings,
      href: "/dashboard/admin?tab=profile",
    },
  ],
};

interface DashboardSidebarProps {
  user: User;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DashboardSidebar = ({
  user,
  activeTab,
  onTabChange,
}: DashboardSidebarProps) => {
  const { logout } = useAuth();
  const items = NAV_ITEMS[user.role] || [];

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group mb-8">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
            <Home className="text-primary-foreground" size={16} />
          </div>
          <span className="text-xl font-bold font-outfit text-foreground tracking-tight">
            RentNest
          </span>
        </Link>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border mb-8">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 relative overflow-hidden">
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt={user.name}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <span className="font-bold text-primary">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-foreground truncate">
              {user.name}
            </p>
            <p className="text-xs text-muted-foreground truncate capitalize">
              {user.role.toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Menu
        </p>
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-1">
        <Link
          href="/"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          <ArrowLeft size={18} /> Back to Home
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut size={18} /> Log out
        </button>
      </div>
    </aside>
  );
};

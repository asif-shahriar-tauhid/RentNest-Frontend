"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { DashboardSidebar } from "@/components/shared/DashboardSidebar";
import { Loader2, Menu } from "lucide-react";

const DashboardLayoutContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeTab = searchParams.get("tab") || "overview";

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const handleTabChange = (tabId: string) => {
    setSidebarOpen(false);
    if (!user) return;

    // Construct base URL based on role
    const basePath = `/dashboard/${user.role.toLowerCase()}`;

    // Navigate with tab query param
    if (tabId === "overview") {
      router.push(basePath);
    } else {
      router.push(`${basePath}?tab=${tabId}`);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <DashboardSidebar
          user={user}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-64 h-full shadow-2xl">
            <DashboardSidebar
              user={user}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Mobile header */}
        <header className="md:hidden flex items-center p-4 border-b border-border bg-card sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-foreground"
          >
            <Menu size={24} />
          </button>
          <span className="font-bold ml-2">RentNest</span>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      }
    >
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
};

export default DashboardLayout;

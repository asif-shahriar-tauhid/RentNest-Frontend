"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

const DashboardError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="p-8 rounded-2xl border border-destructive/20 bg-destructive/5 text-center max-w-lg mx-auto my-12">
      <AlertCircle size={40} className="text-destructive mb-3 mx-auto" />
      <h2 className="text-xl font-bold text-foreground mb-2">
        Dashboard Error
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        There was a problem loading dashboard data. Please verify your internet
        connection or try refreshing.
      </p>
      <button
        onClick={() => reset()}
        className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:bg-primary/90 transition-all inline-flex items-center gap-2"
      >
        <RefreshCw size={14} /> Refresh Dashboard
      </button>
    </div>
  );
};

export default DashboardError;

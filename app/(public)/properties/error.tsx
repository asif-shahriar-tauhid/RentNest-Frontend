"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function PropertiesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Properties page error:", error);
  }, [error]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <div className="p-8 rounded-2xl border border-destructive/20 bg-destructive/5 max-w-lg mx-auto flex flex-col items-center">
        <AlertCircle size={48} className="text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Unable to Load Properties</h2>
        <p className="text-muted-foreground text-sm mb-6">
          We encountered an issue fetching property listings from the server.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => reset()}
            className="px-4 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            <RefreshCw size={14} /> Retry
          </button>
          <Link
            href="/"
            className="px-4 py-2.5 border border-border text-foreground font-semibold rounded-xl text-sm hover:bg-muted transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function PayRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  useEffect(() => {
    const processPayment = async () => {
      try {
        const resolvedParams = await params;
        const result = await api.payments.create(resolvedParams.id);
        if (result.url) {
          window.location.href = result.url; // Redirect to Stripe
        } else {
          toast.error("Failed to get payment URL");
          router.push("/dashboard/tenant?tab=requests");
        }
      } catch (error: any) {
        toast.error(error.message || "Payment initiation failed");
        router.push("/dashboard/tenant?tab=requests");
      }
    };

    processPayment();
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <h1 className="text-2xl font-bold text-foreground">
          Redirecting to Secure Payment...
        </h1>
        <p className="text-muted-foreground mt-2">
          Please do not close this window.
        </p>
      </div>
    </div>
  );
}

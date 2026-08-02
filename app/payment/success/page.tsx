/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Suspense } from "react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      router.push("/dashboard/tenant");
      return;
    }

    const confirmPayment = async () => {
      try {
        await api.payments.confirm(sessionId);
        setSuccess(true);
      } catch (error: any) {
        toast.error(error.message || "Failed to verify payment");
      } finally {
        setVerifying(false);
      }
    };

    confirmPayment();
  }, [sessionId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-card border border-border p-8 rounded-2xl max-w-md w-full text-center shadow-xl">
        {verifying ? (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-primary mb-4" size={48} />
            <h1 className="text-2xl font-bold text-foreground">Verifying Payment...</h1>
            <p className="text-muted-foreground mt-2">Please wait while we confirm your transaction.</p>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="text-emerald-500" size={48} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Payment Successful!</h1>
            <p className="text-muted-foreground mt-2 mb-8">
              Your rent has been paid successfully. The property owner has been notified.
            </p>
            <Link 
              href="/dashboard/tenant?tab=payments"
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-red-500 text-4xl">!</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Verification Failed</h1>
            <p className="text-muted-foreground mt-2 mb-8">
              We couldn't verify your payment. If you were charged, please contact support.
            </p>
            <Link 
              href="/dashboard/tenant"
              className="w-full py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-all"
            >
              Back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

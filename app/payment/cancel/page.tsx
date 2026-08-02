/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-card border border-border p-8 rounded-2xl max-w-md w-full text-center shadow-xl animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 mx-auto">
          <XCircle className="text-red-500" size={48} />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Payment Cancelled
        </h1>
        <p className="text-muted-foreground mt-2 mb-8">
          Your payment was cancelled and you haven't been charged. You can try
          again from your dashboard when you're ready.
        </p>
        <Link
          href="/dashboard/tenant"
          className="w-full inline-block py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

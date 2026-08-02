/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, Star } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left side - Content */}
      <div className="flex flex-col p-8 md:p-12 lg:p-16 justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-fit mb-12 transition-colors"
        >
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="w-full max-w-md mx-auto">{children}</div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden md:flex flex-col justify-between p-12 relative overflow-hidden text-white border-l border-border bg-slate-950">
        {/* Background Image with Overlay */}
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80"
          alt="Luxury Rental Property"
          className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-1000"
        />

        {/* Modern Dark & Gradient Overlays for high legibility */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-slate-950/40 z-1" />
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px] mix-blend-overlay z-1" />

        {/* Top Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 relative z-10 w-fit bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shadow-lg group"
        >
          <div className="w-9 h-9 relative flex items-center justify-center group-hover:scale-105 transition-transform">
            <Image
              src="/logo-dark.png"
              alt="RentNest Logo"
              width={36}
              height={36}
              className="w-auto h-8 object-contain"
            />
          </div>
          <span className="text-2xl font-bold font-outfit text-white tracking-tight">
            RentNest
          </span>
        </Link>

        {/* Floating Feature Card */}
        <div className="relative z-10 my-auto py-6">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl max-w-xs shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs text-white/70 font-medium">
                  Verified Rentals
                </p>
                <p className="text-sm font-bold text-white">
                  100% Scam-Free Homes
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-white/80 font-medium">
              <span>Instant Booking</span>
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <Star size={12} className="fill-amber-400" /> 4.9/5 Rating
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Testimonial */}
        <div className="relative z-10 bg-black/50 backdrop-blur-xl border border-white/15 p-6 rounded-3xl shadow-2xl">
          <blockquote className="text-lg font-medium text-white/95 leading-relaxed">
            "RentNest transformed how we manage our properties. Everything from
            tenant screening to rent collection is completely automated and
            seamless."
          </blockquote>
          <div className="mt-6 flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
              alt="Sarah Jenkins"
              className="w-12 h-12 rounded-full object-cover border-2 border-primary/80 shadow-md"
            />
            <div>
              <p className="font-bold text-white text-base">Sarah Jenkins</p>
              <p className="text-xs text-white/75">
                Premium Landlord • 14 Properties
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

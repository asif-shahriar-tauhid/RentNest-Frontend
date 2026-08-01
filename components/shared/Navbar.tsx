"use client";

import { useAuth } from "@/context/AuthContext";
import { Menu, Moon, Sun, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const { user, isDark, toggleDark, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashBoardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case "TENANT":
        return "/dashboard/tenant";
      case "LANDLORD":
        return "/dashboard/landlord";
      case "ADMIN":
        return "/dashboard/admin";
      default:
        return "/";
    }
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between relative">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-9 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Image
              src="/logo-light.png"
              alt="RentNest Logo"
              width={36}
              height={36}
              className="w-auto h-8 object-contain dark:hidden"
              priority
            />
            <Image
              src="/logo-dark.png"
              alt="RentNest Logo"
              width={36}
              height={36}
              className="w-auto h-8 object-contain hidden dark:block"
              priority
            />
          </div>
          <span className="text-xl font-bold font-outfit text-foreground tracking-tight">
            RentNest
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            href="/properties"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Browse
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleDark}
            className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href={getDashBoardLink()}
                className="px-4 py-3 rounded-xl text-sm font-medium border border-border bg-card hover:bg-muted transition-all"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-all"
              >
                Log in
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggleDark} className="p-2 text-muted-foreground">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={()=> setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-foreground">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}

          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validations";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "TENANT") router.push("/dashboard/tenant");
      else if (user.role === "LANDLORD") router.push("/dashboard/landlord");
      else if (user.role === "ADMIN") router.push("/dashboard/admin");
    }
  }, [user, router]);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await login(data);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-outfit text-foreground mb-2">
          Welcome back
        </h1>
        <p className="text-muted-foreground">
          Log in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="email"
              placeholder="you@example.com"
              className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? "border-destructive focus:ring-destructive/20"
                  : "border-border focus:ring-primary/20"
              }`}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-foreground">
              Password
            </label>
            <Link
              href="#"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="password"
              placeholder="••••••••"
              className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 transition-all ${
                errors.password
                  ? "border-destructive focus:ring-destructive/20"
                  : "border-border focus:ring-primary/20"
              }`}
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Logging in...
            </>
          ) : (
            "Log in"
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-foreground hover:text-primary transition-colors"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}

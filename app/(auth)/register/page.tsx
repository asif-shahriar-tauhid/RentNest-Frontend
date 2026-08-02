/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  Loader2,
  Phone,
  AlertCircle,
  Info,
  Image as ImageIcon,
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/lib/validations";
import { uploadToImgBB } from "@/lib/imgbb";

export default function RegisterPage() {
  const router = useRouter();
  const { login, user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "TENANT",
      imgbbApiKey: process.env.NEXT_PUBLIC_IMGBB_API_KEY || "",
    },
  });

  const selectedRole = watch("role");

  // Redirect to respective dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "TENANT") router.push("/dashboard/tenant");
      else if (user.role === "LANDLORD") router.push("/dashboard/landlord");
      else if (user.role === "ADMIN") router.push("/dashboard/admin");
    }
  }, [user, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    let profileImageUrl = "";

    try {
      // If photo file is selected, upload to ImgBB first
      if (selectedFile) {
        toast.info("Uploading profile photo...");
        const apiKey =
          data.imgbbApiKey || process.env.NEXT_PUBLIC_IMGBB_API_KEY;
        profileImageUrl = await uploadToImgBB(selectedFile, apiKey);
        toast.success("Profile photo uploaded!");
      }

      // Submit user registration with ImgBB hosted photo URL
      await api.auth.register({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: data.role,
        ...(profileImageUrl ? { profileImage: profileImageUrl } : {}),
      });

      toast.success("Account created successfully!");
      await login({ email: data.email, password: data.password }); // Auto-login

      // Explicit redirect after registration & auto-login
      if (data.role === "LANDLORD") {
        router.push("/dashboard/landlord");
      } else {
        router.push("/dashboard/tenant");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-outfit text-foreground mb-2">
          Create an account
        </h1>
        <p className="text-muted-foreground">
          Join RentNest to find or list properties.
        </p>
      </div>

      {/* Registration Guidance & Credentials Requirements Warning */}
      <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-foreground">
        <div className="flex items-center gap-2 mb-2 font-semibold text-sm text-blue-600 dark:text-blue-400">
          <Info size={16} className="shrink-0" />
          <span>Registration & Credential Guidance</span>
        </div>
        <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
          <li>
            <strong>Tenant Account:</strong> Browse listings, submit rental
            requests, and complete online payments.
          </li>
          <li>
            <strong>Landlord Account:</strong> Create property listings, manage
            incoming requests, and review tenants.
          </li>
          <li>
            <strong>Credentials Requirements:</strong> Valid email format, 7+
            digit phone number, and a minimum 6-character password.
          </li>
        </ul>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Account Type Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setValue("role", "TENANT")}
            className={`p-4 rounded-xl border text-center transition-all ${
              selectedRole === "TENANT"
                ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                : "border-border bg-card hover:bg-muted"
            }`}
          >
            <span
              className={`block font-semibold ${selectedRole === "TENANT" ? "text-primary" : "text-foreground"}`}
            >
              Tenant
            </span>
            <span className="text-xs text-muted-foreground mt-1 block">
              Find a home
            </span>
          </button>
          <button
            type="button"
            onClick={() => setValue("role", "LANDLORD")}
            className={`p-4 rounded-xl border text-center transition-all ${
              selectedRole === "LANDLORD"
                ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                : "border-border bg-card hover:bg-muted"
            }`}
          >
            <span
              className={`block font-semibold ${selectedRole === "LANDLORD" ? "text-primary" : "text-foreground"}`}
            >
              Landlord
            </span>
            <span className="text-xs text-muted-foreground mt-1 block">
              List properties
            </span>
          </button>
        </div>

        {/* Profile Photo Upload via ImgBB */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Profile Photo (ImgBB Upload)
          </label>
          <div className="flex items-center gap-4 p-3 rounded-xl border border-border bg-card">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden border border-border">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="text-muted-foreground" size={24} />
              )}
            </div>
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-xs text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Full Name
          </label>
          <div className="relative">
            <User
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder="John Doe"
              className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? "border-destructive focus:ring-destructive/20"
                  : "border-border focus:ring-primary/20"
              }`}
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.name.message}
            </p>
          )}
        </div>

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
          <label className="block text-sm font-medium text-foreground mb-2">
            Phone Number
          </label>
          <div className="relative">
            <Phone
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="tel"
              placeholder="+880 1234-567890"
              className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 transition-all ${
                errors.phone
                  ? "border-destructive focus:ring-destructive/20"
                  : "border-border focus:ring-primary/20"
              }`}
              {...register("phone")}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Password
          </label>
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
          className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Uploading &
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-foreground hover:text-primary transition-colors"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}

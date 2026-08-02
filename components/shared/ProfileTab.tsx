import { User } from "@/types";
import { User as UserIcon, Mail, Phone, Calendar, Shield } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import Image from "next/image";

export const ProfileTab = ({ user }: { user: User }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-outfit">
          My Profile
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          View your personal account details and status.
        </p>
      </div>

      <div className="max-w-3xl bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        {/* Banner */}
        <div className="h-36 bg-linear-to-r from-primary/20 via-primary/10 to-transparent border-b border-border relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        </div>

        <div className="p-8 relative">
          {/* Avatar & Badges Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-20 mb-6">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-2xl bg-card border-4 border-card shadow-md flex items-center justify-center overflow-hidden relative shrink-0">
              {user.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary">
                  <UserIcon size={44} />
                </div>
              )}
            </div>

            {/* Status Badges */}
            <div className="flex items-center gap-2 pt-2 sm:pt-0">
              <StatusBadge status={user.role} />
              <StatusBadge status={user.status} />
            </div>
          </div>

          {/* Header Info */}
          <div className="border-b border-border pb-6">
            <h2 className="text-2xl font-bold text-foreground font-outfit">
              {user.name}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
          </div>

          {/* Account Details */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Contact Information
              </h3>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium">
                    Email Address
                  </p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium">
                    Phone Number
                  </p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {user.phone || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Account Details
              </h3>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <Shield size={16} />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium">
                    Account ID
                  </p>
                  <p className="font-mono text-xs font-semibold text-foreground mt-0.5">
                    {user.id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium">
                    Member Since
                  </p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { Badge } from "@/components/ui/badge";

const STATUS_CFG: Record<string, { label: string; className: string }> = {
  // User account status & Rental ACTIVE status — both green per spec
  ACTIVE:     { label: "Active",     className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20" },
  BANNED:     { label: "Banned",     className: "bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20" },
  // Property status
  AVAILABLE:  { label: "Available",  className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20" },
  RENTED:     { label: "Rented",     className: "bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20" },
  UNAVAILABLE:{ label: "Unavailable",className: "bg-gray-500/10 text-gray-600 dark:text-gray-400 hover:bg-gray-500/20" },
  // Rental request status — matches spec exactly
  // PENDING → Yellow/Orange | APPROVED → Blue | REJECTED → Red | ACTIVE → Green | COMPLETED → Gray
  PENDING:    { label: "Pending",    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20" },
  APPROVED:   { label: "Approved",   className: "bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20" },
  REJECTED:   { label: "Rejected",   className: "bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20" },
  COMPLETED:  { label: "Completed",  className: "bg-gray-500/10 text-gray-600 dark:text-gray-400 hover:bg-gray-500/20" },
  // Payment status
  FAILED:     { label: "Failed",     className: "bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20" },
  // User roles
  TENANT:     { label: "Tenant",     className: "bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 border-sky-500/20" },
  LANDLORD:   { label: "Landlord",   className: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 border-indigo-500/20" },
  ADMIN:      { label: "Admin",      className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border-rose-500/20" },
};

export const StatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_CFG[status] || { label: status, className: "bg-muted text-muted-foreground" };
  
  return (
    <Badge variant="outline" className={`font-medium border-transparent ${cfg.className}`}>
      {cfg.label}
    </Badge>
  );
}

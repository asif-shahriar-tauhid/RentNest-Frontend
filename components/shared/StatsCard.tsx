import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: boolean;
}

export const StatsCard = ({
  label,
  value,
  icon: Icon,
  accent,
}: StatsCardProps) => {
  return (
    <div
      className={cn(
        "rounded-xl p-5 border overflow-hidden relative",
        accent
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card border-border text-card-foreground",
      )}
    >
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p
            className={cn(
              "text-sm font-medium",
              accent ? "text-primary-foreground/80" : "text-muted-foreground",
            )}
          >
            {label}
          </p>
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
              accent
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-muted text-muted-foreground",
            )}
          >
            <Icon size={16} />
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-bold font-mono tracking-tight">
            {value}
          </h3>
        </div>
      </div>

      {/* Decorative gradient blob for accent cards */}
      {accent && (
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary-foreground/5 rounded-full blur-2xl" />
      )}
    </div>
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Property } from "@/types";
import { spawn } from "child_process";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const PropertyCard = ({
  property,
  variant = "vertical",
}: {
  property: Property;
  variant?: "vertical" | "horizontal";
}) => {
  const rating =
    property.reviews && property.reviews.length > 0
      ? property.reviews.reduce((acc, r) => acc + r.rating, 0) /
        property.reviews.length
      : 0;

  const statusUpper = property.status?.toUpperCase() || "AVAILABLE";
  const hasActiveRental =
    Array.isArray((property as any).rentals) &&
    (property as any).rentals.some(
      (r: any) =>
        r.status === "ACTIVE" ||
        r.status === "APPROVED" ||
        r.status === "COMPLETED",
    );

  const hasActiveRentalReq =
    Array.isArray((property as any).rentalRequests) &&
    (property as any).rentalRequests.some(
      (r: any) =>
        r.status === "ACTIVE" ||
        r.status === "APPROVED" ||
        r.status === "COMPLETED",
    );

  const isRented =
    statusUpper === "RENTED" || hasActiveRental || hasActiveRentalReq;

  if (variant === "vertical") {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
      >
        <Link
          href={`/properties/${property.id}`}
          className="block relative aspect-4/3 overflow-hidden bg-muted"
        >
          {property.images && property.images.length > 0 ? (
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              sizes="(max-width:768px) 10vw, (max_width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image available
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-2 z-10">
            {isRented ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-md bg-purple-600">
                Rented
              </span>
            ) : statusUpper === "UNAVAILABLE" ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-md bg-zinc-600">
                Unavailable
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-md bg-emerald-500">
                Available
              </span>
            )}
            {property.category && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-black/60 text-white shadow-s, backdrop-blur-md border border-white/10">
                {property.category.name}
              </span>
            )}
          </div>
        </Link>
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <Link href={`/properties/${property.id}`}>
              <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {property.title}
              </h3>
            </Link>
            <div className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded text-xs font-medium shrink-0">
              <Star size={12} className="fill-amber-500" />
              {rating > 0 ? rating.toFixed(1) : "New"}
            </div>
          </div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </motion.div>
    );
  }
  return <div></div>;
};

export default PropertyCard;

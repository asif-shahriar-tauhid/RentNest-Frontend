/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { formatCurrency } from "@/lib/utils";
import { Property } from "@/types";
import { motion } from "framer-motion";
import { ArrowRight, Bath, Bed, MapPin, Maximize, Star } from "lucide-react";
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
        className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all transform-gpu will-change-transform"
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
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-black/80 text-white shadow-sm border border-white/10">
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
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4">
            <MapPin size={14} className="shrink-0" />
            <span className="line-clamp-1">
              {property.address}, {property.city}
            </span>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground text-sm mb-5">
            <div className="flex items-center gap-1.5">
              <Bed size={16} />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath size={16} />
              <span>{property.bathrooms} Baths</span>
            </div>
            {property.area && (
              <div className="flex items-center gap-1.5">
                <Maximize size={16} />
                <span>{property.area} sqft</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <span className="text-xs text-muted-foreground block mb-0.5">
                Rent
              </span>
              <span className="text-lg font-bold text-destructive font-mono leading-none">
                {formatCurrency(property.rentAmount)}
                <span className="text-xs text-muted-foreground font-sans font-normal">
                  /mo
                </span>
              </span>
            </div>
            <Link
              href={`/property/${property.id}`}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex flex-col sm:flex-row transform-gpu will-change-transform"
    >
      {/* Image Section */}
      <Link
        href={`/properties/${property.id}`}
        className="block relative w-full sm:w-64 md:w-72 lg:w-80 shrink-0 aspect-16/10 sm:aspect-auto overflow-hidden bg-muted"
      >
        {property.images && property.images.length > 0 ? (
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 100vw, 320px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            No image available
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          {isRented ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-600 text-white shadow-md">
              Rented
            </span>
          ) : statusUpper === "UNAVAILABLE" ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-600 text-white shadow-md">
              Unavailable
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-md">
              Available
            </span>
          )}
          {property.category && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-black/80 text-white shadow-sm border border-white/10">
              {property.category.name}
            </span>
          )}
        </div>
      </Link>

      {/* Content Section */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between gap-3">
        <div>
          <div className="flex justify-between items-start gap-4 mb-2">
            <Link href={`/properties/${property.id}`}>
              <h3 className="font-bold text-xl text-foreground line-clamp-1 group-hover:text-primary transition-colors font-outfit">
                {property.title}
              </h3>
            </Link>
            <div className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg text-xs font-semibold shrink-0">
              <Star size={14} className="fill-amber-500" />
              {rating > 0 ? rating.toFixed(1) : "New"}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-3">
            <MapPin size={15} className="shrink-0 text-primary/70" />
            <span className="line-clamp-1">
              {property.address}, {property.city}
            </span>
          </div>

          {property.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
              {property.description}
            </p>
          )}

          {/* Amenities Badges */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {property.amenities.slice(0, 5).map((amenity, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-md bg-muted text-xs font-medium text-muted-foreground"
                >
                  {amenity}
                </span>
              ))}
              {property.amenities.length > 5 && (
                <span className="px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground">
                  +{property.amenities.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer Specs & Price */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border mt-1">
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-1.5">
              <Bed size={16} className="text-foreground/70" />
              <span>
                <strong className="text-foreground">{property.bedrooms}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath size={16} className="text-foreground/70" />
              <span>
                <strong className="text-foreground">
                  {property.bathrooms}
                </strong>
              </span>
            </div>
            {property.area && (
              <div className="flex items-center gap-1.5">
                <Maximize size={16} className="text-foreground/70" />
                <span>
                  <strong className="text-foreground">{property.area}</strong>
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-6">
            <div className="text-left">
              <span className="text-xl font-bold text-primary font-mono">
                {formatCurrency(property.rentAmount)}
              </span>
              <span className="text-xs text-muted-foreground ml-1">/mo</span>
            </div>

            <Link
              href={`/properties/${property.id}`}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
            >
              <span>Details</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;

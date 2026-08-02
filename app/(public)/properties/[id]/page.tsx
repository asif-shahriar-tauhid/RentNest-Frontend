/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Star,
  Building2,
  User,
  Phone,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { RequestModal } from "@/components/rental/RequestModal";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PropertyDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  let property;
  try {
    property = await api.properties.getById(params.id, true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-2">Property Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The property you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/properties"
          className="px-6 py-2 bg-primary text-primary-foreground rounded-xl"
        >
          Back to Properties
        </Link>
      </div>
    );
  }

  const rating =
    property.reviews && property.reviews.length > 0
      ? property.reviews.reduce((acc: any, r: any) => acc + r.rating, 0) /
        property.reviews.length
      : 0;

  return (
    <div className="bg-background min-h-screen pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-foreground">
            Properties
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate">
            {property.title}
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {property.status === "RENTED" ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-600/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  Rented
                </span>
              ) : property.status === "AVAILABLE" ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Available
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">
                  Unavailable
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
                {property.category?.name}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold font-outfit text-foreground tracking-tight mb-4">
              {property.title}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin size={18} />
                <span>
                  {property.address}, {property.city}
                </span>
              </div>
              <div className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded text-sm font-medium">
                <Star size={14} className="fill-amber-500" />
                {rating > 0
                  ? `${rating.toFixed(1)} (${property.reviews?.length} reviews)`
                  : "New Listing"}
              </div>
            </div>
          </div>

          <div className="text-left md:text-right">
            <p className="text-sm text-muted-foreground mb-1">Monthly Rent</p>
            <p className="text-4xl font-bold text-destructive font-mono">
              {formatCurrency(property.rentAmount)}
            </p>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 h-[50vh] min-h-100">
          <div className="relative md:col-span-3 rounded-2xl overflow-hidden bg-muted border border-border">
            {property.images && property.images.length > 0 ? (
              <Image
                src={property.images[0]}
                alt={property.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 75vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
          </div>
          <div className="hidden md:flex flex-col gap-4 h-full">
            {[1, 2].map((idx) => (
              <div
                key={idx}
                className="relative flex-1 rounded-2xl overflow-hidden bg-muted border border-border"
              >
                {property.images && property.images.length > idx ? (
                  <Image
                    src={property.images[idx]}
                    alt={`${property.title} preview ${idx}`}
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground/30">
                    <Building2 size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 p-6 rounded-2xl border border-border bg-card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Bed size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bedrooms</p>
                  <p className="text-lg font-bold text-foreground">
                    {property.bedrooms}
                  </p>
                </div>
              </div>
              <div className="w-px h-12 bg-border hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Bath size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bathrooms</p>
                  <p className="text-lg font-bold text-foreground">
                    {property.bathrooms}
                  </p>
                </div>
              </div>
              <div className="w-px h-12 bg-border hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Maximize size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Square Feet</p>
                  <p className="text-lg font-bold text-foreground">
                    {property.area || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold font-outfit text-foreground mb-4">
                About this property
              </h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {property.description}
                </p>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-bold font-outfit text-foreground mb-4">
                Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities?.map((amenity: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-foreground p-3 rounded-xl border border-border/50 bg-muted/20"
                  >
                    <ShieldCheck size={18} className="text-primary" />
                    <span>{amenity}</span>
                  </div>
                ))}
                {(!property.amenities || property.amenities.length === 0) && (
                  <p className="text-muted-foreground col-span-full">
                    No specific amenities listed.
                  </p>
                )}
              </div>
            </div>

            {/* Reviews */}
            {property.reviews && property.reviews.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold font-outfit text-foreground mb-6">
                  Tenant Reviews
                </h2>
                <div className="space-y-6">
                  {property.reviews.map((review: any) => (
                    <div
                      key={review.id}
                      className="p-6 rounded-2xl border border-border bg-card"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User size={18} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {review.tenant?.name || "Anonymous"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(review.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={16}
                              className={
                                s <= review.rating
                                  ? "fill-amber-500 text-amber-500"
                                  : "text-muted"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-muted-foreground text-sm">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / Action Area */}
          <div>
            <div className="sticky top-24 space-y-6">
              <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
                <h3 className="font-bold text-lg mb-2">
                  Interested in renting?
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Submit a request to the landlord. They usually respond within
                  24 hours.
                </p>

                {property.status === "AVAILABLE" ? (
                  <RequestModal propertyId={property.id} />
                ) : (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl bg-muted text-muted-foreground font-medium cursor-not-allowed"
                  >
                    Property Not Available
                  </button>
                )}
              </div>

              {property.landlord && (
                <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
                  <h3 className="font-bold text-lg mb-4">Landlord Profile</h3>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xl font-bold text-primary">
                        {property.landlord.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-foreground">
                        {property.landlord.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Verified Landlord
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail size={16} className="text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {property.landlord.email}
                      </span>
                    </div>
                    {property.landlord.phone && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone size={16} className="text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {property.landlord.phone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

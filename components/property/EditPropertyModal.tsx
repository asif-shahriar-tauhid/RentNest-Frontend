/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Category, Property, PropertyStatus } from "@/types";
import { toast } from "sonner";
import { Edit3, Loader2, AlertCircle, Building2 } from "lucide-react";
import { propertySchema } from "@/lib/validations";

interface EditPropertyModalProps {
  property: Property;
  onSuccess?: () => void;
}

export const EditPropertyModal = ({
  property,
  onSuccess,
}: EditPropertyModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State initialized with existing property data
  const [title, setTitle] = useState(property.title || "");
  const [description, setDescription] = useState(property.description || "");
  const [address, setAddress] = useState(property.address || "");
  const [city, setCity] = useState(property.city || "");
  const [district, setDistrict] = useState(property.district || "");
  const [rentAmount, setRentAmount] = useState(
    property.rentAmount ? property.rentAmount.toString() : "",
  );
  const [bedrooms, setBedrooms] = useState(
    property.bedrooms ? property.bedrooms.toString() : "1",
  );
  const [bathrooms, setBathrooms] = useState(
    property.bathrooms ? property.bathrooms.toString() : "1",
  );
  const [area, setArea] = useState(
    property.area ? property.area.toString() : "",
  );
  const [status, setStatus] = useState<PropertyStatus>(
    property.status || "AVAILABLE",
  );
  const [categoryId, setCategoryId] = useState(property.categoryId || "");
  const [amenitiesInput, setAmenitiesInput] = useState(
    property.amenities ? property.amenities.join(", ") : "",
  );
  const [imagesInput, setImagesInput] = useState(
    property.images ? property.images.join("\n") : "",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setTitle(property.title || "");
      setDescription(property.description || "");
      setAddress(property.address || "");
      setCity(property.city || "");
      setDistrict(property.district || "");
      setRentAmount(property.rentAmount ? property.rentAmount.toString() : "");
      setBedrooms(property.bedrooms ? property.bedrooms.toString() : "1");
      setBathrooms(property.bathrooms ? property.bathrooms.toString() : "1");
      setArea(property.area ? property.area.toString() : "");
      setStatus(property.status || "AVAILABLE");
      setCategoryId(property.categoryId || "");
      setAmenitiesInput(
        property.amenities ? property.amenities.join(", ") : "",
      );
      setImagesInput(property.images ? property.images.join("\n") : "");

      if (categories.length === 0) {
        api.categories
          .getAll()
          .then((res: any) => {
            const list = Array.isArray(res) ? res : res?.data || [];
            setCategories(list);
          })
          .catch(() => {});
      }
    }
  }, [categories.length, isOpen, property]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Zod validation
    const validationResult = propertySchema.safeParse({
      title,
      categoryId,
      rentAmount,
      city,
      district,
      address,
      bedrooms,
      bathrooms,
      area: area ? parseFloat(area) : undefined,
      amenitiesInput,
      imagesInput,
      description,
    });

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    const amenities = amenitiesInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const images = imagesInput
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      setLoading(true);
      await api.properties.update(property.id, {
        title: title.trim(),
        description: description.trim(),
        address: address.trim(),
        city: city.trim(),
        district: district.trim() || city.trim(),
        rentAmount: parseFloat(rentAmount),
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        area: area ? parseFloat(area) : undefined,
        status,
        categoryId,
        amenities,
        images,
      });

      if (status !== property.status) {
        await api.properties.updateStatus(property.id, status).catch(() => {});
      }

      toast.success("Property updated successfully!");
      setIsOpen(false);

      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to update property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
        title="Edit Listing"
      >
        <Edit3 size={14} /> Edit Listing
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Building2 size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-outfit text-foreground">
                    Edit Property Listing
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Update details, status, or pricing for this property.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5 max-h-[75vh] overflow-y-auto"
              noValidate
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                    Property Title
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2.5 rounded-xl border bg-background focus:outline-none focus:ring-2 text-sm ${
                      errors.title
                        ? "border-destructive focus:ring-destructive/20"
                        : "border-border focus:ring-primary/20"
                    }`}
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (errors.title)
                        setErrors((prev) => ({ ...prev, title: "" }));
                    }}
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                    Category
                  </label>
                  <select
                    className={`w-full px-4 py-2.5 rounded-xl border bg-background focus:outline-none focus:ring-2 text-sm ${
                      errors.categoryId
                        ? "border-destructive focus:ring-destructive/20"
                        : "border-border focus:ring-primary/20"
                    }`}
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                    Availability Status
                  </label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold"
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as PropertyStatus)
                    }
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="RENTED">RENTED</option>
                    <option value="UNAVAILABLE">UNAVAILABLE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                    Monthly Rent (BDT)
                  </label>
                  <input
                    type="number"
                    className={`w-full px-4 py-2.5 rounded-xl border bg-background focus:outline-none focus:ring-2 text-sm ${
                      errors.rentAmount
                        ? "border-destructive focus:ring-destructive/20"
                        : "border-border focus:ring-primary/20"
                    }`}
                    value={rentAmount}
                    onChange={(e) => setRentAmount(e.target.value)}
                  />
                  {errors.rentAmount && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.rentAmount}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2.5 rounded-xl border bg-background focus:outline-none focus:ring-2 text-sm ${
                      errors.city
                        ? "border-destructive focus:ring-destructive/20"
                        : "border-border focus:ring-primary/20"
                    }`}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                    Full Address
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2.5 rounded-xl border bg-background focus:outline-none focus:ring-2 text-sm ${
                      errors.address
                        ? "border-destructive focus:ring-destructive/20"
                        : "border-border focus:ring-primary/20"
                    }`}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 text-sm"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 text-sm"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                    Amenities (Comma-separated)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 text-sm"
                    value={amenitiesInput}
                    onChange={(e) => setAmenitiesInput(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                    Image URLs (comma or newline separated)
                  </label>
                  <textarea
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 text-sm resize-none"
                    value={imagesInput}
                    onChange={(e) => setImagesInput(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 text-sm resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-foreground font-semibold hover:bg-muted text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Saving
                      Changes...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

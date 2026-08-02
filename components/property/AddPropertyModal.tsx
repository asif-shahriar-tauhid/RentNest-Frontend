/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Category } from "@/types";
import { toast } from "sonner";
import { Building2, Plus, Loader2, AlertCircle } from "lucide-react";
import { propertySchema } from "@/lib/validations";

interface AddPropertyModalProps {
  onSuccess?: () => void;
}

export const AddPropertyModal = ({ onSuccess }: AddPropertyModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [rentAmount, setRentAmount] = useState("");
  const [bedrooms, setBedrooms] = useState("1");
  const [bathrooms, setBathrooms] = useState("1");
  const [area, setArea] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [amenitiesInput, setAmenitiesInput] = useState(
    "WiFi, AC, Parking, Security",
  );
  const [imagesInput, setImagesInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && categories.length === 0) {
      api.categories
        .getAll()
        .then((res: any) => {
          const list = Array.isArray(res) ? res : res?.data || [];
          setCategories(list);
          if (list.length > 0) setCategoryId(list[0].id);
        })
        .catch(() => {});
    }
  }, [isOpen, categories.length]);

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
      await api.properties.create({
        title: title.trim(),
        description: description.trim(),
        address: address.trim(),
        city: city.trim(),
        district: district.trim() || city.trim() || "Dhaka",
        rentAmount: parseFloat(rentAmount),
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        area: area ? parseFloat(area) : undefined,
        categoryId,
        amenities: amenities.length > 0 ? amenities : ["Basic Amenities"],
        images:
          images.length > 0
            ? images
            : [
                "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
              ],
      });

      toast.success("Property created successfully!");
      setIsOpen(false);

      // Reset form
      setTitle("");
      setDescription("");
      setAddress("");
      setCity("");
      setDistrict("");
      setRentAmount("");
      setArea("");
      setImagesInput("");

      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm"
      >
        <Plus size={18} /> Add Property
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
                    Add New Property
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    List a new property for tenants to discover.
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
                    placeholder="e.g. Modern 3-Bedroom Apartment in Gulshan"
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
                    onChange={(e) => {
                      setCategoryId(e.target.value);
                      if (errors.categoryId)
                        setErrors((prev) => ({ ...prev, categoryId: "" }));
                    }}
                  >
                    {categories.length === 0 && (
                      <option value="">Loading categories...</option>
                    )}
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.categoryId}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                    Monthly Rent (BDT)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 35000"
                    className={`w-full px-4 py-2.5 rounded-xl border bg-background focus:outline-none focus:ring-2 text-sm ${
                      errors.rentAmount
                        ? "border-destructive focus:ring-destructive/20"
                        : "border-border focus:ring-primary/20"
                    }`}
                    value={rentAmount}
                    onChange={(e) => {
                      setRentAmount(e.target.value);
                      if (errors.rentAmount)
                        setErrors((prev) => ({ ...prev, rentAmount: "" }));
                    }}
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
                    placeholder="e.g. Dhaka"
                    className={`w-full px-4 py-2.5 rounded-xl border bg-background focus:outline-none focus:ring-2 text-sm ${
                      errors.city
                        ? "border-destructive focus:ring-destructive/20"
                        : "border-border focus:ring-primary/20"
                    }`}
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (errors.city)
                        setErrors((prev) => ({ ...prev, city: "" }));
                    }}
                  />
                  {errors.city && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                    District / Region
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Gulshan"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                    Full Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Road 12, House 45, Gulshan-2, Dhaka"
                    className={`w-full px-4 py-2.5 rounded-xl border bg-background focus:outline-none focus:ring-2 text-sm ${
                      errors.address
                        ? "border-destructive focus:ring-destructive/20"
                        : "border-border focus:ring-primary/20"
                    }`}
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address)
                        setErrors((prev) => ({ ...prev, address: "" }));
                    }}
                  />
                  {errors.address && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
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
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                    Area (sq ft)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 1450"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                    Amenities (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="WiFi, Parking, Elevator, Generator"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
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
                    placeholder="https://images.unsplash.com/photo-1560518883-ce09059eeffa"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none"
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
                    placeholder="Describe the property, features, surrounding environment, nearby transportation..."
                    className={`w-full px-4 py-2.5 rounded-xl border bg-background focus:outline-none focus:ring-2 text-sm resize-none ${
                      errors.description
                        ? "border-destructive focus:ring-destructive/20"
                        : "border-border focus:ring-primary/20"
                    }`}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (errors.description)
                        setErrors((prev) => ({ ...prev, description: "" }));
                    }}
                  />
                  {errors.description && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.description}
                    </p>
                  )}
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
                      <Loader2 size={16} className="animate-spin" /> Creating
                      Listing...
                    </>
                  ) : (
                    "Create Property"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

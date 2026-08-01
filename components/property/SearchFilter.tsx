"use client";
/* eslint-disable react-hooks/set-state-in-effect */
import { Category } from "@/types";
import { Filter, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const SearchFilter = ({ categories }: { categories: Category[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [city, setCity] = useState(searchParams.get("city") || "");
  const [categoryId, setCategoryId] = useState(
    searchParams.get("categoryId") || "",
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "");

  useEffect(() => {
    setCity(searchParams.get("city") || "");
    setCategoryId(searchParams.get("categoryId") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setBedrooms(searchParams.get("bedrooms") || "");
  }, [searchParams]);

  const applyFiltersWith = (overrides: {
    city?: string;
    categoryId?: string;
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
  }) => {
    const query = new URLSearchParams();

    const targetCity = overrides.city !== undefined ? overrides.city : city;
    const targetCategory =
      overrides.categoryId !== undefined ? overrides.categoryId : categoryId;
    const targetMinPrice =
      overrides.minPrice !== undefined ? overrides.minPrice : minPrice;
    const targetMaxPrice =
      overrides.maxPrice !== undefined ? overrides.maxPrice : maxPrice;
    const targetBedrooms =
      overrides.bedrooms !== undefined ? overrides.bedrooms : bedrooms;

    if (targetCity.trim()) query.set("city", targetCity.trim());
    if (targetCategory) query.set("categoryId", targetCategory);
    if (targetMinPrice) query.set("minPrice", targetMinPrice);
    if (targetMaxPrice) query.set("maxPrice", targetMaxPrice);
    if (targetBedrooms) query.set("bedrooms", targetBedrooms);

    const limit = searchParams.get("limit");
    if (limit) query.set("limit", limit);
    query.set("page", "1");

    const queryString = query.toString();
    router.push(queryString ? `/properties?${queryString}` : "/properties");
  };

  const handleApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    applyFiltersWith({});
  };

  const handleClear = () => {
    setCity("");
    setCategoryId("");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("");
    router.push("/properties");
  };

  const handleCategoryChange = (selectedId: string) => {
    setCategoryId(selectedId);
    applyFiltersWith({ categoryId: selectedId });
  };

  const handleBedroomChange = (val: string) => {
    const nextBedrooms = bedrooms === val ? "" : val;
    setBedrooms(nextBedrooms);
    applyFiltersWith({ bedrooms: nextBedrooms });
  };
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <Filter size={18} /> Filters
        </h3>
        <button
          onClick={handleClear}
          className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          <X size={14} /> Clear all
        </button>
      </div>

      <form onSubmit={handleApply} className="space-y-6">
        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Location
          </label>
          <input
            type="text"
            placeholder="City, district, or address"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Property Type
          </label>
          <select
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm appearance-none cursor-pointer"
            value={categoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">All Types</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Price Range (BDT)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder="Min"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span className="text-muted-foreground">-</span>
            <input
              type="number"
              placeholder="Max"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Bedrooms
          </label>
          <div className="flex gap-2">
            {["1", "2", "3", "4+"].map((num) => {
              const val = num === "4+" ? "4" : num;
              const isActive = bedrooms === val;
              return (
                <button
                  type="button"
                  key={num}
                  onClick={() => handleBedroomChange(val)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all mt-4"
        >
          Apply Filters
        </button>
      </form>
    </div>
  );
};

export default SearchFilter;

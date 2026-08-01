"use client";

import { MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SearchBox = () => {
  const [city, setCity] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      router.push(`/properties?city=${encodeURIComponent(city.trim())}`);
    } else {
      router.push(`/properties`);
    }
  };

  const popCities = ["Dhaka", "Chattogram", "Sylhet", "Rajshahi", "khulna"];

  return (
    <div className="w-full max-w-3xl mx-auto mt-10">
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-3 p-3 bg-card/60 backdrop-blur-xl border border-border rounded-2xl shadow-xl"
      >
        <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-background rounded-xl border border-border focus-within:right-2 focus-within:ring-primary/20 transition-all">
          <MapPin className="text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Search by city, neighborhood, or address..."
            className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="md:w-32 px-6 py-4 md:py-0 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-sm"
        >
          <Search size={18} />
          Search
        </button>
      </form>
      <div className="flex items-center gap-3 mt-6 justify-center text-sm">
        <span className="text-muted-foreground font-medium">Popular cities:</span>
        <div className="flex gap-2 flex-wrap justify-center">
          {popCities.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCity(c);
                router.push(`/properties?city=${encodeURIComponent(c)}`);
              }}
              className="px-4 py-1.5 rounded-full border border-border bg-card/50 text-foreground hover:bg-muted hover:border-muted-foreground/30 transition-all"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBox;

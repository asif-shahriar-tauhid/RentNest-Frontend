"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PropertyPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

const PropertyPagination = ({
  currentPage,
  totalPages,
  totalItems,
  limit,
}: PropertyPaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1 && totalItems <= limit) return null;

  const createPageUrl = (pageNumber: number, newLimit?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    if (newLimit) {
      params.set("limit", newLimit.toString());
    }
    return `/properties?${params.toString()}`;
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      router.push(createPageUrl(pageNumber));
    }
  };

  const handleLimitChange = (newLimit: number) => {
    router.push(createPageUrl(1, newLimit));
  };

  // Generate page numbers array with ellipsis if necessary
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }

    return pages;
  };

  const fromIndex = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
  const toIndex = Math.min(currentPage * limit, totalItems);

  return (
    <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
      {/* Items Summary & Per-page Selector */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          Showing{" "}
          <strong className="text-foreground font-semibold">{fromIndex}</strong>{" "}
          to{" "}
          <strong className="text-foreground font-semibold">{toIndex}</strong>{" "}
          of{" "}
          <strong className="text-foreground font-semibold">
            {totalItems}
          </strong>{" "}
          properties
        </span>

        <div className="flex items-center gap-2">
          <span>Per page:</span>
          <select
            value={limit}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
            className="px-2 py-1 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value={9}>9</option>
            <option value={18}>18</option>
            <option value={36}>36</option>
            <option value={100}>100 (All)</option>
          </select>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 rounded-xl border border-border bg-card text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          aria-label="Previous Page"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 py-1 text-muted-foreground text-sm"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`min-w-[36px] h-9 px-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "bg-card border border-border text-foreground hover:bg-muted"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 rounded-xl border border-border bg-card text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          aria-label="Next Page"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default PropertyPagination;

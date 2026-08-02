/* eslint-disable react/no-unescaped-entities */
import PropertyCard from "@/components/property/PropertyCard";
import PropertyPagination from "@/components/property/PropertyPagination";
import SearchFilter from "@/components/property/SearchFilter";
import { api } from "@/lib/api";
import { Suspense } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const revalidate = 30;

const PropertiesPage = async (props: { searchParams: Promise<any> }) => {
  const searchParams = await props.searchParams;

  const page = Math.max(1, parseInt(searchParams.page || "1", 10));
  const limit = Math.max(1, parseInt(searchParams.limit || "9", 10));

  const query = new URLSearchParams();
  if (searchParams.city) query.append("city", searchParams.city);
  if (searchParams.categoryId)
    query.append("categoryId", searchParams.categoryId);
  if (searchParams.minPrice) query.append("minPrice", searchParams.minPrice);
  if (searchParams.maxPrice) query.append("maxPrice", searchParams.maxPrice);
  if (searchParams.bedrooms) query.append("bedrooms", searchParams.bedrooms);
  query.append("page", page.toString());
  query.append("limit", limit.toString());

  let properties: any[] = [];
  let categories: any[] = [];
  let meta = {
    page: 1,
    limit: 9,
    total: 0,
  };

  try {
    const [propsData, catsData] = await Promise.all([
      api.properties.getAll(query.toString(), true).catch(() => ({
        properties: [],
        meta: {
          page: 1,
          limit: 9,
          total: 0,
        },
      })),
      api.categories.getAll(true).catch(() => []),
    ]);
    properties = propsData.properties || [];
    meta = propsData.meta || { page, limit, total: properties.length };
    categories = catsData || [];
  } catch (error) {
    console.log(error);
  }

  const totalPages = Math.ceil(meta.total / (meta.limit || 9)) || 1;

  return (
    <div className="bg-background min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-72 shrink-0">
            <div className="sticky top-24">
              <Suspense fallback={<div>Loading filters...</div>}>
                <SearchFilter categories={categories} />
              </Suspense>
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold font-outfit text-foreground">
                  Properties
                </h1>
                <p className="text-muted-foreground mt-1">
                  Found {meta.total} properties matching your criteria.
                </p>
              </div>
            </div>

            {properties.length > 0 ? (
              <>
                <div className="flex flex-col gap-4 sm:gap-5">
                  {properties.map((property: any) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      variant="horizontal"
                    />
                  ))}
                </div>

                <Suspense fallback={null}>
                  <PropertyPagination
                    currentPage={meta.page}
                    totalPages={totalPages}
                    totalItems={meta.total}
                    limit={meta.limit}
                  />
                </Suspense>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-16 text-center border border-border rounded-2xl bg-card">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  No properties found
                </h3>
                <p className="text-muted-foreground mt-2 max-w-sm">
                  We could'nt find any properties matching your current
                  filters. Try adjusting your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;

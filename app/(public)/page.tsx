/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AnimatedCategories,
  AnimatedCTA,
  AnimatedFeaturedProperties,
  AnimatedHero,
  AnimatedHowItWorks,
} from "@/components/home/homeAnimations";
import { api } from "@/lib/api";

export const revalidate = 60;

const HomePage = async () => {
  let categories: any[] = [];
  let featuredProperties: any[] = [];

  try {
    const [categoriesData, propertiesData] = await Promise.all([
      api.categories.getAll(true).catch(() => []),
      api.properties.getAll("limit=10", true).catch(() => ({ properties: [] })),
    ]);
    categories = categoriesData;
    featuredProperties = propertiesData.properties || [];
  } catch (error) {
    console.error("Failed to fetch data in homepage", error);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AnimatedHero />
      <AnimatedCategories categories={categories} />
      <AnimatedFeaturedProperties featuredProperties={featuredProperties} />
      <AnimatedHowItWorks />
      <AnimatedCTA />
    </div>
  );
};

export default HomePage;

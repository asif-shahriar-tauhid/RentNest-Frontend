"use client";

import { motion, Variants } from "framer-motion";
import { Building2, Sparkles } from "lucide-react";
import SearchBox from "../property/SearchBox";
import Link from "next/link";

const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const scaleIn: Variants = {
  hidden: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export const AnimatedHero = () => {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 right-0 w-175 h-137.5 bg-primary/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 -z-10 pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-0 left-0 w-150 h-125 bg-primary/15 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 -z-10 pointer-events-none"
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 md:px-6 text-center relative z-10"
      >
        <motion.div variants={fadeInUp} className="inline-block mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 shadow-sm backdrop-blur-md">
            <Sparkles size={14} className="animate-spin-slow text-primary" />
            <span>The New Standard in Renting</span>
          </div>
        </motion.div>
        <motion.h1
          variants={fadeInUp}
          className="text-5xl md:text-7xl font-extrabold font-outfit text-foreground tracking-tight max-w-4xl mx-auto leading-[1.1]"
        >
          Find your perfect home, <br />
          <motion.span
            initial={{ backgroundPosition: "0% 50%" }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary/80 to-primary/50 bg-size-[200%_auto]"
          >
            without the hassle.
          </motion.span>
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal"
        >
          RentNest connects premium tenants with verified landlords. Experience
          seamless renting, instant payments, and complete peace of mind.
        </motion.p>

        <motion.div variants={scaleIn} className="mt-4">
          <SearchBox />
        </motion.div>
      </motion.div>
    </section>
  );
};

export const AnimatedCategories = ({ categories }: { categories: any[] }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: "-50px",
          }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold font-outfit text-foreground tracking-tight">
            Browse by Category
          </h2>
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
            Explore Types
          </span>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            margin: "-50px",
          }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {categories.map((category: any) => (
            <motion.div
              key={category.id}
              variants={fadeInUp}
              whileHover={{
                y: -6,
                scale: 1.03,
              }}
              whileTap={{ scale: 0.98 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
            >
              <Link
                href={`/properties?categoryId=${category.id}`}
                className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-border bg-card hover:bg-primary/5 hover:border-primary/40 hover:shadow-lg transition-all text-center h-full"
              >
                <div className="w-12 h-12 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center mb-4 transition-colors">
                  <Building2
                    className="text-muted-foreground group-hover:text-primary transition-colors"
                    size={24}
                  ></Building2>
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

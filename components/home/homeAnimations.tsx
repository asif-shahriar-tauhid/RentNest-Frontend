/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Key,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import SearchBox from "../property/SearchBox";
import Link from "next/link";
import PropertyCard from "../property/PropertyCard";

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
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 right-0 w-125 h-100 bg-primary/20 rounded-full blur-2xl -translate-y-1/3 translate-x-1/3 -z-10 pointer-events-none transform-gpu will-change-transform"
      />
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-0 left-0 w-112.5 h-95 bg-primary/15 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3 -z-10 pointer-events-none transform-gpu will-change-transform"
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 md:px-6 text-center relative z-10"
      >
        <motion.div variants={fadeInUp} className="inline-block mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 shadow-sm backdrop-blur-sm">
            <Sparkles size={14} className="text-primary" />
            <span>The New Standard in Renting</span>
          </div>
        </motion.div>
        <motion.h1
          variants={fadeInUp}
          className="text-5xl md:text-7xl font-extrabold font-outfit text-foreground tracking-tight max-w-4xl mx-auto leading-[1.1]"
        >
          Find your perfect home, <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary/90 to-primary/60">
            without the hassle.
          </span>
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

export const AnimatedFeaturedProperties = ({
  featuredProperties,
}: {
  featuredProperties: any[];
}) => {
  return (
    <section className="py-20 bg-muted/30 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
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
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <h2 className="text-3xl font-bold font-outfit text-foreground tracking-tight">
              Featured Properties
            </h2>
            <p className="text-muted-foreground mt-2">
              Handpicked exclusive listings. Scroll horizontally to explore
              more.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-background border border-border text-foreground font-semibold hover:bg-muted transition-all shadow-sm shrink-0"
            >
              <span>View All Properties</span>
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: "-50px",
          }}
          transition={{
            duration: 0.6,
            delay: 0.1,
          }}
          className="flex gap-6 overflow-x-auto pb-6 pt-1 snap-x snap-mandatory -mx-4 px-4 md:-mx-6 md:px-6 scrollbar-thin"
        >
          {featuredProperties.map((property: any, index: number) => (
            <motion.div
              key={property.id}
              initial={{
                opacity: 0,
                x: 30,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
              className="w-75 sm:w-85 lg:w-[calc(33.333%-16px)] shrink-0 snap-start"
            >
              <PropertyCard property={property} variant="vertical" />
            </motion.div>
          ))}
          {featuredProperties.length === 0 && (
            <div className="w-full py-20 text-center text-muted-foreground">
              No featured properties available at the moment.
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export const AnimatedHowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "1. Discover",
      desc: "Browse thousands of verified properties with high-quality photos and detailed amenities.",
    },
    {
      icon: ShieldCheck,
      title: "2. Request & Approve",
      desc: "Submit a rental request securely. Landlords review and approve instantly.",
    },
    {
      icon: Key,
      title: "3. Pay & Move In",
      desc: "Pay rent online via Stripe and get the keys. Your digital lease is fully managed.",
    },
  ];
  return (
    <section className="py-24 bg-background overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
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
        >
          <h2 className="text-3xl font-bold font-outfit text-foreground mb-4">
            How RentNest Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-16">
            We&apos;ve simplified the process so you can focus on what matters
            most — moving into your new home.{" "}
          </p>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            margin: "-50px",
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 relative"
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className="flex flex-col items-center group p-6 rounded-3xl border border-border/50 bg-card/40 hover:bg-card hover:border-border hover:shadow-xl transition-all"
            >
              <motion.div
                whileHover={{
                  rotate: 12,
                  scale: 1.1,
                }}
                className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 relative"
              >
                <div className="absolute inset-0 border-2 border-primary/20 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform" />
                <step.icon size={28} className="text-primary relative z-10" />
              </motion.div>
              <h3 className="text-xl font-bold text-foreground mb-3 font-outfit">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export const AnimatedCTA = () => {
  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-100 h-100 bg-white/10 rounded-full blur-2xl pointer-events-none -translate-y-1/2 translate-x-1/3 transform-gpu will-change-transform"
      />
      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center relative z-10">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold font-outfit text-primary-foreground mb-6 tracking-tight">
            Ready to find your nest?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of tenants and landlords experiencing the future of
            property rentals today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto"
            >
              <Link
                href="/register"
                className="block w-full sm:w-auto px-8 py-4 rounded-xl bg-background text-foreground font-bold hover:bg-muted transition-all shadow-xl text-center"
              >
                Get Started for Free
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto"
            >
              <Link
                href="/properties"
                className="block w-full sm:w-auto px-8 py-4 rounded-xl bg-primary-foreground/10 text-primary-foreground font-bold border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-all text-center"
              >
                Browse Properties
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

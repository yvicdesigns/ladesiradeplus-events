"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Category } from "@/lib/supabase/types";
import { createClient } from "@/lib/supabase/client";

export function CategoriesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("categories")
      .select("*")
      .order("sort_order")
      .limit(12)
      .then(({ data }) => setCategories(data ?? []));
  }, []);

  if (!categories.length) return null;

  return (
    <section ref={ref} className="py-20 md:py-28 bg-charcoal-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="section-subtitle">Explorez</p>
          <h2 className="section-title">Notre collection</h2>
          <div className="separator-gold mt-4 mb-4" />
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
            Découvrez notre gamme complète de matériel de décoration pour tous types d&apos;événements
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <Link
                href={`/catalogue?category=${cat.slug}`}
                className="group block glass-card rounded-2xl p-5 text-center hover-gold-border transition-all duration-300 hover:scale-105"
              >
                <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </span>
                <h3 className="text-sm font-semibold text-off-white group-hover:text-gold transition-colors leading-tight">
                  {cat.name_fr}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 btn-outline-gold px-8 py-3.5 rounded-full font-semibold group"
          >
            Voir tout le catalogue
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

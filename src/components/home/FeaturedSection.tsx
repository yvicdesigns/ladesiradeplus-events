"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Plus } from "lucide-react";
import { ArticleWithCategory } from "@/lib/supabase/types";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export function FeaturedSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const addItem = useCartStore((s) => s.addItem);
  const [featured, setFeatured] = useState<ArticleWithCategory[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("articles")
      .select("*, categories(name_fr, name_en, icon)")
      .eq("is_featured", true)
      .eq("is_active", true)
      .limit(4)
      .then(({ data }) => setFeatured((data ?? []) as ArticleWithCategory[]));
  }, []);

  if (!featured.length) return null;

  return (
    <section ref={ref} className="py-20 md:py-28 bg-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="section-subtitle">Sélection</p>
          <h2 className="section-title">Articles phares</h2>
          <div className="separator-gold mt-4 mb-4" />
          <p className="text-gray-400 max-w-lg mx-auto text-sm md:text-base">
            Nos articles les plus populaires, sélectionnés pour leur élégance et leur qualité
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {featured.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card rounded-2xl overflow-hidden group hover-gold-border transition-all duration-300 hover:translate-y-[-4px]"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={article.images?.[0] ?? "/placeholder.jpg"}
                  alt={article.name_fr}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 rounded-full bg-gold/90 text-charcoal-deep text-xs font-bold">
                    ✨ Populaire
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    article.stock_available > 0
                      ? "bg-green-500/80 text-white"
                      : "bg-red-500/80 text-white"
                  }`}>
                    {article.stock_available > 0 ? "Disponible" : "Rupture"}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <p className="text-xs text-gold uppercase tracking-wider mb-1">
                  {article.categories?.name_fr ?? ""}
                </p>
                <h3 className="font-semibold text-off-white text-sm mb-2 line-clamp-2">
                  {article.name_fr}
                </h3>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <span className="text-gold font-bold">{formatPrice(article.price_per_day)}</span>
                    <span className="text-gray-500 text-xs"> /jour</span>
                  </div>
                  <button
                    onClick={() => addItem(article)}
                    className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-charcoal-deep transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 btn-gold px-8 py-3.5 rounded-full font-semibold group"
          >
            Voir tout le catalogue
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

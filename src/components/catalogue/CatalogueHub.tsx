"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Plus } from "lucide-react";
import { ArticleWithCategory } from "@/lib/supabase/types";
import { ServiceInfo } from "@/data/mock";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

const serviceStyles: Record<string, { accent: string; glow: string; border: string }> = {
  logistique: { accent: "text-blue-400", glow: "bg-blue-500/10", border: "border-blue-500/20 hover:border-blue-400/50" },
  traiteur: { accent: "text-amber-400", glow: "bg-amber-500/10", border: "border-amber-500/20 hover:border-amber-400/50" },
  decoration: { accent: "text-gold", glow: "bg-gold/10", border: "border-gold/20 hover:border-gold/50" },
};

interface Props {
  services: ServiceInfo[];
  serviceData: Record<string, { featured: ArticleWithCategory[]; count: number }>;
}

export function CatalogueHub({ services, serviceData }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="min-h-screen bg-charcoal-deep pt-20">
      {/* Header */}
      <div className="relative py-16 bg-charcoal border-b border-gold/10 overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle, #C9A84C 1px, transparent 1px)", backgroundSize: "30px 30px" }}
        />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gold/5 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="section-subtitle">Explorez</p>
            <h1 className="section-title mb-3">Tous nos catalogues</h1>
            <p className="text-gray-400 max-w-lg mx-auto text-sm md:text-base">
              Choisissez un pôle de service pour découvrir nos articles disponibles
            </p>
          </motion.div>
        </div>
      </div>

      {/* Service sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {services.map((service, si) => {
          const data = serviceData[service.key];
          const featured = data?.featured ?? [];
          const count = data?.count ?? 0;
          const style = serviceStyles[service.key];

          return (
            <motion.section
              key={service.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.1, duration: 0.6 }}
            >
              {/* Section header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${style.glow} border ${style.border} flex items-center justify-center text-2xl`}>
                    {service.icon}
                  </div>
                  <div>
                    <h2 className={`font-playfair text-2xl font-bold ${style.accent}`}>{service.name_fr}</h2>
                    <p className="text-gray-400 text-sm">{service.tagline_fr} — {count} article{count !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                <Link
                  href={service.href}
                  className={`hidden sm:flex items-center gap-2 text-sm font-semibold ${style.accent} hover:opacity-80 transition-opacity group`}
                >
                  Voir tout
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Featured articles grid */}
              {featured.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {featured.map((article, i) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: si * 0.1 + i * 0.08 }}
                      className={`glass-card rounded-2xl overflow-hidden group border ${style.border} transition-all duration-300 hover:translate-y-[-3px]`}
                    >
                      <Link href={`/article/${article.slug}`}>
                        <div className="relative h-36 overflow-hidden">
                          <Image
                            src={article.images?.[0] ?? "/placeholder.jpg"}
                            alt={article.name_fr}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="25vw"
                          />
                          <div className="absolute top-2 left-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
                              article.stock_available > 0 ? "bg-green-500/80 text-white" : "bg-red-500/80 text-white"
                            }`}>
                              {article.stock_available > 0 ? "✓" : "✗"}
                            </span>
                          </div>
                        </div>
                      </Link>
                      <div className="p-3">
                        <Link href={`/article/${article.slug}`}>
                          <h3 className="text-xs font-semibold line-clamp-2 mb-1 hover:text-gold transition-colors text-off-white">
                            {article.name_fr}
                          </h3>
                        </Link>
                        <div className="flex items-center justify-between mt-2">
                          <div>
                            <span className={`text-xs font-bold ${style.accent}`}>{formatPrice(article.price_per_day)}</span>
                            <span className="text-gray-500 text-[10px]"> {article.unit_fr}</span>
                          </div>
                          <button
                            onClick={() => addItem(article)}
                            disabled={article.stock_available === 0}
                            className="w-7 h-7 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-charcoal-deep transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 text-sm">
                  Aucun article mis en avant pour ce service.{" "}
                  <Link href={service.href} className={`underline ${style.accent}`}>
                    Voir tous les articles
                  </Link>
                </div>
              )}

              {/* Mobile see all */}
              <Link
                href={service.href}
                className={`sm:hidden flex items-center justify-center gap-2 mt-4 text-sm font-semibold ${style.accent} py-2`}
              >
                Voir tous les articles {service.name_fr.toLowerCase()}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}

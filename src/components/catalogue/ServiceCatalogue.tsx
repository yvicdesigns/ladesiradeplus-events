"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, X, Plus, Minus, Heart, ShoppingBag } from "lucide-react";
import { Article, Category, ServiceInfo } from "@/data/mock";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

// ─── Article Card ────────────────────────────────────────────────────────────

function ArticleCard({ article, accentColor }: { article: Article; accentColor: string }) {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const [added, setAdded] = useState(false);

  const cartItem = items.find((i) => i.article.id === article.id);
  const qty = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem(article);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-2xl overflow-hidden group hover-gold-border transition-all duration-300 hover:translate-y-[-4px]"
    >
      <Link href={`/article/${article.slug}`}>
        <div className="relative h-52 overflow-hidden">
          <Image
            src={article.images[0]}
            alt={article.name_fr}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
              article.stock_available > 0
                ? "bg-green-500/80 text-white"
                : "bg-red-500/80 text-white"
            }`}>
              {article.stock_available > 0 ? "✓ Disponible" : "✗ Rupture"}
            </span>
          </div>
          <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-charcoal-deep/60 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors">
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </Link>

      <div className="p-4">
        <p className={`text-xs uppercase tracking-wider mb-1 ${accentColor}`}>
          {article.category_fr}
        </p>
        <Link href={`/article/${article.slug}`}>
          <h3 className="font-semibold text-off-white text-sm mb-1 line-clamp-2 hover:text-gold transition-colors">
            {article.name_fr}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{article.description_fr}</p>

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className={`font-bold text-sm ${accentColor}`}>{formatPrice(article.price_per_day)}</span>
            <span className="text-gray-500 text-xs"> {article.unit_fr}</span>
          </div>
          <p className="text-xs text-gray-500">Stock: {article.stock_available}</p>
        </div>

        {qty > 0 ? (
          <div className="flex items-center justify-between bg-charcoal-soft rounded-full px-3 py-1.5">
            <button
              onClick={() => updateQuantity(article.id, qty - 1)}
              className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-charcoal-deep transition-all"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-sm font-bold text-gold">{qty}</span>
            <button
              onClick={() => updateQuantity(article.id, qty + 1)}
              className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold hover:text-charcoal-deep transition-all"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            disabled={article.stock_available === 0}
            className={`w-full py-2 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              added
                ? "bg-green-500 text-white"
                : article.stock_available === 0
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "btn-gold"
            }`}
          >
            {added ? <>✓ Ajouté</> : <><Plus className="w-4 h-4" /> Ajouter au panier</>}
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main catalogue component ────────────────────────────────────────────────

interface ServiceCatalogueProps {
  service: ServiceInfo;
  articles: Article[];
  categories: Category[];
  accentColor: string;
  accentBg: string;
}

type SortOption = "default" | "price_asc" | "price_desc" | "name_asc";

export function ServiceCatalogue({ service, articles, categories, accentColor, accentBg }: ServiceCatalogueProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sort, setSort] = useState<SortOption>("default");
  const [filterOpen, setFilterOpen] = useState(false);
  const totalItems = useCartStore((s) => s.getTotalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);

  const filtered = useMemo(() => {
    let result = [...articles];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) => a.name_fr.toLowerCase().includes(q) || a.description_fr.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== "all") {
      result = result.filter((a) => a.category_id === selectedCategory);
    }
    if (sort === "price_asc") result.sort((a, b) => a.price_per_day - b.price_per_day);
    if (sort === "price_desc") result.sort((a, b) => b.price_per_day - a.price_per_day);
    if (sort === "name_asc") result.sort((a, b) => a.name_fr.localeCompare(b.name_fr));
    return result;
  }, [articles, search, selectedCategory, sort]);

  return (
    <div className="min-h-screen bg-charcoal-deep pt-20">
      {/* Service header */}
      <div className="relative py-16 border-b border-gold/10 overflow-hidden">
        <div className={`absolute inset-0 ${accentBg} opacity-30`} />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle, #C9A84C 1px, transparent 1px)", backgroundSize: "30px 30px" }}
        />
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-10"
          style={{ background: `radial-gradient(circle, ${service.color}, transparent)` }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-5xl">{service.icon}</span>
            </div>
            <p className={`section-subtitle text-center ${accentColor}`}>Pôle</p>
            <h1 className="section-title text-center mb-2">{service.name_fr}</h1>
            <p className={`text-center italic font-medium mb-3 ${accentColor}`}>&ldquo;{service.tagline_fr}&rdquo;</p>
            <p className="text-gray-400 text-center text-sm md:text-base max-w-xl mx-auto">
              {service.description_fr}
            </p>
            <p className="text-center text-sm text-gray-500 mt-2">
              {articles.length} article{articles.length > 1 ? "s" : ""} disponible{articles.length > 1 ? "s" : ""}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Rechercher en ${service.name_fr.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-charcoal border border-gold/20 focus:border-gold rounded-full py-2.5 pl-10 pr-4 text-sm text-off-white placeholder:text-gray-500 outline-none transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="bg-charcoal border border-gold/20 focus:border-gold rounded-full py-2.5 px-4 text-sm text-off-white outline-none appearance-none"
          >
            <option value="default">Trier par défaut</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="name_asc">Nom A-Z</option>
          </select>

          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 btn-outline-gold px-4 py-2.5 rounded-full text-sm ${filterOpen ? "bg-gold/10" : ""}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtrer
          </button>
        </div>

        {/* Category filters */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 py-4 border-y border-gold/10">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === "all"
                      ? "bg-gold text-charcoal-deep"
                      : "border border-gold/30 text-gray-300 hover:border-gold hover:text-gold"
                  }`}
                >
                  Tout ({articles.length})
                </button>
                {categories.map((cat) => {
                  const count = articles.filter((a) => a.category_id === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                        selectedCategory === cat.id
                          ? "bg-gold text-charcoal-deep"
                          : "border border-gold/30 text-gray-300 hover:border-gold hover:text-gold"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      {cat.name_fr}
                      <span className="text-xs opacity-70">({count})</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-400">
            <span className={`font-semibold ${accentColor}`}>{filtered.length}</span>{" "}
            article{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
          </p>
          {totalItems > 0 && (
            <button
              onClick={toggleCart}
              className="flex items-center gap-2 btn-gold px-4 py-2 rounded-full text-sm font-semibold"
            >
              <ShoppingBag className="w-4 h-4" />
              Panier ({totalItems})
            </button>
          )}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={`${search}-${selectedCategory}-${sort}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {filtered.map((article) => (
                <ArticleCard key={article.id} article={article} accentColor={accentColor} />
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-gray-400">Aucun article trouvé</p>
              <button
                onClick={() => { setSearch(""); setSelectedCategory("all"); }}
                className="mt-4 btn-outline-gold px-6 py-2 rounded-full text-sm"
              >
                Réinitialiser les filtres
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

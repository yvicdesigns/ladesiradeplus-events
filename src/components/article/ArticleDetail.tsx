"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, Plus, Minus, ShoppingBag, MessageCircle, Heart, Check } from "lucide-react";
import { ArticleWithCategory } from "@/lib/supabase/types";
import { services } from "@/data/mock";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { generateWhatsAppLink } from "@/lib/whatsapp";

const serviceAccent: Record<string, string> = {
  logistique: "text-blue-400",
  traiteur: "text-amber-400",
  decoration: "text-gold",
};

const serviceBreadcrumb: Record<string, { label: string; href: string }> = {
  logistique: { label: "Logistique", href: "/logistique" },
  traiteur: { label: "Traiteur", href: "/traiteur" },
  decoration: { label: "Décoration", href: "/decoration" },
};

interface Props {
  article: ArticleWithCategory;
  relatedArticles: ArticleWithCategory[];
}

export function ArticleDetail({ article, relatedArticles }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const cartQty = items.find((i) => i.article.id === article.id)?.quantity || 0;

  const serviceInfo = services.find((s) => s.key === article.service)!;
  const accent = serviceAccent[article.service];
  const breadcrumb = serviceBreadcrumb[article.service];

  const handleAddToCart = () => {
    addItem(article, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const quickWhatsApp = generateWhatsAppLink({
    items: [{ article, quantity }],
    customerName: "Client",
    customerPhone: "",
    eventDate: "",
    totalPrice: article.price_per_day * quantity,
  });

  const images = article.images?.length ? article.images : ["/placeholder.jpg"];

  return (
    <div className="min-h-screen bg-charcoal-deep pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8 flex-wrap">
          <Link href="/" className="hover:text-gold transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/catalogue" className="hover:text-gold transition-colors">Catalogue</Link>
          <span>/</span>
          <Link href={breadcrumb.href} className={`hover:opacity-80 transition-opacity ${accent}`}>
            {serviceInfo?.icon} {breadcrumb.label}
          </Link>
          <span>/</span>
          <span className="text-gray-300">{article.name_fr}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="relative rounded-2xl overflow-hidden h-80 sm:h-96 lg:h-[480px] bg-charcoal-soft">
              <Image
                src={images[selectedImage]}
                alt={article.name_fr}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full backdrop-blur-sm bg-charcoal-deep/70 text-xs font-semibold flex items-center gap-1">
                  <span>{serviceInfo?.icon}</span>
                  <span className={accent}>{serviceInfo?.name_fr}</span>
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                  article.stock_available > 0 ? "bg-green-500/80 text-white" : "bg-red-500/80 text-white"
                }`}>
                  {article.stock_available > 0 ? "✓ Disponible" : "✗ Rupture"}
                </span>
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`Vue ${i + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <Link
              href={breadcrumb.href}
              className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gold transition-colors mb-4"
            >
              <ChevronLeft className="w-4 h-4" />
              Retour à {breadcrumb.label.toLowerCase()}
            </Link>

            <p className={`text-sm font-medium uppercase tracking-wider mb-2 ${accent}`}>
              {article.categories?.name_fr ?? ""}
            </p>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-off-white mb-4">{article.name_fr}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div>
                <span className={`text-3xl font-bold ${accent}`}>{formatPrice(article.price_per_day)}</span>
                <span className="text-gray-400 text-sm ml-1">{article.unit_fr}</span>
              </div>
              <div className="h-8 w-px bg-gold/20" />
              <div className="text-sm text-gray-400">
                Stock : <span className="text-off-white font-semibold">{article.stock_available}</span>
              </div>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-8">{article.description_fr}</p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm text-gray-400">Quantité :</span>
              <div className="flex items-center gap-3 bg-charcoal-soft rounded-full px-4 py-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-charcoal-deep transition-all"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-lg font-bold text-off-white w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(article.stock_available || 99, quantity + 1))}
                  className="w-7 h-7 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-charcoal-deep transition-all"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <span className={`font-semibold ${accent}`}>{formatPrice(article.price_per_day * quantity)}</span>
            </div>

            {cartQty > 0 && (
              <p className="text-sm text-green-400 mb-3">✓ {cartQty} déjà dans votre panier</p>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={article.stock_available === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold transition-all ${
                  added ? "bg-green-500 text-white" : "btn-gold"
                }`}
              >
                {added ? <><Check className="w-5 h-5" /> Ajouté !</> : <><ShoppingBag className="w-5 h-5" /> Ajouter au panier</>}
              </button>
              <a
                href={quickWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 btn-whatsapp py-3.5 px-5 rounded-full font-semibold"
              >
                <MessageCircle className="w-5 h-5" />
                Commander
              </a>
            </div>

            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors">
              <Heart className="w-4 h-4" /> Sauvegarder
            </button>

            {/* Info boxes */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                { icon: "🚚", title: "Livraison", desc: "À domicile à Brazzaville" },
                { icon: "✅", title: "Qualité", desc: "Matériel haut de gamme" },
                { icon: "💬", title: "Support", desc: "Réponse WhatsApp rapide" },
                { icon: "🔄", title: "Retour", desc: "Récupération incluse" },
              ].map((info) => (
                <div key={info.title} className="glass-card rounded-xl p-3 flex items-start gap-2">
                  <span className="text-lg">{info.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-off-white">{info.title}</p>
                    <p className="text-xs text-gray-400">{info.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-20">
            <h2 className="font-playfair text-2xl font-bold text-off-white mb-8">Articles similaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/article/${related.slug}`}
                  className="group glass-card rounded-xl overflow-hidden border border-transparent hover:border-gold/30 transition-all"
                >
                  <div className="relative h-36 overflow-hidden">
                    <Image
                      src={related.images?.[0] ?? "/placeholder.jpg"}
                      alt={related.name_fr}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="25vw"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium line-clamp-2 text-off-white">{related.name_fr}</p>
                    <p className="text-sm font-bold mt-1 text-gold">{formatPrice(related.price_per_day)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

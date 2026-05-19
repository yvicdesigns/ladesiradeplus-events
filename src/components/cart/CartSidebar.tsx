"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export function CartSidebar() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-[60] bg-charcoal glass-card-charcoal flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gold/20">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-gold" />
                <span className="font-playfair text-lg font-bold text-off-white">Mon Panier</span>
                {items.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-gold text-charcoal-deep text-xs font-bold">
                    {items.length}
                  </span>
                )}
              </div>
              <button onClick={toggleCart} className="text-gray-400 hover:text-gold transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <ShoppingBag className="w-12 h-12 text-gray-600 mb-3" />
                  <p className="text-gray-400">Votre panier est vide</p>
                  <p className="text-sm text-gray-500 mt-1">Ajoutez des articles depuis le catalogue</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.article.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-3 p-3 rounded-xl glass-card hover-gold-border"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-charcoal-soft">
                      <Image
                        src={item.article.images[0]}
                        alt={item.article.name_fr}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-off-white truncate">{item.article.name_fr}</p>
                      <p className="text-xs text-gold mt-0.5">{formatPrice(item.article.price_per_day)} / jour</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.article.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-charcoal-deep transition-all"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.article.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-charcoal-deep transition-all"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.article.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <p className="text-sm font-bold text-gold">
                        {formatPrice(item.article.price_per_day * item.quantity)}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-gold/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total estimé</span>
                  <span className="text-xl font-bold text-gold">{formatPrice(getTotalPrice())}</span>
                </div>
                <Link
                  href="/panier"
                  onClick={toggleCart}
                  className="btn-gold w-full py-3 rounded-full font-semibold text-center block"
                >
                  Finaliser ma commande
                </Link>
                <button
                  onClick={toggleCart}
                  className="btn-outline-gold w-full py-2.5 rounded-full text-sm text-center block"
                >
                  Continuer les achats
                </button>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

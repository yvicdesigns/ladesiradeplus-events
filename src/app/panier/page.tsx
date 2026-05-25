"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2, Plus, Minus, MessageCircle, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { createClient } from "@/lib/supabase/client";

const orderSchema = z.object({
  customerName: z.string().min(2, "Nom requis (min. 2 caractères)"),
  customerPhone: z.string().min(9, "Numéro de téléphone requis").regex(/^(\+?242|0)[0-9]{8,9}$/, "Format Congo: +242XXXXXXXXX"),
  eventDate: z.string().min(1, "Date de l'événement requise"),
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
});

type OrderForm = z.infer<typeof orderSchema>;

export default function PanierPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OrderForm>({ resolver: zodResolver(orderSchema) });

  void watch();

  const onSubmit = async (data: OrderForm) => {
    setSaving(true);

    const supabase = createClient();
    try {
      const { data: newOrder, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: data.customerName,
          customer_phone: data.customerPhone,
          event_date: data.eventDate,
          delivery_address: data.deliveryAddress,
          notes: data.notes,
          total_amount: getTotalPrice(),
          status: "pending",
          whatsapp_sent_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (!orderError && newOrder) {
        const orderItems = items.map((item) => ({
          order_id: newOrder.id,
          article_id: item.article.id,
          quantity: item.quantity,
          unit_price: item.article.price_per_day,
          subtotal: item.article.price_per_day * item.quantity,
        }));
        await supabase.from("order_items").insert(orderItems);
      }
    } catch {
      // Order saved to WhatsApp regardless
    }

    const link = generateWhatsAppLink({
      items,
      ...data,
      totalPrice: getTotalPrice(),
    });
    window.open(link, "_blank");
    setSaving(false);
    setSubmitted(true);
  };

  if (items.length === 0 && !submitted) {
    return (
      <div className="min-h-screen bg-charcoal-deep pt-20 flex items-center justify-center">
        <div className="text-center px-4">
          <ShoppingBag className="w-20 h-20 text-gray-600 mx-auto mb-6" />
          <h2 className="font-playfair text-3xl font-bold text-off-white mb-3">Votre panier est vide</h2>
          <p className="text-gray-400 mb-8">Parcourez notre catalogue et ajoutez des articles pour commencer</p>
          <Link href="/catalogue" className="btn-gold px-8 py-3.5 rounded-full font-semibold inline-block">
            Explorer le catalogue
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-charcoal-deep pt-20 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center px-4 max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✅</span>
          </div>
          <h2 className="font-playfair text-3xl font-bold text-off-white mb-3">Commande envoyée !</h2>
          <p className="text-gray-400 mb-6">
            Votre commande a été envoyée sur WhatsApp. Notre équipe vous répondra très bientôt pour confirmer la disponibilité.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { clearCart(); setSubmitted(false); }} className="btn-outline-gold px-6 py-3 rounded-full font-semibold">
              Nouvelle commande
            </button>
            <Link href="/" className="btn-gold px-6 py-3 rounded-full font-semibold">
              Retour à l&apos;accueil
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal-deep pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/catalogue" className="text-gray-400 hover:text-gold transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-playfair text-3xl font-bold text-off-white">Mon Panier</h1>
            <p className="text-gray-400 text-sm">{getTotalItems()} article{getTotalItems() > 1 ? "s" : ""}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Items list */}
          <div className="lg:col-span-3 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.article.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card rounded-2xl p-4 flex gap-4 hover-gold-border"
                >
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-charcoal-soft">
                    <Image src={item.article.images[0]} alt={item.article.name_fr} fill className="object-cover" sizes="96px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gold mb-1">{item.article.service}</p>
                    <h3 className="font-semibold text-off-white text-sm">{item.article.name_fr}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{formatPrice(item.article.price_per_day)} / jour</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 bg-charcoal-soft rounded-full px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.article.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-charcoal-deep transition-all"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.article.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-charcoal-deep transition-all"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-gold font-bold text-sm">
                        {formatPrice(item.article.price_per_day * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.article.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Total */}
            <div className="glass-card rounded-2xl p-5 border border-gold/20">
              <div className="flex items-center justify-between text-lg font-bold">
                <span className="text-gray-300">Total estimé</span>
                <span className="text-2xl text-gold">{formatPrice(getTotalPrice())}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * Prix indicatif par jour de location. Le prix final sera confirmé via WhatsApp.
              </p>
            </div>
          </div>

          {/* Order form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-2xl p-5 space-y-4">
              <h2 className="font-playfair text-lg font-bold text-off-white">Vos informations</h2>

              {/* Name */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Prénom & Nom *</label>
                <input
                  {...register("customerName")}
                  placeholder="Marie-Claire Nzouzi"
                  className="w-full bg-charcoal-soft border border-gold/20 focus:border-gold rounded-xl py-2.5 px-3.5 text-sm text-off-white placeholder:text-gray-500 outline-none transition-colors"
                />
                {errors.customerName && <p className="text-red-400 text-xs mt-1">{errors.customerName.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Téléphone (Congo) *</label>
                <input
                  {...register("customerPhone")}
                  placeholder="+242 064 000 000"
                  className="w-full bg-charcoal-soft border border-gold/20 focus:border-gold rounded-xl py-2.5 px-3.5 text-sm text-off-white placeholder:text-gray-500 outline-none transition-colors"
                />
                {errors.customerPhone && <p className="text-red-400 text-xs mt-1">{errors.customerPhone.message}</p>}
              </div>

              {/* Event date */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Date de l&apos;événement *</label>
                <input
                  type="date"
                  {...register("eventDate")}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full bg-charcoal-soft border border-gold/20 focus:border-gold rounded-xl py-2.5 px-3.5 text-sm text-off-white outline-none transition-colors [color-scheme:dark]"
                />
                {errors.eventDate && <p className="text-red-400 text-xs mt-1">{errors.eventDate.message}</p>}
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Adresse de livraison</label>
                <input
                  {...register("deliveryAddress")}
                  placeholder="Quartier, avenue, Brazzaville..."
                  className="w-full bg-charcoal-soft border border-gold/20 focus:border-gold rounded-xl py-2.5 px-3.5 text-sm text-off-white placeholder:text-gray-500 outline-none transition-colors"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Notes & demandes spéciales</label>
                <textarea
                  {...register("notes")}
                  rows={3}
                  placeholder="Couleurs souhaitées, demandes particulières..."
                  className="w-full bg-charcoal-soft border border-gold/20 focus:border-gold rounded-xl py-2.5 px-3.5 text-sm text-off-white placeholder:text-gray-500 outline-none transition-colors resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={saving}
                className="w-full btn-whatsapp flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-base disabled:opacity-60"
              >
                {saving ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <MessageCircle className="w-6 h-6" />
                )}
                {saving ? "Enregistrement..." : "Envoyer ma commande sur WhatsApp"}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Un message pré-rempli avec votre commande sera ouvert dans WhatsApp
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

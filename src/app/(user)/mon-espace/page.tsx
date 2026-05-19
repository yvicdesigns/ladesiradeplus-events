"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, ShoppingBag, Heart, Calendar, Settings, LogOut, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const mockOrders = [
  { id: "CMD-001", date: "2026-05-10", event: "Mariage", items: 5, total: 85000, status: "confirmed" },
  { id: "CMD-002", date: "2026-04-20", event: "Anniversaire", items: 3, total: 35000, status: "delivered" },
  { id: "CMD-003", date: "2026-06-15", event: "Baptême", items: 4, total: 55000, status: "pending" },
];

const statusConfig = {
  pending: { label: "En attente", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  confirmed: { label: "Confirmée", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  delivered: { label: "Livrée", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  cancelled: { label: "Annulée", color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

type TabKey = "orders" | "favorites" | "events" | "profile";

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "orders", label: "Commandes", icon: ShoppingBag },
  { key: "favorites", label: "Favoris", icon: Heart },
  { key: "events", label: "Événements", icon: Calendar },
  { key: "profile", label: "Profil", icon: Settings },
];

export default function MonEspacePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("orders");

  return (
    <div className="min-h-screen bg-charcoal-deep pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 md:p-8 mb-8 border border-gold/20"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center">
              <User className="w-8 h-8 text-gold" />
            </div>
            <div className="flex-1">
              <h1 className="font-playfair text-2xl font-bold text-off-white">Marie-Claire Nzouzi</h1>
              <p className="text-gray-400 text-sm">marie@email.com • Membre depuis janvier 2026</p>
              <div className="flex gap-4 mt-2 text-sm">
                <span className="text-gold"><strong>3</strong> commandes</span>
                <span className="text-gray-400"><strong>5</strong> favoris</span>
                <span className="text-gray-400"><strong>2</strong> événements à venir</span>
              </div>
            </div>
            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar tabs */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-3 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? "bg-gold text-charcoal-deep"
                      : "text-gray-400 hover:text-gold hover:bg-gold/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </div>
                  <ChevronRight className={`w-4 h-4 ${activeTab === tab.key ? "opacity-100" : "opacity-0"}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === "orders" && (
              <div className="space-y-4">
                <h2 className="font-playfair text-xl font-bold text-off-white mb-4">Mes commandes</h2>
                {mockOrders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="glass-card rounded-2xl p-5 hover-gold-border transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gold text-sm">{order.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs border ${statusConfig[order.status as keyof typeof statusConfig].color}`}>
                            {statusConfig[order.status as keyof typeof statusConfig].label}
                          </span>
                        </div>
                        <p className="text-sm text-off-white font-medium">{order.event}</p>
                        <p className="text-xs text-gray-400">{order.items} article{order.items > 1 ? "s" : ""} • {new Date(order.date).toLocaleDateString("fr-FR")}</p>
                      </div>
                      <span className="text-gold font-bold">{formatPrice(order.total)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "favorites" && (
              <div>
                <h2 className="font-playfair text-xl font-bold text-off-white mb-4">Mes favoris</h2>
                <div className="glass-card rounded-2xl p-12 text-center">
                  <Heart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Aucun favori pour le moment</p>
                  <p className="text-sm text-gray-500 mt-1">Cliquez sur le ❤️ sur les articles pour les sauvegarder</p>
                </div>
              </div>
            )}

            {activeTab === "events" && (
              <div>
                <h2 className="font-playfair text-xl font-bold text-off-white mb-4">Mes événements</h2>
                <div className="space-y-3">
                  {[
                    { date: "2026-06-15", name: "Baptême de Joseph", status: "upcoming" },
                    { date: "2026-07-20", name: "Mariage Sandrine & Patrick", status: "upcoming" },
                  ].map((event, i) => (
                    <div key={i} className="glass-card rounded-2xl p-4 flex items-center gap-4 hover-gold-border">
                      <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex flex-col items-center justify-center">
                        <span className="text-xs text-gold font-bold">{new Date(event.date).toLocaleDateString("fr-FR", { day: "2-digit" })}</span>
                        <span className="text-xs text-gray-400">{new Date(event.date).toLocaleDateString("fr-FR", { month: "short" })}</span>
                      </div>
                      <div>
                        <p className="font-medium text-off-white text-sm">{event.name}</p>
                        <p className="text-xs text-green-400">À venir</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div>
                <h2 className="font-playfair text-xl font-bold text-off-white mb-4">Mon profil</h2>
                <div className="glass-card rounded-2xl p-6 space-y-4">
                  {[
                    { label: "Prénom", value: "Marie-Claire" },
                    { label: "Nom", value: "Nzouzi" },
                    { label: "Email", value: "marie@email.com" },
                    { label: "Téléphone", value: "+242 064 000 000" },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="text-xs text-gray-400 mb-1 block">{field.label}</label>
                      <input
                        defaultValue={field.value}
                        className="w-full bg-charcoal-soft border border-gold/20 focus:border-gold rounded-xl py-2.5 px-3.5 text-sm text-off-white outline-none transition-colors"
                      />
                    </div>
                  ))}
                  <button className="btn-gold px-6 py-2.5 rounded-full font-semibold text-sm mt-2">
                    Sauvegarder les modifications
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

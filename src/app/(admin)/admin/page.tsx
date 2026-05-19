"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  LayoutDashboard, Package, ShoppingBag, BarChart3, Settings,
  Plus, Edit3, Trash2, MessageCircle, TrendingUp, Users, DollarSign, RefreshCw
} from "lucide-react";
import { mockArticles, mockCategories } from "@/data/mock";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Order, OrderStatus } from "@/lib/supabase/types";

type AdminTab = "dashboard" | "catalogue" | "orders" | "stats" | "settings";

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "En attente", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  confirmed: { label: "Confirmée", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  delivered: { label: "Livrée", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  cancelled: { label: "Annulée", color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

const tabs: { key: AdminTab; label: string; icon: React.ElementType }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "catalogue", label: "Catalogue", icon: Package },
  { key: "orders", label: "Commandes", icon: ShoppingBag },
  { key: "stats", label: "Statistiques", icon: BarChart3 },
  { key: "settings", label: "Paramètres", icon: Settings },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const supabase = createClient();

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    setOrders(data ?? []);
    setLoadingOrders(false);
  }, [supabase]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (id: string, status: string) => {
    const s = status as OrderStatus;
    await supabase.from("orders").update({ status: s }).eq("id", id);
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: s } : o))
    );
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount ?? 0), 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const thisMonth = orders.filter((o) => {
    const d = new Date(o.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  return (
    <div className="min-h-screen bg-charcoal-deep pt-16">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-charcoal border-r border-gold/10 hidden lg:flex flex-col pt-6 px-4">
          <div className="flex items-center gap-2 px-2 mb-8">
            <span className="text-2xl">✿</span>
            <div>
              <span className="font-playfair text-gold font-bold text-sm block">La Désirade</span>
              <span className="text-xs text-gray-500">Administration</span>
            </div>
          </div>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-gold/10 text-gold border border-gold/20"
                    : "text-gray-400 hover:text-gold hover:bg-gold/5"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.key === "orders" && pendingCount > 0 && (
                  <span className="ml-auto bg-gold text-charcoal-deep text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile tabs */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-charcoal border-t border-gold/10 flex">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-all relative ${
                activeTab === tab.key ? "text-gold" : "text-gray-500"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="hidden sm:block">{tab.label}</span>
              {tab.key === "orders" && pendingCount > 0 && (
                <span className="absolute top-1.5 right-1/4 bg-gold text-charcoal-deep text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 px-4 sm:px-6 py-6 pb-20 lg:pb-6">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-playfair text-2xl font-bold text-off-white mb-6">Tableau de bord</h1>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { icon: ShoppingBag, label: "Commandes ce mois", value: String(thisMonth.length), color: "text-blue-400" },
                  { icon: DollarSign, label: "CA total", value: formatPrice(totalRevenue), color: "text-green-400" },
                  { icon: Users, label: "En attente", value: String(pendingCount), color: "text-yellow-400" },
                  { icon: TrendingUp, label: "Total commandes", value: String(orders.length), color: "text-gold" },
                ].map((kpi, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="glass-card rounded-2xl p-4 hover-gold-border"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                    </div>
                    <p className="font-bold text-off-white text-lg">{kpi.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{kpi.label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-off-white">Dernières commandes</h2>
                  <button onClick={fetchOrders} className="text-gray-400 hover:text-gold transition-colors">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                {loadingOrders ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-14 bg-charcoal-soft rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-6">Aucune commande pour le moment</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between gap-3 py-2 border-b border-gold/10 last:border-0">
                        <div>
                          <span className="text-xs text-gold font-bold font-mono">{order.id.slice(0, 8).toUpperCase()}</span>
                          <p className="text-sm text-off-white">{order.customer_name}</p>
                          <p className="text-xs text-gray-400">{new Date(order.event_date).toLocaleDateString("fr-FR")}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gold font-bold text-sm">{formatPrice(order.total_amount)}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs border ${statusConfig[order.status]?.color ?? statusConfig.pending.color}`}>
                            {statusConfig[order.status]?.label ?? "En attente"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Catalogue management */}
          {activeTab === "catalogue" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-playfair text-2xl font-bold text-off-white">Gestion du catalogue</h1>
                <button className="btn-gold flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold">
                  <Plus className="w-4 h-4" /> Nouvel article
                </button>
              </div>

              <div className="mb-6">
                <h2 className="text-sm text-gray-400 font-medium mb-3">Catégories ({mockCategories.length})</h2>
                <div className="flex flex-wrap gap-2">
                  {mockCategories.map((cat) => (
                    <span key={cat.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card border border-gold/20 text-sm">
                      <span>{cat.icon}</span>
                      <span className="text-off-white">{cat.name_fr}</span>
                      <span className="text-gold text-xs">({cat.count})</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gold/10">
                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Article</th>
                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium hidden sm:table-cell">Catégorie</th>
                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Prix/jour</th>
                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium hidden md:table-cell">Stock</th>
                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Statut</th>
                        <th className="text-right px-4 py-3 text-xs text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockArticles.map((article) => (
                        <tr key={article.id} className="border-b border-gold/5 hover:bg-gold/3 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-charcoal-soft">
                                <Image src={article.images[0]} alt={article.name_fr} fill className="object-cover" sizes="40px" />
                              </div>
                              <span className="text-off-white text-xs font-medium line-clamp-2">{article.name_fr}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <span className="text-xs text-gray-400">{article.category_fr}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-gold text-xs font-semibold">{formatPrice(article.price_per_day)}</span>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className="text-off-white text-xs">{article.stock_available}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs border ${article.is_active ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}>
                              {article.is_active ? "Actif" : "Inactif"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="text-gray-400 hover:text-gold transition-colors">
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button className="text-gray-400 hover:text-red-400 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Orders management */}
          {activeTab === "orders" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-playfair text-2xl font-bold text-off-white">Gestion des commandes</h1>
                <button onClick={fetchOrders} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gold transition-colors">
                  <RefreshCw className="w-4 h-4" /> Actualiser
                </button>
              </div>

              {loadingOrders ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-charcoal-soft rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Aucune commande reçue pour le moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, i) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass-card rounded-2xl p-5 hover-gold-border"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gold text-xs font-mono">{order.id.slice(0, 8).toUpperCase()}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs border ${statusConfig[order.status]?.color ?? statusConfig.pending.color}`}>
                              {statusConfig[order.status]?.label ?? "En attente"}
                            </span>
                          </div>
                          <p className="font-semibold text-off-white">{order.customer_name}</p>
                          <p className="text-xs text-gray-400">
                            {order.customer_phone} • Événement le {new Date(order.event_date).toLocaleDateString("fr-FR")}
                          </p>
                          {order.notes && (
                            <p className="text-xs text-gray-500 mt-1 italic">{order.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-gold font-bold">{formatPrice(order.total_amount)}</span>
                          <a
                            href={`https://wa.me/${order.customer_phone.replace(/[\s+]/g, "")}?text=Bonjour%20${encodeURIComponent(order.customer_name)}%20!%20Concernant%20votre%20demande%20de%20location...`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 btn-whatsapp px-3 py-1.5 rounded-full text-xs font-semibold"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            Répondre
                          </a>
                          <select
                            value={order.status}
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                            className="bg-charcoal-soft border border-gold/20 rounded-full py-1.5 px-3 text-xs text-off-white outline-none"
                          >
                            <option value="pending">En attente</option>
                            <option value="confirmed">Confirmée</option>
                            <option value="delivered">Livrée</option>
                            <option value="cancelled">Annulée</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Stats */}
          {activeTab === "stats" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-playfair text-2xl font-bold text-off-white mb-6">Statistiques</h1>

              <div className="glass-card rounded-2xl p-5 mb-6">
                <h2 className="font-semibold text-off-white mb-4">Répartition par statut</h2>
                <div className="space-y-3">
                  {Object.entries(statusConfig).map(([key, cfg]) => {
                    const count = orders.filter((o) => o.status === key).length;
                    const pct = orders.length ? Math.round((count / orders.length) * 100) : 0;
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full border w-24 text-center ${cfg.color}`}>{cfg.label}</span>
                        <div className="flex-1">
                          <div className="h-1.5 bg-charcoal-soft rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.7 }}
                              className="h-full bg-gradient-to-r from-gold-dark to-gold-light rounded-full"
                            />
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 w-12 text-right">{count} ({pct}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5">
                <h2 className="font-semibold text-off-white mb-4">Top articles du catalogue</h2>
                <div className="space-y-3">
                  {mockArticles.slice(0, 5).map((article, i) => {
                    const percentage = 100 - i * 18;
                    return (
                      <div key={article.id} className="flex items-center gap-3">
                        <span className="text-gold font-bold text-sm w-4">#{i + 1}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-off-white">{article.name_fr}</span>
                            <span className="text-xs text-gold">{formatPrice(article.price_per_day)}</span>
                          </div>
                          <div className="h-1.5 bg-charcoal-soft rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ delay: i * 0.1, duration: 0.8 }}
                              className="h-full bg-gradient-to-r from-gold-dark to-gold-light rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-playfair text-2xl font-bold text-off-white mb-6">Paramètres</h1>

              <div className="space-y-6">
                <div className="glass-card rounded-2xl p-5">
                  <h2 className="font-semibold text-off-white mb-4">Informations de l&apos;entreprise</h2>
                  <div className="space-y-3">
                    {[
                      { label: "Nom de l'entreprise", value: "La Désirade Événements" },
                      { label: "Numéro WhatsApp", value: "+242 064 000 000" },
                      { label: "Email de contact", value: "contact@ladesirade.com" },
                      { label: "Adresse", value: "Brazzaville, République du Congo" },
                    ].map((f) => (
                      <div key={f.label}>
                        <label className="text-xs text-gray-400 mb-1 block">{f.label}</label>
                        <input
                          defaultValue={f.value}
                          className="w-full bg-charcoal-soft border border-gold/20 focus:border-gold rounded-xl py-2.5 px-3.5 text-sm text-off-white outline-none transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-5">
                  <h2 className="font-semibold text-off-white mb-3">Bannière d&apos;annonce</h2>
                  <textarea
                    rows={2}
                    placeholder="Ex: Fermé du 25 décembre au 2 janvier..."
                    className="w-full bg-charcoal-soft border border-gold/20 focus:border-gold rounded-xl py-2.5 px-3.5 text-sm text-off-white placeholder:text-gray-500 outline-none transition-colors resize-none"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <input type="checkbox" id="banner-active" className="accent-gold" />
                    <label htmlFor="banner-active" className="text-xs text-gray-400">Activer la bannière</label>
                  </div>
                </div>

                <button className="btn-gold px-6 py-3 rounded-full font-semibold">
                  Sauvegarder les paramètres
                </button>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}

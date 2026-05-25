"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  LayoutDashboard, Package, ShoppingBag, BarChart3, Settings,
  Plus, Edit3, Trash2, MessageCircle, TrendingUp, Users,
  DollarSign, RefreshCw, X, Save, AlertTriangle, Check, Tag, CheckSquare,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Article, Category, Order, OrderStatus, ServiceType } from "@/lib/supabase/types";
import { ImageUpload } from "@/components/ui/ImageUpload";

// ─── Types ───────────────────────────────────────────────────

type AdminTab = "dashboard" | "catalogue" | "categories" | "orders" | "stats" | "settings";

type ArticleForm = {
  name_fr: string;
  service: ServiceType;
  category_id: string;
  price_per_day: number;
  unit_fr: string;
  stock_available: number;
  description_fr: string;
  image_url: string;
  is_active: boolean;
  is_featured: boolean;
};

const EMPTY_FORM: ArticleForm = {
  name_fr: "", service: "decoration", category_id: "",
  price_per_day: 0, unit_fr: "/jour", stock_available: 0,
  description_fr: "", image_url: "",
  is_active: true, is_featured: false,
};

const statusConfig: Record<string, { label: string; color: string }> = {
  pending:   { label: "En attente", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  confirmed: { label: "Confirmée",  color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  delivered: { label: "Livrée",     color: "bg-green-500/20 text-green-400 border-green-500/30" },
  cancelled: { label: "Annulée",    color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

const serviceLabels: Record<ServiceType, string> = {
  logistique: "Logistique", traiteur: "Traiteur", decoration: "Décoration",
};

const tabs: { key: AdminTab; label: string; icon: React.ElementType }[] = [
  { key: "dashboard",  label: "Dashboard",   icon: LayoutDashboard },
  { key: "catalogue",  label: "Catalogue",   icon: Package },
  { key: "categories", label: "Catégories",  icon: Tag },
  { key: "orders",     label: "Commandes",   icon: ShoppingBag },
  { key: "stats",      label: "Statistiques",icon: BarChart3 },
  { key: "settings",   label: "Paramètres",  icon: Settings },
];

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onChange(); }}
      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
        checked
          ? "bg-gold border-gold"
          : "border-gray-300 dark:border-gray-600 hover:border-gold bg-white dark:bg-charcoal-soft"
      }`}
    >
      {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
    </button>
  );
}

function slugify(str: string) {
  return str.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ─── Article Modal ────────────────────────────────────────────

function ArticleModal({
  open, article, categories, onClose, onSaved,
}: {
  open: boolean;
  article: Article | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const [form, setForm] = useState<ArticleForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (article) {
      setForm({
        name_fr: article.name_fr,
        service: article.service, category_id: article.category_id ?? "",
        price_per_day: article.price_per_day, unit_fr: article.unit_fr,
        stock_available: article.stock_available,
        description_fr: article.description_fr,
        image_url: article.images?.[0] ?? "",
        is_active: article.is_active, is_featured: article.is_featured,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError(null);
  }, [article, open]);

  const filteredCats = categories.filter((c) => c.service === form.service);

  const set = (k: keyof ArticleForm, v: ArticleForm[keyof ArticleForm]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name_fr.trim()) { setError("Le nom en français est requis."); return; }
    if (form.price_per_day <= 0) { setError("Le prix doit être supérieur à 0."); return; }
    setSaving(true); setError(null);

    const payload = {
      name_fr: form.name_fr.trim(),
      name_en: form.name_fr.trim(),
      service: form.service,
      category_id: form.category_id || null,
      price_per_day: form.price_per_day,
      unit_fr: form.unit_fr || "/jour",
      stock_available: form.stock_available,
      description_fr: form.description_fr.trim(),
      description_en: form.description_fr.trim(),
      images: form.image_url ? [form.image_url] : [],
      is_active: form.is_active,
      is_featured: form.is_featured,
    };

    let err;
    if (article) {
      ({ error: err } = await supabase.from("articles").update(payload).eq("id", article.id));
    } else {
      const slug = slugify(form.name_fr) + "-" + Date.now();
      ({ error: err } = await supabase.from("articles").insert({ ...payload, slug }));
    }

    setSaving(false);
    if (err) { setError(err.message); return; }
    onSaved();
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-charcoal-deep/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-charcoal border border-gold/20 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gold/10 sticky top-0 bg-charcoal z-10">
            <h2 className="font-playfair text-lg font-bold text-off-white">
              {article ? "Modifier l'article" : "Nouvel article"}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-off-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Service + Catégorie */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-medium">Service *</label>
                <select
                  value={form.service}
                  onChange={(e) => { set("service", e.target.value as ServiceType); set("category_id", ""); }}
                  className="w-full bg-charcoal-soft border border-gold/20 focus:border-gold rounded-xl py-2.5 px-3 text-sm text-off-white outline-none"
                >
                  {Object.entries(serviceLabels).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-medium">Catégorie</label>
                <select
                  value={form.category_id}
                  onChange={(e) => set("category_id", e.target.value)}
                  className="w-full bg-charcoal-soft border border-gold/20 focus:border-gold rounded-xl py-2.5 px-3 text-sm text-off-white outline-none"
                >
                  <option value="">— Aucune —</option>
                  {filteredCats.map((c) => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name_fr}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Nom */}
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-medium">Nom de l&apos;article *</label>
              <input
                value={form.name_fr}
                onChange={(e) => set("name_fr", e.target.value)}
                placeholder="Arche florale blanche"
                className="w-full bg-charcoal-soft border border-gold/20 focus:border-gold rounded-xl py-2.5 px-3 text-sm text-off-white placeholder:text-gray-500 outline-none transition-colors"
              />
            </div>

            {/* Prix + Unité + Stock */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-medium">Prix (FCFA) *</label>
                <input
                  type="number" min={0}
                  value={form.price_per_day || ""}
                  onChange={(e) => set("price_per_day", Number(e.target.value))}
                  placeholder="35000"
                  className="w-full bg-charcoal-soft border border-gold/20 focus:border-gold rounded-xl py-2.5 px-3 text-sm text-off-white placeholder:text-gray-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-medium">Unité</label>
                <input
                  value={form.unit_fr}
                  onChange={(e) => set("unit_fr", e.target.value)}
                  placeholder="/jour"
                  className="w-full bg-charcoal-soft border border-gold/20 focus:border-gold rounded-xl py-2.5 px-3 text-sm text-off-white placeholder:text-gray-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-medium">Stock dispo</label>
                <input
                  type="number" min={0}
                  value={form.stock_available || ""}
                  onChange={(e) => set("stock_available", Number(e.target.value))}
                  placeholder="5"
                  className="w-full bg-charcoal-soft border border-gold/20 focus:border-gold rounded-xl py-2.5 px-3 text-sm text-off-white placeholder:text-gray-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-medium">Description</label>
              <textarea
                rows={3} value={form.description_fr}
                onChange={(e) => set("description_fr", e.target.value)}
                placeholder="Description détaillée de l'article..."
                className="w-full bg-charcoal-soft border border-gold/20 focus:border-gold rounded-xl py-2.5 px-3 text-sm text-off-white placeholder:text-gray-500 outline-none transition-colors resize-none"
              />
            </div>

            {/* Image */}
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-medium">Image</label>
              <ImageUpload
                value={form.image_url}
                onChange={(url) => set("image_url", url)}
                folder="articles"
              />
            </div>

            {/* Toggles */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <div
                  onClick={() => set("is_active", !form.is_active)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${form.is_active ? "bg-green-500" : "bg-charcoal-soft"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.is_active ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
                <span className="text-sm text-gray-300">Actif</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <div
                  onClick={() => set("is_featured", !form.is_featured)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${form.is_featured ? "bg-gold" : "bg-charcoal-soft"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.is_featured ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
                <span className="text-sm text-gray-300">Mis en avant</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gold/10 flex items-center justify-end gap-3 sticky bottom-0 bg-charcoal">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-sm text-gray-400 hover:text-off-white border border-gold/20 hover:border-gold/40 transition-all"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-gold flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold disabled:opacity-60"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-charcoal-deep/30 border-t-charcoal-deep rounded-full animate-spin" />
              ) : <Save className="w-4 h-4" />}
              {article ? "Enregistrer" : "Créer l'article"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────

function DeleteConfirm({
  article, onCancel, onConfirm, deleting,
}: {
  article: Article;
  onCancel: () => void;
  onConfirm: () => void;
  deleting: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-charcoal-deep/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }}
        className="bg-charcoal border border-red-500/30 rounded-2xl p-6 max-w-sm w-full"
      >
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="font-playfair text-lg font-bold text-off-white text-center mb-2">Supprimer l&apos;article ?</h3>
        <p className="text-sm text-gray-400 text-center mb-6">
          <strong className="text-off-white">{article.name_fr}</strong> sera définitivement supprimé.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-full border border-gold/20 text-sm text-gray-400 hover:text-off-white transition-colors">
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {deleting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Supprimer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Category Modal ───────────────────────────────────────────

type CategoryForm = {
  name_fr: string;
  service: ServiceType;
  slug: string;
  icon: string;
  image_url: string;
  sort_order: number;
};

const EMPTY_CAT_FORM: CategoryForm = {
  name_fr: "", service: "decoration",
  slug: "", icon: "📦", image_url: "", sort_order: 0,
};

const ICON_LIST: Record<ServiceType, string[]> = {
  decoration: ["🌸","🌹","🌺","💐","🌻","🌷","🪷","🎀","🎊","🎉","✨","🕯️","🏮","🪄","🎭","🎪","🎆","🎇","🪩","🌟","💫","🌿","🍃","🌴","🧡","🤍","💛","🩷"],
  traiteur:   ["🍽️","🥂","🍾","🎂","🥗","🍰","🧁","🍫","🥘","🍷","🍹","🥩","🫖","☕","🍻","🥐","🍱","🍣","🥗","🎁"],
  logistique: ["📦","🚐","🚛","🪑","🛋️","🏗️","🔧","📋","🎪","🏟️","🎠","🎡","🎢","⛺","🏕️","🎯","🗂️","📌","🔑","🛠️"],
};

function CategoryModal({
  open, category, onClose, onSaved,
}: {
  open: boolean;
  category: Category | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const [form, setForm] = useState<CategoryForm>(EMPTY_CAT_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setForm({
        name_fr: category.name_fr,
        service: category.service, slug: category.slug,
        icon: category.icon ?? "📦", image_url: category.image_url ?? "",
        sort_order: category.sort_order ?? 0,
      });
    } else {
      setForm(EMPTY_CAT_FORM);
    }
    setError(null);
  }, [category, open]);

  const setF = (k: keyof CategoryForm, v: CategoryForm[keyof CategoryForm]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name_fr.trim()) { setError("Le nom en français est requis."); return; }
    setSaving(true); setError(null);

    const autoSlug = form.slug.trim() || slugify(form.name_fr) + "-" + Date.now();
    const payload = {
      name_fr: form.name_fr.trim(),
      name_en: form.name_fr.trim(),
      service: form.service,
      icon: form.icon.trim() || "📦",
      image_url: form.image_url || null,
      sort_order: form.sort_order,
    };

    let err;
    if (category) {
      ({ error: err } = await supabase.from("categories").update(payload).eq("id", category.id));
    } else {
      ({ error: err } = await supabase.from("categories").insert({ ...payload, slug: autoSlug }));
    }

    setSaving(false);
    if (err) { setError(err.message); return; }
    onSaved();
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-charcoal-deep/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-charcoal border border-gold/20 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gold/10 sticky top-0 bg-charcoal z-10">
            <h2 className="font-playfair text-lg font-bold text-off-white">
              {category ? "Modifier la catégorie" : "Nouvelle catégorie"}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-off-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-medium">Service *</label>
              <select
                value={form.service}
                onChange={(e) => setF("service", e.target.value as ServiceType)}
                className="w-full bg-charcoal-soft border border-gold/20 focus:border-gold rounded-xl py-2.5 px-3 text-sm text-off-white outline-none"
              >
                {Object.entries(serviceLabels).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-2 block font-medium">Icône</label>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-charcoal-soft border border-gold/30 flex items-center justify-center text-xl flex-shrink-0">
                  {form.icon}
                </div>
                <span className="text-xs text-gray-500">Choisissez dans la liste ou saisissez un emoji</span>
              </div>
              <div className="grid grid-cols-10 gap-1 bg-charcoal-soft rounded-xl p-2 max-h-28 overflow-y-auto">
                {(ICON_LIST[form.service] ?? ICON_LIST.decoration).map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setF("icon", emoji)}
                    className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all hover:bg-gold/20 ${form.icon === emoji ? "bg-gold/30 ring-1 ring-gold" : ""}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-medium">Nom français *</label>
              <input
                value={form.name_fr}
                onChange={(e) => setF("name_fr", e.target.value)}
                placeholder="Arches & Structures"
                className="w-full bg-charcoal-soft border border-gold/20 focus:border-gold rounded-xl py-2.5 px-3 text-sm text-off-white placeholder:text-gray-500 outline-none transition-colors"
              />
            </div>


            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-medium">Ordre d&apos;affichage</label>
                <input
                  type="number" min={0}
                  value={form.sort_order || ""}
                  onChange={(e) => setF("sort_order", Number(e.target.value))}
                  placeholder="0"
                  className="w-full bg-charcoal-soft border border-gold/20 focus:border-gold rounded-xl py-2.5 px-3 text-sm text-off-white placeholder:text-gray-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-medium">Image de la catégorie</label>
              <ImageUpload
                value={form.image_url}
                onChange={(url) => setF("image_url", url)}
                folder="categories"
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gold/10 flex items-center justify-end gap-3 sticky bottom-0 bg-charcoal">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-sm text-gray-400 hover:text-off-white border border-gold/20 hover:border-gold/40 transition-all"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-gold flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold disabled:opacity-60"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-charcoal-deep/30 border-t-charcoal-deep rounded-full animate-spin" />
              ) : <Save className="w-4 h-4" />}
              {category ? "Enregistrer" : "Créer la catégorie"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function DeleteCategoryConfirm({
  category, onCancel, onConfirm, deleting,
}: {
  category: Category;
  onCancel: () => void;
  onConfirm: () => void;
  deleting: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-charcoal-deep/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }}
        className="bg-charcoal border border-red-500/30 rounded-2xl p-6 max-w-sm w-full"
      >
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="font-playfair text-lg font-bold text-off-white text-center mb-2">Supprimer la catégorie ?</h3>
        <p className="text-sm text-gray-400 text-center mb-1">
          <strong className="text-off-white">{category.icon} {category.name_fr}</strong>
        </p>
        <p className="text-xs text-gray-500 text-center mb-6">Les articles liés perdront leur catégorie.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-full border border-gold/20 text-sm text-gray-400 hover:text-off-white transition-colors">
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {deleting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Supprimer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────

export default function AdminPage() {
  const [activeTab, setActiveTab]       = useState<AdminTab>("dashboard");
  const [orders, setOrders]             = useState<Order[]>([]);
  const [articles, setArticles]         = useState<Article[]>([]);
  const [categories, setCategories]     = useState<Category[]>([]);
  const [loadingOrders, setLoadingOrders]   = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [modalOpen, setModalOpen]       = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deletingArticle, setDeletingArticle] = useState<Article | null>(null);
  const [deleteLoading, setDeleteLoading]   = useState(false);
  const [savedBanner, setSavedBanner]   = useState(false);
  const [serviceFilter, setServiceFilter] = useState<ServiceType | "all">("all");

  // Category CRUD state
  const [catModalOpen, setCatModalOpen]   = useState(false);
  const [editingCat, setEditingCat]       = useState<Category | null>(null);
  const [deletingCat, setDeletingCat]     = useState<Category | null>(null);
  const [deleteCatLoading, setDeleteCatLoading] = useState(false);
  const [catServiceFilter, setCatServiceFilter] = useState<ServiceType | "all">("all");

  // Sélection multiple
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());
  const [selectedCats, setSelectedCats]         = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting]         = useState(false);

  const supabase = createClient();

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data ?? []);
    setLoadingOrders(false);
  }, [supabase]);

  const fetchCatalogue = useCallback(async () => {
    setLoadingArticles(true);
    const [{ data: arts }, { data: cats }] = await Promise.all([
      supabase.from("articles").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("sort_order"),
    ]);
    setArticles(arts ?? []);
    setCategories(cats ?? []);
    setLoadingArticles(false);
  }, [supabase]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => {
    if (activeTab === "catalogue" || activeTab === "categories") fetchCatalogue();
  }, [activeTab, fetchCatalogue]);

  const updateStatus = async (id: string, status: string) => {
    const s = status as OrderStatus;
    await supabase.from("orders").update({ status: s }).eq("id", id);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: s } : o)));
  };

  const handleDelete = async () => {
    if (!deletingArticle) return;
    setDeleteLoading(true);
    await supabase.from("articles").delete().eq("id", deletingArticle.id);
    setArticles((prev) => prev.filter((a) => a.id !== deletingArticle.id));
    setDeleteLoading(false);
    setDeletingArticle(null);
  };

  const handleDeleteCat = async () => {
    if (!deletingCat) return;
    setDeleteCatLoading(true);
    await supabase.from("categories").delete().eq("id", deletingCat.id);
    setCategories((prev) => prev.filter((c) => c.id !== deletingCat.id));
    setDeleteCatLoading(false);
    setDeletingCat(null);
  };

  const openCreate = () => { setEditingArticle(null); setModalOpen(true); };
  const openEdit   = (a: Article) => { setEditingArticle(a); setModalOpen(true); };
  const openCreateCat = () => { setEditingCat(null); setCatModalOpen(true); };
  const openEditCat   = (c: Category) => { setEditingCat(c); setCatModalOpen(true); };

  const toggleArticle = (id: string) =>
    setSelectedArticles((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleAllArticles = (list: Article[]) =>
    setSelectedArticles(selectedArticles.size === list.length ? new Set() : new Set(list.map((a) => a.id)));

  const toggleCat = (id: string) =>
    setSelectedCats((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleAllCats = (list: Category[]) =>
    setSelectedCats(selectedCats.size === list.length ? new Set() : new Set(list.map((c) => c.id)));

  const bulkDeleteArticles = async () => {
    if (!selectedArticles.size) return;
    setBulkDeleting(true);
    await supabase.from("articles").delete().in("id", Array.from(selectedArticles));
    setArticles((prev) => prev.filter((a) => !selectedArticles.has(a.id)));
    setSelectedArticles(new Set());
    setBulkDeleting(false);
  };

  const bulkDeleteCats = async () => {
    if (!selectedCats.size) return;
    setBulkDeleting(true);
    await supabase.from("categories").delete().in("id", Array.from(selectedCats));
    setCategories((prev) => prev.filter((c) => !selectedCats.has(c.id)));
    setSelectedCats(new Set());
    setBulkDeleting(false);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount ?? 0), 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const thisMonth    = orders.filter((o) => {
    const d = new Date(o.created_at), now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const filteredArticles = serviceFilter === "all"
    ? articles
    : articles.filter((a) => a.service === serviceFilter);

  const getCatName = (id: string | null) => id ? (categories.find((c) => c.id === id)?.name_fr ?? "—") : "—";

  return (
    <div className="min-h-screen bg-charcoal-deep pt-16">
      {/* Modals */}
      <ArticleModal
        open={modalOpen}
        article={editingArticle}
        categories={categories}
        onClose={() => setModalOpen(false)}
        onSaved={fetchCatalogue}
      />
      {deletingArticle && (
        <DeleteConfirm
          article={deletingArticle}
          onCancel={() => setDeletingArticle(null)}
          onConfirm={handleDelete}
          deleting={deleteLoading}
        />
      )}
      <CategoryModal
        open={catModalOpen}
        category={editingCat}
        onClose={() => setCatModalOpen(false)}
        onSaved={fetchCatalogue}
      />
      {deletingCat && (
        <DeleteCategoryConfirm
          category={deletingCat}
          onCancel={() => setDeletingCat(null)}
          onConfirm={handleDeleteCat}
          deleting={deleteCatLoading}
        />
      )}

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

        {/* Mobile bottom tabs */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-charcoal border-t border-gold/10 flex">
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
        <main className="flex-1 px-4 sm:px-6 py-6 pb-20 lg:pb-6 overflow-hidden">

          {/* ── Dashboard ── */}
          {activeTab === "dashboard" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-playfair text-2xl font-bold text-off-white mb-6">Tableau de bord</h1>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { icon: ShoppingBag, label: "Commandes ce mois", value: String(thisMonth.length), color: "text-blue-400" },
                  { icon: DollarSign,  label: "CA total",          value: formatPrice(totalRevenue),  color: "text-green-400" },
                  { icon: Users,       label: "En attente",        value: String(pendingCount),        color: "text-yellow-400" },
                  { icon: TrendingUp,  label: "Total commandes",   value: String(orders.length),       color: "text-gold" },
                ].map((kpi, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card rounded-2xl p-4 hover-gold-border">
                    <kpi.icon className={`w-5 h-5 ${kpi.color} mb-3`} />
                    <p className="font-bold text-off-white text-lg">{kpi.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{kpi.label}</p>
                  </motion.div>
                ))}
              </div>
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-off-white">Dernières commandes</h2>
                  <button onClick={fetchOrders} className="text-gray-400 hover:text-gold transition-colors"><RefreshCw className="w-4 h-4" /></button>
                </div>
                {loadingOrders ? (
                  <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-charcoal-soft rounded-xl animate-pulse" />)}</div>
                ) : orders.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-6">Aucune commande pour le moment</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between gap-3 py-2 border-b border-gold/10 last:border-0">
                        <div>
                          <span className="text-xs text-gold font-bold font-mono">{order.id.slice(0,8).toUpperCase()}</span>
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

          {/* ── Catalogue ── */}
          {activeTab === "catalogue" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="font-playfair text-2xl font-bold text-off-white">Catalogue</h1>
                  <p className="text-sm text-gray-400 mt-0.5">{articles.length} article{articles.length > 1 ? "s" : ""}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={fetchCatalogue} className="text-gray-400 hover:text-gold transition-colors p-2">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button onClick={openCreate} className="btn-gold flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold">
                    <Plus className="w-4 h-4" /> Nouvel article
                  </button>
                </div>
              </div>

              {/* Service filter */}
              <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
                {(["all", "logistique", "traiteur", "decoration"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setServiceFilter(s)}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                      serviceFilter === s
                        ? "bg-gold text-charcoal-deep"
                        : "border border-gold/20 text-gray-400 hover:text-gold"
                    }`}
                  >
                    {s === "all" ? "Tous" : serviceLabels[s]}
                  </button>
                ))}
              </div>

              {/* Barre d'actions groupées */}
              {selectedArticles.size > 0 && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5 mb-3">
                  <span className="text-sm font-medium text-red-400">
                    <CheckSquare className="w-4 h-4 inline mr-1.5" />
                    {selectedArticles.size} article{selectedArticles.size > 1 ? "s" : ""} sélectionné{selectedArticles.size > 1 ? "s" : ""}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedArticles(new Set())}
                      className="text-xs text-gray-400 hover:text-off-white px-3 py-1.5 rounded-lg border border-gold/20 transition-colors">
                      Désélectionner
                    </button>
                    <button onClick={bulkDeleteArticles} disabled={bulkDeleting}
                      className="text-xs text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-60">
                      {bulkDeleting ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      Supprimer la sélection
                    </button>
                  </div>
                </motion.div>
              )}

              {loadingArticles ? (
                <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="h-16 bg-charcoal-soft rounded-xl animate-pulse" />)}</div>
              ) : filteredArticles.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 mb-4">Aucun article pour le moment</p>
                  <button onClick={openCreate} className="btn-gold px-6 py-2.5 rounded-full text-sm font-semibold">
                    Créer le premier article
                  </button>
                </div>
              ) : (
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gold/10">
                          <th className="px-4 py-3 w-10">
                            <Checkbox
                              checked={selectedArticles.size === filteredArticles.length && filteredArticles.length > 0}
                              onChange={() => toggleAllArticles(filteredArticles)}
                            />
                          </th>
                          <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Article</th>
                          <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium hidden sm:table-cell">Catégorie</th>
                          <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Prix/jour</th>
                          <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium hidden md:table-cell">Stock</th>
                          <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Statut</th>
                          <th className="text-right px-4 py-3 text-xs text-gray-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredArticles.map((article) => (
                          <tr key={article.id}
                            className={`border-b border-gold/5 transition-colors ${selectedArticles.has(article.id) ? "bg-gold/10" : "hover:bg-gold/5"}`}>
                            <td className="px-4 py-3">
                              <Checkbox
                                checked={selectedArticles.has(article.id)}
                                onChange={() => toggleArticle(article.id)}
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-charcoal-soft">
                                  {article.images?.[0] ? (
                                    <Image src={article.images[0]} alt={article.name_fr} fill className="object-cover" sizes="40px" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-lg">📦</div>
                                  )}
                                </div>
                                <div>
                                  <span className="text-off-white text-xs font-medium line-clamp-1">{article.name_fr}</span>
                                  <span className="text-xs text-gray-500">{serviceLabels[article.service]}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              <span className="text-xs text-gray-400">{getCatName(article.category_id)}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-gold text-xs font-semibold">{formatPrice(article.price_per_day)}</span>
                              <span className="text-gray-500 text-xs ml-1">{article.unit_fr}</span>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <span className={`text-xs ${article.stock_available <= 2 ? "text-red-400" : "text-off-white"}`}>
                                {article.stock_available}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col gap-1">
                                <span className={`px-2 py-0.5 rounded-full text-xs border w-fit ${article.is_active ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}>
                                  {article.is_active ? "Actif" : "Inactif"}
                                </span>
                                {article.is_featured && (
                                  <span className="px-2 py-0.5 rounded-full text-xs border bg-gold/20 text-gold border-gold/30 w-fit">
                                    Mis en avant
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => openEdit(article)}
                                  className="w-8 h-8 rounded-lg border border-gold/20 hover:border-gold hover:text-gold text-gray-400 flex items-center justify-center transition-all">
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => setDeletingArticle(article)}
                                  className="w-8 h-8 rounded-lg border border-red-500/20 hover:border-red-500 hover:text-red-400 text-gray-400 flex items-center justify-center transition-all">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── Categories ── */}
          {activeTab === "categories" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="font-playfair text-2xl font-bold text-off-white">Catégories</h1>
                  <p className="text-sm text-gray-400 mt-0.5">{categories.length} catégorie{categories.length > 1 ? "s" : ""}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={fetchCatalogue} className="text-gray-400 hover:text-gold transition-colors p-2">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button onClick={openCreateCat} className="btn-gold flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold">
                    <Plus className="w-4 h-4" /> Nouvelle catégorie
                  </button>
                </div>
              </div>

              {/* Service filter */}
              <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
                {(["all", "logistique", "traiteur", "decoration"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setCatServiceFilter(s)}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                      catServiceFilter === s
                        ? "bg-gold text-charcoal-deep"
                        : "border border-gold/20 text-gray-400 hover:text-gold"
                    }`}
                  >
                    {s === "all" ? "Toutes" : serviceLabels[s]}
                  </button>
                ))}
              </div>

              {loadingArticles ? (
                <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 bg-charcoal-soft rounded-xl animate-pulse" />)}</div>
              ) : (() => {
                const filtered = catServiceFilter === "all"
                  ? categories
                  : categories.filter((c) => c.service === catServiceFilter);
                return filtered.length === 0 ? (
                  <div className="glass-card rounded-2xl p-12 text-center">
                    <Tag className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 mb-4">Aucune catégorie pour le moment</p>
                    <button onClick={openCreateCat} className="btn-gold px-6 py-2.5 rounded-full text-sm font-semibold">
                      Créer la première catégorie
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Barre sélection catégories */}
                    {selectedCats.size > 0 && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5 mb-3">
                        <span className="text-sm font-medium text-red-400">
                          <CheckSquare className="w-4 h-4 inline mr-1.5" />
                          {selectedCats.size} catégorie{selectedCats.size > 1 ? "s" : ""} sélectionnée{selectedCats.size > 1 ? "s" : ""}
                        </span>
                        <div className="flex gap-2">
                          <button onClick={() => setSelectedCats(new Set())}
                            className="text-xs text-gray-400 hover:text-off-white px-3 py-1.5 rounded-lg border border-gold/20 transition-colors">
                            Désélectionner
                          </button>
                          <button onClick={bulkDeleteCats} disabled={bulkDeleting}
                            className="text-xs text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-60">
                            {bulkDeleting ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            Supprimer la sélection
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Tout sélectionner */}
                    <div className="flex items-center gap-2 mb-3">
                      <Checkbox
                        checked={selectedCats.size === filtered.length && filtered.length > 0}
                        onChange={() => toggleAllCats(filtered)}
                      />
                      <span className="text-sm text-gray-500 font-medium">Tout sélectionner</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filtered.map((cat) => {
                        const articleCount = articles.filter((a) => a.category_id === cat.id).length;
                        const isSelected = selectedCats.has(cat.id);
                        return (
                          <motion.div key={cat.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className={`glass-card rounded-2xl p-4 hover-gold-border group transition-all ${isSelected ? "ring-2 ring-red-400/60" : ""}`}>
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={isSelected}
                                  onChange={() => toggleCat(cat.id)}
                                />
                                <span className="text-2xl">{cat.icon}</span>
                                <div>
                                  <p className="text-off-white text-sm font-semibold">{cat.name_fr}</p>
                                  <p className="text-xs text-gray-500">{serviceLabels[cat.service]}</p>
                                </div>
                              </div>
                              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEditCat(cat)}
                                  className="w-7 h-7 rounded-lg border border-gold/20 hover:border-gold hover:text-gold text-gray-400 flex items-center justify-center transition-all">
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button onClick={() => setDeletingCat(cat)}
                                  className="w-7 h-7 rounded-lg border border-red-500/20 hover:border-red-500 hover:text-red-400 text-gray-400 flex items-center justify-center transition-all">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gold/10">
                              <span className="text-xs text-gray-500">{articleCount} article{articleCount > 1 ? "s" : ""}</span>
                              <span className="text-xs text-gray-600">ordre : {cat.sort_order}</span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}

          {/* ── Orders ── */}
          {activeTab === "orders" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-playfair text-2xl font-bold text-off-white">Commandes</h1>
                <button onClick={fetchOrders} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gold transition-colors">
                  <RefreshCw className="w-4 h-4" /> Actualiser
                </button>
              </div>
              {loadingOrders ? (
                <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 bg-charcoal-soft rounded-2xl animate-pulse" />)}</div>
              ) : orders.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Aucune commande reçue pour le moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, i) => (
                    <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card rounded-2xl p-5 hover-gold-border">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gold text-xs font-mono">{order.id.slice(0,8).toUpperCase()}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs border ${statusConfig[order.status]?.color ?? statusConfig.pending.color}`}>
                              {statusConfig[order.status]?.label ?? "En attente"}
                            </span>
                          </div>
                          <p className="font-semibold text-off-white">{order.customer_name}</p>
                          <p className="text-xs text-gray-400">{order.customer_phone} • {new Date(order.event_date).toLocaleDateString("fr-FR")}</p>
                          {order.notes && <p className="text-xs text-gray-500 mt-1 italic">{order.notes}</p>}
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-gold font-bold">{formatPrice(order.total_amount)}</span>
                          <a
                            href={`https://wa.me/${order.customer_phone.replace(/[\s+]/g,"")}?text=Bonjour%20${encodeURIComponent(order.customer_name)}%20!%20Concernant%20votre%20demande...`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 btn-whatsapp px-3 py-1.5 rounded-full text-xs font-semibold"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> Répondre
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

          {/* ── Stats ── */}
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
                        <div className="flex-1 h-1.5 bg-charcoal-soft rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7 }} className="h-full bg-gradient-to-r from-gold-dark to-gold-light rounded-full" />
                        </div>
                        <span className="text-xs text-gray-400 w-16 text-right">{count} ({pct}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Settings ── */}
          {activeTab === "settings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-playfair text-2xl font-bold text-off-white mb-6">Paramètres</h1>
              <div className="space-y-6">
                <div className="glass-card rounded-2xl p-5">
                  <h2 className="font-semibold text-off-white mb-4">Informations de l&apos;entreprise</h2>
                  <div className="space-y-3">
                    {[
                      { label: "Nom de l'entreprise", value: "La Désirade Événements" },
                      { label: "Numéro WhatsApp",      value: "+242 064 000 000" },
                      { label: "Email de contact",     value: "contact@ladesirade.com" },
                      { label: "Adresse",              value: "Brazzaville, République du Congo" },
                    ].map((f) => (
                      <div key={f.label}>
                        <label className="text-xs text-gray-400 mb-1 block">{f.label}</label>
                        <input defaultValue={f.value} className="w-full bg-charcoal-soft border border-gold/20 focus:border-gold rounded-xl py-2.5 px-3.5 text-sm text-off-white outline-none transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => { setSavedBanner(true); setTimeout(() => setSavedBanner(false), 2000); }}
                  className="btn-gold px-6 py-3 rounded-full font-semibold flex items-center gap-2"
                >
                  {savedBanner ? <><Check className="w-4 h-4" /> Sauvegardé !</> : "Sauvegarder"}
                </button>
              </div>
            </motion.div>
          )}

        </main>
      </div>
    </div>
  );
}

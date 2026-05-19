import { createClient } from "./client";
import type { ServiceType, OrderStatus } from "./types";

// ─── Articles ────────────────────────────────────────────────

export async function fetchArticlesByService(service: ServiceType) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*, categories(name_fr, name_en, icon)")
    .eq("service", service)
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function fetchFeaturedByService(service: ServiceType, limit = 4) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("service", service)
    .eq("is_featured", true)
    .eq("is_active", true)
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function fetchArticleBySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*, categories(name_fr, name_en, slug, service)")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchAllFeatured(limit = 6) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("is_featured", true)
    .eq("is_active", true)
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

// ─── Categories ──────────────────────────────────────────────

export async function fetchCategoriesByService(service: ServiceType) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("service", service)
    .order("sort_order");

  if (error) throw error;
  return data ?? [];
}

// ─── Orders ──────────────────────────────────────────────────

export async function createOrder(order: {
  customer_name: string;
  customer_phone: string;
  event_date: string;
  delivery_address?: string;
  notes?: string;
  total_amount: number;
  items: { article_id: string; quantity: number; unit_price: number }[];
}) {
  const supabase = createClient();

  const { data: newOrder, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      event_date: order.event_date,
      delivery_address: order.delivery_address,
      notes: order.notes,
      total_amount: order.total_amount,
      status: "pending",
      whatsapp_sent_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (orderError) throw orderError;

  const orderItems = order.items.map((item) => ({
    order_id: newOrder.id,
    article_id: item.article_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    subtotal: item.unit_price * item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return newOrder;
}

export async function fetchAllOrders() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*, articles(name_fr))")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function updateOrderStatus(id: string, status: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status: status as OrderStatus })
    .eq("id", id);

  if (error) throw error;
}

// ─── Settings ────────────────────────────────────────────────

export async function fetchSettings() {
  const supabase = createClient();
  const { data, error } = await supabase.from("settings").select("*");
  if (error) return {};
  return Object.fromEntries((data ?? []).map((s) => [s.key, s.value]));
}

export async function updateSetting(key: string, value: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("settings")
    .upsert({ key, value });
  if (error) throw error;
}

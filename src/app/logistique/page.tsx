import { ServiceCatalogue } from "@/components/catalogue/ServiceCatalogue";
import { services } from "@/data/mock";
import { fetchArticlesByService, fetchCategoriesByService } from "@/lib/supabase/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logistique — La Désirade Événements | Chapiteaux, Tables, Sono Brazzaville",
  description: "Location de matériel logistique événementiel à Brazzaville : chapiteaux, tables, chaises, sono, scène, générateurs. Devis gratuit via WhatsApp.",
};

export default async function LogistiquePage() {
  const serviceInfo = services.find((s) => s.key === "logistique")!;
  const [articles, categories] = await Promise.all([
    fetchArticlesByService("logistique"),
    fetchCategoriesByService("logistique"),
  ]);

  return (
    <ServiceCatalogue
      service={serviceInfo}
      articles={articles}
      categories={categories}
      accentColor="text-blue-400"
      accentBg="bg-gradient-to-br from-blue-900/30 to-transparent"
    />
  );
}

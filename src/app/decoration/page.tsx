import { ServiceCatalogue } from "@/components/catalogue/ServiceCatalogue";
import { services, getArticlesByService, getCategoriesByService } from "@/data/mock";
import { fetchArticlesByService, fetchCategoriesByService } from "@/lib/supabase/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Décoration — La Désirade Événements | Arches, Nappes, Lumières Brazzaville",
  description: "Location de décoration événementielle haut de gamme à Brazzaville : arches florales, nappes, housses de chaises, lumières, ballons. Devis gratuit via WhatsApp.",
};

export default async function DecorationPage() {
  const serviceInfo = services.find((s) => s.key === "decoration")!;

  let articles, categories;
  try {
    [articles, categories] = await Promise.all([
      fetchArticlesByService("decoration"),
      fetchCategoriesByService("decoration"),
    ]);
    if (!articles.length) throw new Error("empty");
  } catch {
    articles = getArticlesByService("decoration") as never[];
    categories = getCategoriesByService("decoration") as never[];
  }

  return (
    <ServiceCatalogue
      service={serviceInfo}
      articles={articles as never}
      categories={categories as never}
      accentColor="text-gold"
      accentBg="bg-gradient-to-br from-gold-dark/20 to-transparent"
    />
  );
}

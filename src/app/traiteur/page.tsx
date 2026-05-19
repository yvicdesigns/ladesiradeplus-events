import { ServiceCatalogue } from "@/components/catalogue/ServiceCatalogue";
import { services, getArticlesByService, getCategoriesByService } from "@/data/mock";
import { fetchArticlesByService, fetchCategoriesByService } from "@/lib/supabase/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Traiteur — La Désirade Événements | Buffets, Cocktails, Pâtisseries Brazzaville",
  description: "Service traiteur événementiel à Brazzaville : buffets galas, cocktails dînatoires, pièces montées, vaisselle et personnel. Devis gratuit via WhatsApp.",
};

export default async function TraiteurPage() {
  const serviceInfo = services.find((s) => s.key === "traiteur")!;

  let articles, categories;
  try {
    [articles, categories] = await Promise.all([
      fetchArticlesByService("traiteur"),
      fetchCategoriesByService("traiteur"),
    ]);
    if (!articles.length) throw new Error("empty");
  } catch {
    articles = getArticlesByService("traiteur") as never[];
    categories = getCategoriesByService("traiteur") as never[];
  }

  return (
    <ServiceCatalogue
      service={serviceInfo}
      articles={articles as never}
      categories={categories as never}
      accentColor="text-amber-400"
      accentBg="bg-gradient-to-br from-amber-900/30 to-transparent"
    />
  );
}

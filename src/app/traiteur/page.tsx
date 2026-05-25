import { ServiceCatalogue } from "@/components/catalogue/ServiceCatalogue";
import { services } from "@/data/mock";
import { fetchArticlesByService, fetchCategoriesByService } from "@/lib/supabase/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Traiteur — La Désirade Événements | Buffets, Cocktails, Pâtisseries Brazzaville",
  description: "Service traiteur événementiel à Brazzaville : buffets galas, cocktails dînatoires, pièces montées, vaisselle et personnel. Devis gratuit via WhatsApp.",
};

export default async function TraiteurPage() {
  const serviceInfo = services.find((s) => s.key === "traiteur")!;
  const [articles, categories] = await Promise.all([
    fetchArticlesByService("traiteur"),
    fetchCategoriesByService("traiteur"),
  ]);

  return (
    <ServiceCatalogue
      service={serviceInfo}
      articles={articles}
      categories={categories}
      accentColor="text-amber-400"
      accentBg="bg-gradient-to-br from-amber-900/30 to-transparent"
    />
  );
}

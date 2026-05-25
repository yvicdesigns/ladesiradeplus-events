import type { Metadata } from "next";
import { CatalogueHub } from "@/components/catalogue/CatalogueHub";
import { fetchFeaturedByService, fetchAllByService } from "@/lib/supabase/queries";
import { services } from "@/data/mock";

export const metadata: Metadata = {
  title: "Catalogue — La Désirade Événements | Logistique, Traiteur, Décoration",
  description: "Découvrez tout notre catalogue de location de matériel événementiel à Brazzaville.",
};

export default async function CataloguePage() {
  const [
    logistiqueFeatured, traiteurFeatured, decorFeatured,
    logistiqueAll, traiteurAll, decorAll,
  ] = await Promise.all([
    fetchFeaturedByService("logistique", 4),
    fetchFeaturedByService("traiteur", 4),
    fetchFeaturedByService("decoration", 4),
    fetchAllByService("logistique"),
    fetchAllByService("traiteur"),
    fetchAllByService("decoration"),
  ]);

  const serviceData = {
    logistique: { featured: logistiqueFeatured, count: logistiqueAll.length },
    traiteur: { featured: traiteurFeatured, count: traiteurAll.length },
    decoration: { featured: decorFeatured, count: decorAll.length },
  };

  return <CatalogueHub services={services} serviceData={serviceData} />;
}

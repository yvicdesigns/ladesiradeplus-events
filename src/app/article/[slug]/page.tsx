import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleDetail } from "@/components/article/ArticleDetail";
import { fetchArticleBySlug, fetchRelatedArticles } from "@/lib/supabase/queries";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await fetchArticleBySlug(params.slug);
  if (!article) return { title: "Article introuvable" };
  return {
    title: `${article.name_fr} — La Désirade Événements`,
    description: article.description_fr || `Location de ${article.name_fr} à Brazzaville.`,
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = await fetchArticleBySlug(params.slug);
  if (!article) notFound();

  const relatedArticles = article.category_id
    ? await fetchRelatedArticles(article.category_id, article.id)
    : [];

  return <ArticleDetail article={article} relatedArticles={relatedArticles} />;
}

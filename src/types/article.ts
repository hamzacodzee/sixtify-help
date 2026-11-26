import { DEFAULT_CATEGORIES } from "@/types/category";
import { getFaqsForSubCategory } from "@/data/faqs";

export type ArticleBlockType =
  | "paragraph"
  | "step"
  | "image"
  | "callout"
  | "checklist"
  | "table"
  | "code"
  | "faq";

export type ArticleBlock = {
  id: string;
  type: ArticleBlockType;
  title?: string;
  content?: string;
  variant?: "info" | "warning" | "success";
  items?: string[];
  imageUrl?: string;
  caption?: string;
  headers?: string[];
  rows?: string[][];
  question?: string;
  answer?: string;
}

export type ArticleFeature = {
  tag: string;
  title: string;
  description: string;
}

export type Article = {
  id: string;
  categoryId: string;
  subCategoryId: string;
  title: string;
  summary: string;
  blocks?: ArticleBlock[];
  prerequisites: string[];
  features: ArticleFeature[];
  steps: string[];
  notes: string[];
  whatNext: string;
  viewCount: number;
  helpfulCount: number;
  updatedAt: string;
}

export const ARTICLE_STORAGE_KEY = "sixtify_help_articles_v1";

export function buildDefaultArticles(): Article[] {
  const articles: Article[] = [];

  for (const cat of DEFAULT_CATEGORIES) {
    for (const sub of cat.subCategories) {
      const faqs = getFaqsForSubCategory(sub.title);

      faqs.forEach((faq, idx) => {
        articles.push({
          id: `art-${cat.id}-${sub.id}-${idx + 1}`,
          categoryId: cat.id,
          subCategoryId: sub.id,
          title: faq.question,
          summary: faq.answer,
          prerequisites: [
            "Ensure you are logged into your Sixtifi web application.",
            `Verify that you have access to ${cat.title} > ${sub.title}.`,
          ],
          features: [
            {
              tag: "REAL-TIME",
              title: "Instant Updates",
              description: "Changes are reflected immediately across employee records and dashboards.",
            },
            {
              tag: "COMPLIANCE",
              title: "Audit & Validation",
              description: "Built-in checks ensure policy compliance and accurate audit trails.",
            },
            {
              tag: "FLEXIBLE",
              title: "Configurable Rules",
              description: "Tailor workflows and approvals to match your organization structure.",
            },
          ],
          steps: [
            `Navigate to ${cat.title} from the left navigation menu and open ${sub.title}.`,
            "Locate the action button or record you want to configure or update.",
            "Review all required fields and verify the details against your company policy.",
            "Click Save or Confirm to apply the changes and update the system.",
          ],
          notes: [
            "Changes made after the payroll cut-off date will be reflected in the next cycle.",
            "Only authorized managers or admins can approve or override locked records.",
          ],
          whatNext:
            "Your updates are saved immediately, and relevant notifications or audit logs are generated automatically for your team.",
          viewCount: 0,
          helpfulCount: 0,
          updatedAt: new Date().toISOString(),
        });
      });
    }
  }

  return articles;
}

export function getStoredArticles(): Article[] {
  if (typeof window === "undefined") {return buildDefaultArticles();}
  try {
    const saved = localStorage.getItem(ARTICLE_STORAGE_KEY);

    if (saved) {
      return JSON.parse(saved);
    }

    const defaults = buildDefaultArticles();

    localStorage.setItem(ARTICLE_STORAGE_KEY, JSON.stringify(defaults));

    return defaults;
  } catch {
    return buildDefaultArticles();
  }
}

export function saveStoredArticles(articles: Article[]): void {
  if (typeof window === "undefined") {return;}
  try {
    localStorage.setItem(ARTICLE_STORAGE_KEY, JSON.stringify(articles));
  } catch {
    // Ignore storage errors
  }
}

export function incrementArticleView(articleId: string): void {
  if (typeof window === "undefined" || !articleId) {return;}

  const articles = getStoredArticles();

  const updated = articles.map((a) =>
    a.id === articleId ? { ...a, viewCount: (a.viewCount ?? 0) + 1 } : a
  );

  saveStoredArticles(updated);
}

export function incrementArticleHelpful(articleId: string): void {
  if (typeof window === "undefined" || !articleId) {return;}

  const articles = getStoredArticles();

  const updated = articles.map((a) =>
    a.id === articleId ? { ...a, helpfulCount: (a.helpfulCount ?? 0) + 1 } : a
  );

  saveStoredArticles(updated);
}


import { DEFAULT_CATEGORIES } from "@/types/category";
import { getFaqsForSubCategory } from "@/data/faqs";

export type ArticleBlockType =
  | "paragraph"
  | "step"
  | "image"
  | "callout"
  | "faq"
  | "cards";

export type ArticleCardItem = {
  icon?: string;
  iconColor?: string;
  tag: string;
  title: string;
  description: string;
};

export type ArticleBlock = {
  id: string;
  type: ArticleBlockType;
  title?: string;
  subtitle?: string;
  content?: string;
  variant?: "info" | "warning" | "success";
  items?: string[];
  cards?: ArticleCardItem[];
  imageUrl?: string;
  caption?: string;
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
          blocks: [
            {
              id: `blk-summary-${cat.id}-${sub.id}-${idx + 1}`,
              type: "callout",
              variant: "info",
              content: faq.answer,
            },
            {
              id: `blk-prereq-${cat.id}-${sub.id}-${idx + 1}`,
              type: "paragraph",
              content: `<h3>Before You Begin</h3><ul><li>Ensure you are logged into your Sixtifi web application.</li><li>Verify that you have access to <strong>${cat.title} &gt; ${sub.title}</strong>.</li></ul>`,
            },
            {
              id: `blk-features-${cat.id}-${sub.id}-${idx + 1}`,
              type: "cards",
              cards: [
                {
                  icon: "RocketLaunch",
                  iconColor: "#2196f3",
                  tag: "REAL-TIME",
                  title: "Instant Updates",
                  description:
                    "Changes are reflected immediately across employee records and dashboards.",
                },
                {
                  icon: "VerifiedUser",
                  iconColor: "#2196f3",
                  tag: "COMPLIANCE",
                  title: "Audit & Validation",
                  description:
                    "Built-in checks ensure policy compliance and accurate audit trails.",
                },
                {
                  icon: "Tune",
                  iconColor: "#2196f3",
                  tag: "FLEXIBLE",
                  title: "Configurable Rules",
                  description:
                    "Tailor workflows and approvals to match your organization structure.",
                },
              ],
            },
            {
              id: `blk-steps-${cat.id}-${sub.id}-${idx + 1}`,
              type: "step",
              title: "Step-by-Step Instructions",
              items: [
                `Navigate to ${cat.title} from the left navigation menu and open ${sub.title}.`,
                "Locate the action button or record you want to configure or update.",
                "Review all required fields and verify the details against your company policy.",
                "Click Save or Confirm to apply the changes and update the system.",
              ],
            },
            {
              id: `blk-notes-${cat.id}-${sub.id}-${idx + 1}`,
              type: "callout",
              variant: "warning",
              title: "Important Notes",
              content:
                "Changes made after the payroll cut-off date will be reflected in the next cycle.\nOnly authorized managers or admins can approve or override locked records.",
            },
            {
              id: `blk-what-next-${cat.id}-${sub.id}-${idx + 1}`,
              type: "paragraph",
              content:
                "<h3>What Happens Next?</h3><p>Your updates are saved immediately, and relevant notifications or audit logs are generated automatically for your team.</p>",
            },
          ],
          prerequisites: [],
          features: [],
          steps: [],
          notes: [],
          whatNext: "",
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


"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import ArticleEditor from "@/components/article/ArticleEditor";
import type {
  Article} from "@/types/article";
import {
  getStoredArticles,
  saveStoredArticles,
} from "@/types/article";
import type {
  Category} from "@/types/category";
import {
  CATEGORY_STORAGE_KEY,
  DEFAULT_CATEGORIES,
} from "@/types/category";

function ArticleEditorContent() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const articleId = searchParams.get("id");

  const readOnly = searchParams.get("mode") === "view";

  const [categories, setCategories] = useState<Category[]>([]);

  const [articles, setArticles] = useState<Article[]>([]);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CATEGORY_STORAGE_KEY);

      setCategories(saved ? JSON.parse(saved) : DEFAULT_CATEGORIES);
    } catch {
      setCategories(DEFAULT_CATEGORIES);
    }
    setArticles(getStoredArticles());
    setLoaded(true);
  }, [articleId, readOnly]);

  if (!loaded) {return null;}

  const initialData = articleId
    ? articles.find((a) => a.id === articleId) ?? null
    : null;

  const handleSave = (
    data: Omit<Article, "id" | "viewCount" | "helpfulCount" | "updatedAt">,
    existingId?: string
  ) => {
    const updated = existingId
      ? articles.map((a) =>
          a.id === existingId
            ? { ...a, ...data, updatedAt: new Date().toISOString() }
            : a
        )
      : [
          {
            id: `art-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            ...data,
            viewCount: 0,
            helpfulCount: 0,
            updatedAt: new Date().toISOString(),
          },
          ...articles,
        ];

    saveStoredArticles(updated);
    router.push("/articles");
  };

  return (
    <ArticleEditor
      key={`${articleId ?? "new"}-${readOnly}`}
      categories={categories}
      initialData={initialData}
      readOnly={readOnly}
      onClose={() => router.push("/articles")}
      onSave={handleSave}
    />
  );
}

export default function ArticleEditorPage() {
  return (
    <AppShell>
      <Suspense fallback={null}>
        <ArticleEditorContent />
      </Suspense>
    </AppShell>
  );
}

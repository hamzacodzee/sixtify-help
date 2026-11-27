"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Autocomplete, Button, TextField } from "@codezee/sixtify-brahma";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { Article, ArticleBlock, ArticleBlockType } from "@/types/article";
import type { Category } from "@/types/category";
import { ArticlePreviewPane } from "./editor/ArticlePreviewPane";
import { BlockCard } from "./editor/BlockCard";
import { BlockToolbar } from "./editor/BlockToolbar";
import {
  type ArticleEditorFormValues,
  generateBlockId,
  getInitialBlocks,
} from "./editor/blockConstants";

type ArticleEditorProps = {
  categories: Category[];
  initialData?: Article | null;
  readOnly?: boolean;
  onClose: () => void;
  onSave: (
    data: Omit<Article, "id" | "viewCount" | "helpfulCount" | "updatedAt">,
    existingId?: string
  ) => void;
};

export default function ArticleEditor({
  categories,
  initialData,
  readOnly = false,
  onClose,
  onSave,
}: ArticleEditorProps) {
  const defaultCatId = initialData?.categoryId || categories[0]?.id || "";

  const defaultCat = categories.find((c) => c.id === defaultCatId);

  const defaultSubId =
    initialData?.subCategoryId || defaultCat?.subCategories[0]?.id || "";

  const { control, setValue, getValues } = useForm<ArticleEditorFormValues>({
    defaultValues: {
      categoryId: defaultCatId,
      subCategoryId: defaultSubId,
      title: initialData?.title || "",
      blocks: getInitialBlocks(initialData),
    },
  });

  const categoryId = useWatch({ control, name: "categoryId" });

  const subCategoryId = useWatch({ control, name: "subCategoryId" });

  const title = useWatch({ control, name: "title" }) ?? "";

  const blocks = useWatch({ control, name: "blocks" }) ?? [];

  const [submitted, setSubmitted] = useState(false);

  const [viewMode, setViewMode] = useState<"edit" | "split" | "preview">(
    "split"
  );

  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === categoryId) ?? categories[0] ?? null,
    [categories, categoryId]
  );

  const subCategories = useMemo(
    () => selectedCategory?.subCategories ?? [],
    [selectedCategory]
  );

  useEffect(() => {
    if (
      subCategories.length > 0 &&
      !subCategories.some((s) => s.id === subCategoryId)
    ) {
      setValue("subCategoryId", subCategories[0]?.id || "");
    }
  }, [subCategories, subCategoryId, setValue]);

  useEffect(() => {
    setValue("categoryId", defaultCatId);
    setValue("subCategoryId", defaultSubId);
  }, [defaultCatId, defaultSubId, setValue]);

  const isValid =
    categoryId.length > 0 &&
    subCategoryId.length > 0 &&
    title.trim().length > 0;

  const setBlocks = (
    updater: ArticleBlock[] | ((prev: ArticleBlock[]) => ArticleBlock[])
  ) => {
    const next = typeof updater === "function" ? updater(blocks) : updater;

    setValue("blocks", next);
  };

  const addBlock = (type: ArticleBlockType) => {
    const newBlock: ArticleBlock = {
      id: generateBlockId(),
      type,
      title: "",
      content: "",
      variant: type === "callout" ? "info" : undefined,
      items: type === "step" ? [""] : undefined,
      cards:
        type === "cards"
          ? [
              {
                icon: "Analytics",
                iconColor: "#2196f3",
                tag: "",
                title: "",
                description: "",
              },
            ]
          : undefined,
      imageUrl: type === "image" ? "" : undefined,
      caption: type === "image" ? "" : undefined,
      question: type === "faq" ? "" : undefined,
      answer: type === "faq" ? "" : undefined,
    };

    setBlocks((prev) => [...prev, newBlock]);
  };

  const updateBlock = (id: string, patch: Partial<ArticleBlock>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...patch } : b))
    );
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction;

    if (target < 0 || target >= blocks.length) {
      return;
    }
    setBlocks((prev) => {
      const next = [...prev];

      [next[index], next[target]] = [next[target], next[index]];

      return next;
    });
  };

  const handleSave = () => {
    setSubmitted(true);

    if (!isValid) {
      return;
    }

    const currentValues = getValues();

    const currentBlocks = currentValues.blocks ?? blocks;

    const rawFirstText =
      currentBlocks.find((b) => b.content?.trim())?.content?.trim() || "";

    const firstText =
      rawFirstText
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim() ||
      initialData?.summary ||
      "";

    onSave(
      {
        categoryId: currentValues.categoryId || categoryId,
        subCategoryId: currentValues.subCategoryId || subCategoryId,
        title: (currentValues.title ?? title).trim(),
        summary: firstText,
        blocks: currentBlocks,
        prerequisites: [],
        features: initialData?.features ?? [],
        steps: [],
        notes: [],
        whatNext: "",
      },
      initialData?.id
    );
  };

  const pageTitle = readOnly
    ? "View Article"
    : initialData
      ? "Edit Article"
      : "Add Article";

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2.5,
        borderColor: "divider",
        backgroundColor: "background.paper",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 104px)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 0.75,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton size="small" onClick={onClose}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {pageTitle}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Button variant="outlined" onClick={onClose} size="small">
            {readOnly ? "Back" : "Cancel"}
          </Button>
          {!readOnly && (
            <Button
              variant="contained"
              onClick={handleSave}
              size="small"
              disabled={!isValid}
            >
              Save
            </Button>
          )}
        </Box>
      </Box>

      <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            flex: 1,
          }}
        >
          {/* Top: Required Fields */}
          <Box
            sx={{
              pb: 1,
              borderBottom: "1px solid",
              borderColor: "divider",
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "200px 200px 1fr" },
              gap: 1,
              alignItems: "start",
            }}
          >
            <Autocomplete
              name="categoryId"
              control={control}
              label="Category"
              required
              disabled={readOnly}
              disableClearable
              options={categories.map((cat) => ({
                label: cat.title,
                value: cat.id,
              }))}
            />

            <Autocomplete
              name="subCategoryId"
              control={control}
              label="Sub Category"
              required
              disabled={readOnly}
              disableClearable
              options={subCategories.map((sub) => ({
                label: sub.title,
                value: sub.id,
              }))}
            />

            <Box sx={{ flex: 1 }}>
              <TextField
                name="title"
                control={control}
                label="Title (Question)"
                required
                disabled={readOnly}
                placeholder="e.g. How do I approve pending regularization requests?"
                error={submitted && title.trim().length === 0}
                helperText={
                  submitted && title.trim().length === 0
                    ? "Title is required"
                    : undefined
                }
              />
            </Box>
          </Box>

          {/* Dynamic Block Builder */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
            {!readOnly && (
              <BlockToolbar
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onAddBlock={addBlock}
              />
            )}

            <Box
              sx={{
                flex: 1,
                display: viewMode === "split" ? "grid" : "flex",
                gridTemplateColumns:
                  viewMode === "split" ? { xs: "1fr", lg: "1fr 1fr" } : undefined,
                flexDirection: viewMode === "split" ? undefined : "column",
                gap: 2,
                minHeight: 0,
              }}
            >
              {viewMode !== "preview" && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {blocks.length === 0 ? (
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 4,
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 2,
                        borderColor: "divider",
                        borderStyle: "dashed",
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        No content blocks added yet. Click any block type above
                        to start building.
                      </Typography>
                    </Paper>
                  ) : (
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                    >
                      {blocks.map((block, index) => (
                        <BlockCard
                          key={block.id}
                          block={block}
                          index={index}
                          totalBlocks={blocks.length}
                          control={control}
                          readOnly={readOnly}
                          onMoveBlock={moveBlock}
                          onRemoveBlock={removeBlock}
                          onUpdateBlock={updateBlock}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              )}

              {(viewMode === "split" || viewMode === "preview") && (
                <ArticlePreviewPane
                  categoryTitle={selectedCategory?.title ?? "Help Center"}
                  subCategoryTitle={
                    subCategories.find((s) => s.id === subCategoryId)?.title
                  }
                  title={title}
                  legacySummary={initialData?.summary}
                  blocks={blocks}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

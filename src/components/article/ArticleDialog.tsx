"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  Autocomplete,
  Button,
  Dialog,
  Stepper,
  TextField,
  Tooltip,
} from "@codezee/sixtify-brahma";
import { SmartGrid } from "@codezee-org/sixtify-smartgrid";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Chip,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import type { Article, ArticleBlock, ArticleBlockType } from "@/types/article";
import type { Category } from "@/types/category";

type ArticleDialogProps = {
  open: boolean;
  categories: Category[];
  initialData?: Article | null;
  readOnly?: boolean;
  variant?: "dialog" | "page";
  onClose: () => void;
  onSave: (
    data: Omit<Article, "id" | "viewCount" | "helpfulCount" | "updatedAt">,
    existingId?: string
  ) => void;
};

const BLOCK_TYPES: { type: ArticleBlockType; label: string }[] = [
  { type: "paragraph", label: "Paragraph" },
  { type: "step", label: "Step" },
  { type: "image", label: "Image" },
  { type: "callout", label: "Callout" },
  { type: "checklist", label: "Checklist" },
  { type: "table", label: "Table" },
  { type: "code", label: "Code" },
  { type: "faq", label: "FAQ" },
];

export default function ArticleDialog({
  open,
  categories,
  initialData,
  readOnly = false,
  variant = "dialog",
  onClose,
  onSave,
}: ArticleDialogProps) {
  const defaultCatId = initialData?.categoryId || categories[0]?.id || "";

  const defaultCat = categories.find((c) => c.id === defaultCatId);

  const defaultSubId =
    initialData?.subCategoryId || defaultCat?.subCategories[0]?.id || "";

  const getInitialBlocks = (): ArticleBlock[] => {
    if (initialData?.blocks && initialData.blocks.length > 0) {
      return initialData.blocks;
    }

    if (!initialData) {
      return [];
    }

    const migrated: ArticleBlock[] = [];

    if (initialData.summary) {
      migrated.push({
        id: "blk-summary",
        type: "callout",
        variant: "info",
        content: initialData.summary,
      });
    }

    if (initialData.prerequisites?.length) {
      migrated.push({
        id: "blk-prereq",
        type: "checklist",
        title: "Before You Begin",
        items: initialData.prerequisites,
      });
    }

    if (initialData.steps?.length) {
      migrated.push({
        id: "blk-steps",
        type: "step",
        title: "Step-by-Step Instructions",
        items: initialData.steps,
      });
    }

    if (initialData.notes?.length) {
      migrated.push({
        id: "blk-notes",
        type: "callout",
        variant: "warning",
        title: "Important Notes",
        content: initialData.notes.join("\n"),
      });
    }

    return migrated;
  };

  const { control, setValue } = useForm<{
    categoryId: string;
    subCategoryId: string;
    title: string;
    blocks: ArticleBlock[];
  }>({
    defaultValues: {
      categoryId: defaultCatId,
      subCategoryId: defaultSubId,
      title: initialData?.title || "",
      blocks: getInitialBlocks(),
    },
  });

  const categoryId = useWatch({ control, name: "categoryId" });

  const subCategoryId = useWatch({ control, name: "subCategoryId" });

  const title = useWatch({ control, name: "title" }) ?? "";

  const blocks = useWatch({ control, name: "blocks" }) ?? [];

  const [submitted, setSubmitted] = useState(false);

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
    if (open) {
      setValue("categoryId", defaultCatId);
      setValue("subCategoryId", defaultSubId);
    }
  }, [open, defaultCatId, defaultSubId, setValue]);

  const isValid =
    categoryId.length > 0 &&
    subCategoryId.length > 0 &&
    title.trim().length > 0;

  const setBlocks = (
    updater: ArticleBlock[] | ((prev: ArticleBlock[]) => ArticleBlock[]),
  ) => {
    const next = typeof updater === "function" ? updater(blocks) : updater;

    setValue("blocks", next);
  };

  const addBlock = (type: ArticleBlockType) => {
    const id = `blk-${crypto.randomUUID().slice(0, 8)}`;

    const newBlock: ArticleBlock = {
      id,
      type,
      title: "",
      content: "",
      variant: type === "callout" ? "info" : undefined,
      items: type === "step" || type === "checklist" ? [""] : undefined,
      headers: type === "table" ? ["Column 1", "Column 2"] : undefined,
      rows: type === "table" ? [["", ""]] : undefined,
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

    const firstText =
      blocks.find((b) => b.content?.trim())?.content?.trim() ||
      initialData?.summary ||
      "";

    onSave(
      {
        categoryId,
        subCategoryId,
        title: title.trim(),
        summary: firstText,
        blocks,
        prerequisites: [],
        features: initialData?.features ?? [],
        steps: [],
        notes: [],
        whatNext: "",
      },
      initialData?.id
    );
    onClose();
  };

  const dialogTitle = readOnly
    ? "View Article"
    : initialData
    ? "Edit Article"
    : "Add Article";

  const editorContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Top: Required Fields */}
      <Box
        sx={{
          pb: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 2fr" },
          gap: 1.5,
          alignItems: "start",
        }}
      >
        <Box>
          <Autocomplete
            name="categoryId"
            control={control}
            size="small"
            label="Category"
            required
            disabled={readOnly}
            disableClearable
            options={categories.map((cat) => ({
              label: cat.title,
              value: cat.id,
            }))}
          />
        </Box>

        <Box>
          <Autocomplete
            size="small"
            name="subCategoryId"
            control={control}
            label="Sub Category"
            required
            disabled={readOnly || subCategories.length === 0}
            disableClearable
            options={subCategories.map((sub) => ({
              label: sub.title,
              value: sub.id,
            }))}
          />
        </Box>

        <Box>
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

      {/* Right: Dynamic Block Builder */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {!readOnly && (
          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              borderRadius: 2,
              borderColor: "divider",
              backgroundColor: "background.default",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 700, display: "block", mb: 1 }}
            >
              ADD CONTENT BLOCK
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {BLOCK_TYPES.map((bt) => (
                <Button
                  key={bt.type}
                  size="small"
                  variant="outlined"
                  startIcon={<AddIcon fontSize="small" />}
                  onClick={() => addBlock(bt.type)}
                  sx={{ fontSize: "0.75rem", py: 0.4, px: 1.25 }}
                >
                  {bt.label}
                </Button>
              ))}
            </Box>
          </Paper>
        )}

        {blocks.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              borderRadius: 2,
              borderColor: "divider",
              borderStyle: "dashed",
              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No content blocks added yet. Click any block type above to start
              building.
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {blocks.map((block, index) => (
              <Paper
                key={block.id}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  borderColor: "divider",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,
                    py: 1,
                    bgcolor: "action.hover",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Chip
                    label={block.type.toUpperCase()}
                    size="small"
                    color="primary"
                    variant="filled"
                    sx={{ fontWeight: 700, fontSize: "0.6875rem", height: 22 }}
                  />
                  {!readOnly && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Tooltip toolTipLabel="Move Up">
                        <span>
                          <IconButton
                            size="small"
                            disabled={index === 0}
                            onClick={() => moveBlock(index, -1)}
                          >
                            <ArrowUpwardIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip toolTipLabel="Move Down">
                        <span>
                          <IconButton
                            size="small"
                            disabled={index === blocks.length - 1}
                            onClick={() => moveBlock(index, 1)}
                          >
                            <ArrowDownwardIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip toolTipLabel="Delete Block">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeBlock(block.id)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
                <Box sx={{ p: 2 }}>
                  {block.type === "paragraph" && (
                    <TextField
                      name={`blocks.${index}.content`}
                      control={control}
                      multiline
                      rows={3}
                      disabled={readOnly}
                      placeholder="Write paragraph text..."
                    />
                  )}

                  {block.type === "step" && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                      <TextField
                        name={`blocks.${index}.title`}
                        control={control}
                        disabled={readOnly}
                        placeholder="Section title (e.g. Step-by-Step)"
                      />
                      {readOnly ? (
                        <Stepper
                          orientation="vertical"
                          steps={(block.items ?? []).map(
                            (item, i) => item || `Step ${i + 1}`,
                          )}
                          activeStep={(block.items ?? []).length}
                          showStepLabels
                        />
                      ) : (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          {(block.items ?? [""]).map((_, stepIdx) => (
                            <Box
                              key={stepIdx}
                              sx={{ display: "flex", alignItems: "center", gap: 1 }}
                            >
                              <Chip
                                label={stepIdx + 1}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ minWidth: 28, fontWeight: 600 }}
                              />
                              <TextField
                                name={`blocks.${index}.items.${stepIdx}`}
                                control={control}
                                placeholder={`Step ${stepIdx + 1} description...`}
                              />
                              {(block.items ?? [""]).length > 1 && (
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => {
                                    const next = (block.items ?? [""]).filter(
                                      (_, i) => i !== stepIdx,
                                    );

                                    updateBlock(block.id, { items: next });
                                  }}
                                >
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                          ))}
                          <Box>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<AddIcon />}
                              onClick={() =>
                                updateBlock(block.id, {
                                  items: [...(block.items ?? []), ""],
                                })
                              }
                            >
                              Add Step
                            </Button>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  )}

                  {block.type === "checklist" && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                      <TextField
                        name={`blocks.${index}.title`}
                        control={control}
                        disabled={readOnly}
                        placeholder="Checklist title"
                      />
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        {(block.items ?? [""]).map((_, itemIdx) => (
                          <Box
                            key={itemIdx}
                            sx={{ display: "flex", alignItems: "center", gap: 1 }}
                          >
                            <CheckBoxOutlineBlankIcon fontSize="small" color="action" />
                            <TextField
                              name={`blocks.${index}.items.${itemIdx}`}
                              control={control}
                              disabled={readOnly}
                              placeholder={`Item ${itemIdx + 1}...`}
                            />
                            {!readOnly && (block.items ?? [""]).length > 1 && (
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                  const next = (block.items ?? [""]).filter(
                                    (_, i) => i !== itemIdx,
                                  );

                                  updateBlock(block.id, { items: next });
                                }}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        ))}
                        {!readOnly && (
                          <Box>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<AddIcon />}
                              onClick={() =>
                                updateBlock(block.id, {
                                  items: [...(block.items ?? []), ""],
                                })
                              }
                            >
                              Add Item
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  )}

                  {block.type === "callout" &&
                    (readOnly ? (
                      <Alert severity={block.variant ?? "info"} variant="outlined">
                        {block.title && (
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {block.title}
                          </Typography>
                        )}
                        <Typography variant="body2">{block.content}</Typography>
                      </Alert>
                    ) : (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Select
                            size="small"
                            value={block.variant ?? "info"}
                            onChange={(e) =>
                              updateBlock(block.id, {
                                variant: e.target.value as "info" | "warning" | "success",
                              })
                            }
                            sx={{ width: 130 }}
                          >
                            <MenuItem value="info">Info</MenuItem>
                            <MenuItem value="warning">Warning</MenuItem>
                            <MenuItem value="success">Success</MenuItem>
                          </Select>
                          <TextField
                            name={`blocks.${index}.title`}
                            control={control}
                            placeholder="Callout title (optional)"
                          />
                        </Box>
                        <TextField
                          name={`blocks.${index}.content`}
                          control={control}
                          multiline
                          rows={2}
                          placeholder="Callout message..."
                        />
                      </Box>
                    ))}

                  {block.type === "image" && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                      {!readOnly && (
                        <TextField
                          name={`blocks.${index}.imageUrl`}
                          control={control}
                          placeholder="Image URL (https://...)"
                        />
                      )}
                      {block.imageUrl && (
                        <Box
                          component="img"
                          src={block.imageUrl}
                          alt={block.caption || "Article image"}
                          sx={{
                            maxHeight: 200,
                            maxWidth: "100%",
                            objectFit: "contain",
                            borderRadius: 1.5,
                            border: "1px solid",
                            borderColor: "divider",
                            alignSelf: "flex-start",
                          }}
                        />
                      )}
                      <TextField
                        name={`blocks.${index}.caption`}
                        control={control}
                        disabled={readOnly}
                        placeholder="Image caption"
                      />
                    </Box>
                  )}

                  {block.type === "code" && (
                    <TextField
                      name={`blocks.${index}.content`}
                      control={control}
                      multiline
                      rows={3}
                      disabled={readOnly}
                      placeholder="Paste code snippet..."
                    />
                  )}

                  {block.type === "faq" &&
                    (readOnly ? (
                      <Accordion variant="outlined" disableGutters>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {block.question || "Untitled Question"}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="body2" color="text.secondary">
                            {block.answer}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    ) : (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <TextField
                          name={`blocks.${index}.question`}
                          control={control}
                          placeholder="Question"
                        />
                        <TextField
                          name={`blocks.${index}.answer`}
                          control={control}
                          multiline
                          rows={2}
                          placeholder="Answer"
                        />
                      </Box>
                    ))}

                  {block.type === "table" && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                      <SmartGrid<string[]>
                        data={block.rows ?? [["", ""]]}
                        loading={false}
                        totalCount={(block.rows ?? [["", ""]]).length}
                        columns={[
                          ...(block.headers ?? ["Column 1", "Column 2"]).map(
                            (header, colIdx) => ({
                              header: () =>
                                readOnly ? (
                                  header
                                ) : (
                                  <TextField
                                    name={`blocks.${index}.headers.${colIdx}`}
                                    control={control}
                                    placeholder={`Column ${colIdx + 1}`}
                                  />
                                ),
                              accessorKey: `${colIdx}` as const,
                              cell: ({
                                row,
                              }: {
                                row: { index: number; original: string[] };
                              }) =>
                                readOnly ? (
                                  row.original[colIdx] ?? ""
                                ) : (
                                  <TextField
                                    name={`blocks.${index}.rows.${row.index}.${colIdx}`}
                                    control={control}
                                    placeholder="Cell value..."
                                  />
                                ),
                            }),
                          ),
                          ...(!readOnly
                            ? [
                                {
                                  header: "",
                                  accessorKey: "action" as const,
                                  size: 56,
                                  cell: ({ row }: { row: { index: number } }) =>
                                    (block.rows ?? []).length > 1 ? (
                                      <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => {
                                          const nextRows = (
                                            block.rows ?? []
                                          ).filter((_, i) => i !== row.index);

                                          updateBlock(block.id, {
                                            rows: nextRows,
                                          });
                                        }}
                                      >
                                        <DeleteOutlineIcon fontSize="small" />
                                      </IconButton>
                                    ) : null,
                                },
                              ]
                            : []),
                        ]}
                      />
                      {!readOnly && (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => {
                              const colCount = (
                                block.headers ?? ["Column 1", "Column 2"]
                              ).length;

                              updateBlock(block.id, {
                                rows: [
                                  ...(block.rows ?? []),
                                  Array.from({ length: colCount }, () => ""),
                                ],
                              });
                            }}
                          >
                            Add Row
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => {
                              const nextHeaders = [
                                ...(block.headers ?? ["Column 1", "Column 2"]),
                                `Column ${
                                  (block.headers ?? ["Column 1", "Column 2"])
                                    .length + 1
                                }`,
                              ];

                              const nextRows = (block.rows ?? [["", ""]]).map(
                                (r) => [...r, ""]
                              );

                              updateBlock(block.id, {
                                headers: nextHeaders,
                                rows: nextRows,
                              });
                            }}
                          >
                            Add Column
                          </Button>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );

  if (variant === "page") {
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
            px: 3,
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton size="small" onClick={onClose}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {dialogTitle}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
        <Box sx={{ p: 3, flex: 1 }}>{editorContent}</Box>
      </Paper>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      title={dialogTitle}
      actions={
        <>
          <Button variant="outlined" onClick={onClose} size="small">
            {readOnly ? "Close" : "Cancel"}
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
        </>
      }
    >
      {editorContent}
    </Dialog>
  );
}

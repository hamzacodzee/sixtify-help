import type React from "react";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import NotesIcon from "@mui/icons-material/Notes";
import type { Article, ArticleBlock, ArticleBlockType } from "@/types/article";

export type ArticleEditorFormValues = {
  categoryId: string;
  subCategoryId: string;
  title: string;
  blocks: ArticleBlock[];
};

export const BLOCK_TYPES: {
  type: ArticleBlockType;
  label: string;
  icon: React.ElementType;
}[] = [
  { type: "paragraph", label: "Paragraph", icon: NotesIcon },
  { type: "step", label: "Step", icon: FormatListNumberedIcon },
  { type: "image", label: "Image", icon: ImageOutlinedIcon },
  { type: "callout", label: "Callout", icon: InfoOutlinedIcon },
  { type: "faq", label: "FAQ", icon: HelpOutlineIcon },
  { type: "cards", label: "KPI Cards", icon: DashboardOutlinedIcon },
];

export function generateBlockId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `blk-${crypto.randomUUID().slice(0, 8)}`;
  }

  return `blk-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

const ALLOWED_BLOCK_TYPES = new Set<string>(
  BLOCK_TYPES.map((b) => b.type)
);

export function getInitialBlocks(initialData?: Article | null): ArticleBlock[] {
  if (initialData?.blocks && initialData.blocks.length > 0) {
    return initialData.blocks.filter((b) => ALLOWED_BLOCK_TYPES.has(b.type));
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
    const listItems = initialData.prerequisites
      .map((item) => `<li>${item}</li>`)
      .join("");

    migrated.push({
      id: "blk-prereq",
      type: "paragraph",
      content: `<h3>Before You Begin</h3><ul>${listItems}</ul>`,
    });
  }

  if (initialData.features?.length) {
    const featureIcons = ["RocketLaunch", "VerifiedUser", "Tune"];

    migrated.push({
      id: "blk-features",
      type: "cards",
      cards: initialData.features.map((feat, idx) => ({
        icon: featureIcons[idx] ?? "Analytics",
        iconColor: "#2196f3",
        tag: feat.tag,
        title: feat.title,
        description: feat.description,
      })),
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

  if (initialData.whatNext) {
    migrated.push({
      id: "blk-what-next",
      type: "paragraph",
      content: `<h3>What Happens Next?</h3><p>${initialData.whatNext}</p>`,
    });
  }

  return migrated;
}


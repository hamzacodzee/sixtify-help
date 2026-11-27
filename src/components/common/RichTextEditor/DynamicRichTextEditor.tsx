"use client";

import { Skeleton } from "@mui/material";
import dynamic from "next/dynamic";
import type { FieldValues } from "react-hook-form";
import type { RichTextEditorProps } from "./RichTextEditor";

const LazyRichTextEditor = dynamic(
  () => import("./RichTextEditor").then((mod) => mod.RichTextEditor),
  {
    ssr: false,
    loading: () => (
      <Skeleton
        variant="rounded"
        width="100%"
        height={180}
        sx={{ borderRadius: "8px" }}
      />
    ),
  }
);

export function DynamicRichTextEditor<
  TFieldValues extends FieldValues = FieldValues,
>(props: RichTextEditorProps<TFieldValues>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <LazyRichTextEditor {...(props as RichTextEditorProps<any>)} />;
}

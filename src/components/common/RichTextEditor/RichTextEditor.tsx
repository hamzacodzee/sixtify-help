"use client";

import { FormHelperText, useTheme } from "@mui/material";
import type { Editor, EditorOptions } from "@tiptap/core";
import {
  LinkBubbleMenu,
  RichTextEditor as MuiRichTextEditor,
  TableBubbleMenu,
  insertImages,
  type RichTextEditor as MuiRichTextEditorType,
  type RichTextEditorRef,
} from "mui-tiptap";
import type { ComponentProps } from "react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Controller,
  type Control,
  type FieldError,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { EditorMenuControls } from "./EditorMenuControls";
import { useExtensions } from "./useExtensions";

type SyncEditorContentProps = {
  editor: Editor | null;
  content: string;
};

const SyncEditorContent = ({ editor, content }: SyncEditorContentProps) => {
  useEffect(() => {
    if (!editor || editor.isFocused) {
      return;
    }

    const nextContent = content ?? "";

    const currentContent = editor.getHTML();

    if (currentContent !== nextContent) {
      editor.commands.setContent(nextContent, { emitUpdate: false });
    }
  }, [content, editor]);

  return null;
};

const fileListToImageFiles = (fileList: FileList): File[] =>
  Array.from(fileList).filter((file: File) =>
    (file.type || "").toLowerCase().startsWith("image/")
  );

type MuiRichTextEditorProps = ComponentProps<typeof MuiRichTextEditorType>;

export type RichTextEditorProps<
  TFieldValues extends FieldValues = FieldValues,
> = {
  minHeight?: string;
  isEditable?: boolean;
  showMenuBar?: boolean;
  placeholder?: string;
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  error?: FieldError;
  onChange?: (value: string) => void;
} & Omit<
  MuiRichTextEditorProps,
  "ref" | "content" | "editable" | "extensions" | "onChange"
>;

export const RichTextEditor = forwardRef<
  RichTextEditorRef,
  RichTextEditorProps
>(
  (
    {
      minHeight = "140px",
      isEditable = true,
      showMenuBar = true,
      placeholder = "Write paragraph text...",
      control,
      name,
      error,
      onChange,
      ...rest
    },
    ref
  ) => {
    const theme = useTheme();

    const extensions = useExtensions({ placeholder });

    const rteRef = useRef<RichTextEditorRef | null>(null);

    const [editorInstance, setEditorInstance] = useState<Editor | null>(null);

    useImperativeHandle(ref, () => {
      if (rteRef.current) {
        return rteRef.current;
      }

      return {
        editor: null,
      };
    }, []);

    const handleNewImageFiles = useCallback(
      (files: File[], insertPosition?: number): void => {
        if (!rteRef.current?.editor) {
          return;
        }

        const attributesForImageFiles = files.map((file) => ({
          src: URL.createObjectURL(file),
          alt: file.name,
        }));

        insertImages({
          images: attributesForImageFiles,
          editor: rteRef.current.editor,
          position: insertPosition,
        });
      },
      []
    );

    const handleDrop: NonNullable<EditorOptions["editorProps"]["handleDrop"]> =
      useCallback(
        (view, event) => {
          if (!(event instanceof DragEvent) || !event.dataTransfer) {
            return false;
          }

          const imageFiles = fileListToImageFiles(event.dataTransfer.files);

          if (imageFiles.length > 0) {
            const insertPosition = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            })?.pos;

            handleNewImageFiles(imageFiles, insertPosition);
            event.preventDefault();

            return true;
          }

          return false;
        },
        [handleNewImageFiles]
      );

    const handlePaste: NonNullable<
      EditorOptions["editorProps"]["handlePaste"]
    > = useCallback(
      (_view, event) => {
        if (!event.clipboardData) {
          return false;
        }

        const pastedImageFiles = fileListToImageFiles(
          event.clipboardData.files
        );

        if (pastedImageFiles.length > 0) {
          handleNewImageFiles(pastedImageFiles);

          return true;
        }

        return false;
      },
      [handleNewImageFiles]
    );

    const handleEditorRef = useCallback(
      (editorRef: RichTextEditorRef | null) => {
        if (!editorRef) {
          return;
        }

        rteRef.current = editorRef;

        if (editorRef.editor) {
          setEditorInstance((previousEditor) =>
            previousEditor === editorRef.editor
              ? previousEditor
              : editorRef.editor
          );
        }
      },
      []
    );

    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <SyncEditorContent
              editor={editorInstance}
              content={field.value ?? ""}
            />

            <MuiRichTextEditor
              ref={handleEditorRef}
              extensions={extensions}
              content={field.value ?? ""}
              editable={isEditable}
              onUpdate={({ editor }) => {
                const value = editor.getHTML();

                field.onChange(value);
                onChange?.(value);
                setEditorInstance(editor);
              }}
              editorProps={{
                handleDrop,
                handlePaste,
              }}
              renderControls={() =>
                showMenuBar ? (
                  <EditorMenuControls disabled={!isEditable} />
                ) : null
              }
              RichTextFieldProps={{
                variant: "outlined",
              }}
              sx={{
                borderRadius: 1.5,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                overflow: "hidden",
                transition: "border-color 0.15s ease",
                "&:focus-within": {
                  borderColor: theme.palette.primary.main,
                },
                "& .MuiTiptap-FieldContainer-notchedOutline": {
                  display: "none",
                },
                "& .MuiTiptap-RichTextField-menuBar": {
                  backgroundColor: theme.palette.background.default,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  py: 0.35,
                  px: 0.75,
                },
                "& .ProseMirror": {
                  minHeight,
                  padding: "8px 12px",
                  fontSize: "0.8125rem",
                  lineHeight: 1.6,
                  "& pre": {
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#0b0e14" : "#f1f5f9",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                    overflowX: "auto",
                  },
                  "& code": {
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                    backgroundColor: theme.palette.action.hover,
                    borderRadius: "4px",
                    padding: "1px 4px",
                  },
                  "& pre code": {
                    backgroundColor: "transparent",
                    padding: 0,
                  },
                  "& ul, & ol": {
                    paddingLeft: "20px",
                    margin: "4px 0",
                  },
                },
                "& .MuiTiptap-MenuSelect-root .MuiSelect-icon, & .MuiTiptap-MenuSelect-root .MuiSvgIcon-root":
                  {
                    right: "-5px",
                  },
              }}
              {...rest}
            >
              {() => (
                <>
                  <LinkBubbleMenu />
                  <TableBubbleMenu />
                </>
              )}
            </MuiRichTextEditor>

            {error?.message && (
              <FormHelperText error>{error.message}</FormHelperText>
            )}
          </>
        )}
      />
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";


"use client";

import React from "react";
import type { Control } from "react-hook-form";
import { Button, TextField } from "@codezee/sixtify-brahma";
import { Box, IconButton, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import { ColorPickerInput } from "@/components/common/ColorPickerInput";
import IconPicker from "@/components/common/IconPicker";
import type { ArticleBlock, ArticleCardItem } from "@/types/article";
import type { ArticleEditorFormValues } from "./blockConstants";

type CardsBlockEditorProps = {
  block: ArticleBlock;
  index: number;
  control: Control<ArticleEditorFormValues>;
  readOnly: boolean;
  onUpdateBlock: (id: string, patch: Partial<ArticleBlock>) => void;
};

export function CardsBlockEditor({
  block,
  index,
  control,
  readOnly,
  onUpdateBlock,
}: CardsBlockEditorProps) {
  const cards: ArticleCardItem[] = block.cards ?? [
    {
      icon: "Analytics",
      iconColor: "#2196f3",
      tag: "",
      title: "",
      description: "",
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {cards.map((card, cardIdx) => (
          <Paper
            key={cardIdx}
            variant="outlined"
            sx={{
              p: 1,
              borderRadius: 1.5,
              borderColor: "divider",
              backgroundColor: "background.default",
              display: "flex",
              flexDirection: "column",
              gap: 0.75,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ width: 140, flexShrink: 0 }}>
                <IconPicker
                  value={card.icon ?? "Analytics"}
                  disabled={readOnly}
                  onChange={(iconName) => {
                    const next = cards.map((c, i) =>
                      i === cardIdx ? { ...c, icon: iconName } : c
                    );

                    onUpdateBlock(block.id, { cards: next });
                  }}
                />
              </Box>
              <ColorPickerInput
                label="Icon Color"
                value={card.iconColor ?? "#2196f3"}
                disabled={readOnly}
                onChange={(color) => {
                  const next = cards.map((c, i) =>
                    i === cardIdx ? { ...c, iconColor: color } : c
                  );

                  onUpdateBlock(block.id, { cards: next });
                }}
              />
              <Box sx={{ width: 120, flexShrink: 0 }}>
                <TextField
                  name={`blocks.${index}.cards.${cardIdx}.tag`}
                  control={control}
                  disabled={readOnly}
                  fullWidth
                  placeholder="Tag (e.g. KPIS)"
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 140 }}>
                <TextField
                  name={`blocks.${index}.cards.${cardIdx}.title`}
                  control={control}
                  disabled={readOnly}
                  fullWidth
                  placeholder="Card title"
                />
              </Box>
              {!readOnly && cards.length > 1 && (
                <IconButton
                  size="small"
                  color="error"
                  sx={{ p: 0.4 }}
                  onClick={() => {
                    const next = cards.filter((_, i) => i !== cardIdx);

                    onUpdateBlock(block.id, { cards: next });
                  }}
                >
                  <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                </IconButton>
              )}
            </Box>
            <TextField
              name={`blocks.${index}.cards.${cardIdx}.description`}
              control={control}
              disabled={readOnly}
              multiline
              rows={2}
              fullWidth
              placeholder="Card description..."
            />
          </Paper>
        ))}

        {!readOnly && (
          <Box>
            <Button
              size="small"
              variant="outlined"
              startIcon={<AddIcon sx={{ fontSize: 15 }} />}
              onClick={() =>
                onUpdateBlock(block.id, {
                  cards: [
                    ...cards,
                    {
                      icon: "Analytics",
                      iconColor: "#2196f3",
                      tag: "",
                      title: "",
                      description: "",
                    },
                  ],
                })
              }
              sx={{
                fontSize: "0.75rem",
                py: 0.3,
                px: 1,
                borderRadius: 1.5,
              }}
            >
              Add Card
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}

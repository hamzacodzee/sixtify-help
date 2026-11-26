"use client";

import React, { type HTMLAttributeAnchorTarget } from "react";
import Link from "next/link";
import { Box, Stack, Typography, useTheme } from "@mui/material";

type RedirectionCellProps = {
  href?: string;
  target?: HTMLAttributeAnchorTarget;
  mainLabel: string;
  onClick?: () => void;
  disabled?: boolean;
  subLabel?: string;
  icon?: React.ReactNode;
  showIcon?: boolean;
  startIcon?: React.ReactNode;
  showStartIcon?: boolean;
  showMaxTitleLength?: number | string;
};

export const RedirectionCell = ({
  href,
  target,
  mainLabel,
  disabled,
  onClick,
  subLabel,
  icon,
  showIcon = true,
  startIcon,
  showStartIcon = true,
  showMaxTitleLength = "auto",
}: RedirectionCellProps) => {
  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  const titleNode = (
    <Typography variant="body2" maxWidth={showMaxTitleLength} noWrap>
      {mainLabel}
    </Typography>
  );

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      gap="5px"
      flex={1}
      minWidth={0}
    >
      <Stack justifyContent="center" gap={0.5} minWidth={0}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="start"
          gap="5px"
          minWidth={0}
        >
          {startIcon && showStartIcon && <Box>{startIcon}</Box>}

          {href && !disabled ? (
            <Link
              style={{
                color: butterflyBlue[900],
                cursor: "pointer",
                lineHeight: 1,
                textDecoration: "none",
                minWidth: 0,
              }}
              href={href}
              target={target}
              prefetch={false}
              onClick={onClick}
            >
              {titleNode}
            </Link>
          ) : (
            <Box
              component="span"
              onClick={disabled ? undefined : onClick}
              sx={{
                color: disabled ? "inherit" : butterflyBlue[900],
                cursor: disabled ? "default" : "pointer",
                lineHeight: 1,
                minWidth: 0,
                "&:hover": disabled ? undefined : { textDecoration: "underline" },
              }}
            >
              {titleNode}
            </Box>
          )}
        </Stack>

        {subLabel && (
          <Typography
            fontWeight={400}
            color={butterflyBlue[400]}
            variant="body2"
            component="span"
            lineHeight={1}
            noWrap
          >
            {subLabel}
          </Typography>
        )}
      </Stack>

      {icon && showIcon && icon}
    </Stack>
  );
};

import { ImageResponse } from "next/og";
import React from "react";

type CreatePwaIconResponseInput = {
  size: number;
  maskable?: boolean;
};

function createBar(width: string, height: string, color: string) {
  return React.createElement("div", {
    style: {
      width,
      height,
      borderRadius: "999px",
      background: color
    }
  });
}

export function createPwaIconResponse(input: CreatePwaIconResponseInput) {
  const iconInset = input.maskable ? 0.12 : 0.18;
  const innerSize = Math.round(input.size * (1 - iconInset * 2));
  const shellRadius = Math.round(input.size * 0.24);
  const accentSize = Math.max(20, Math.round(input.size * 0.16));

  return new ImageResponse(
    React.createElement(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0D10"
        }
      },
      React.createElement(
        "div",
        {
          style: {
            width: `${innerSize}px`,
            height: `${innerSize}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            borderRadius: `${shellRadius}px`,
            background: "linear-gradient(180deg, #171C22 0%, #12161B 100%)",
            boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.08)"
          }
        },
        React.createElement("div", {
          style: {
            position: "absolute",
            top: `${Math.round(innerSize * 0.16)}px`,
            right: `${Math.round(innerSize * 0.16)}px`,
            width: `${accentSize}px`,
            height: `${accentSize}px`,
            borderRadius: "999px",
            background: "#60A5FA"
          }
        }),
        React.createElement(
          "div",
          {
            style: {
              width: `${Math.round(innerSize * 0.42)}px`,
              display: "flex",
              flexDirection: "column",
              gap: `${Math.max(8, Math.round(innerSize * 0.06))}px`
            }
          },
          createBar("100%", `${Math.max(18, Math.round(innerSize * 0.11))}px`, "#60A5FA"),
          createBar("78%", `${Math.max(18, Math.round(innerSize * 0.11))}px`, "rgba(243,245,247,0.92)"),
          createBar("58%", `${Math.max(18, Math.round(innerSize * 0.11))}px`, "#22C55E")
        )
      )
    ),
    {
      width: input.size,
      height: input.size
    }
  );
}

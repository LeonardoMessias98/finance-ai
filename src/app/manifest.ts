import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Finance AI",
    short_name: "Finance AI",
    description: "Controle pessoal de finanças com visão mensal simples e objetiva.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0B0D10",
    theme_color: "#0B0D10",
    lang: "pt-BR",
    orientation: "portrait",
    categories: ["finance", "productivity"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png"
      }
    ]
  };
}

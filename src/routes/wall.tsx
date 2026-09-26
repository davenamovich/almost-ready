import { createFileRoute } from "@tanstack/react-router";
import { WallExperience } from "@/components/wall-experience";

export const Route = createFileRoute("/wall")({
  head: () => ({ meta: [
    { title: "The Wall — Plunder & Riffle" },
    { name: "description", content: "Explore live creations made with the Plunder & Riffle Meme Engine. One thought. Infinite ways to make it spread." },
    { property: "og:title", content: "The Wall — Plunder & Riffle" },
    { property: "og:description", content: "The internet is your canvas. Explore live creations made with the Plunder & Riffle Meme Engine." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: WallExperience,
});

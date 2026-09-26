import { createFileRoute } from "@tanstack/react-router";
import { WallExperience } from "@/components/wall-experience";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Plunder & Riffle — The Wall of Infinite Possibilities" },
    { name: "description", content: "The internet is your canvas. Explore live creations and make something of your own with Plunder & Riffle." },
    { property: "og:title", content: "Plunder & Riffle — The Wall of Infinite Possibilities" },
    { property: "og:description", content: "One thought. Infinite ways to make it spread. Explore the wall and create your own." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: WallExperience,
});

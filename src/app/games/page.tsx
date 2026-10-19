import type { Metadata } from "next";
import { GamesTimeline } from "@/components/games-timeline";

export const metadata: Metadata = {
  title: "Games",
  description: "Structs, Coindroids, and Schemaverse from Slow Ninja.",
};

export default function GamesPage() {
  return (
    <div className="pb-8">
      <GamesTimeline />
    </div>
  );
}

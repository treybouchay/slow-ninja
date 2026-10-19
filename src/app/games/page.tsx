import type { Metadata } from "next";
import { Suspense } from "react";
import { GamesTimeline } from "@/components/games-timeline";

export const metadata: Metadata = {
  title: "Games",
  description: "Structs, Coindroids, and Schemaverse from Slow Ninja.",
};

export default function GamesPage() {
  return (
    <div className="bg-[#070d16] pb-8">
      <Suspense
        fallback={
          <section className="py-24 text-center text-white/50">
            Loading catalog…
          </section>
        }
      >
        <GamesTimeline />
      </Suspense>
    </div>
  );
}

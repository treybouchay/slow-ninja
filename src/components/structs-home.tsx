"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { StructsScene } from "@/components/catalog/structs-scene";
import { UniverseDossier } from "@/components/catalog/universe-dossier";
import { games } from "@/lib/content";

const structs = games.find((game) => game.slug === "structs");

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return mobile;
}

/** Structs-only landing. The fleet and command line use the same stage as the catalog. */
export function StructsHome() {
  const sectionRef = useRef<HTMLElement>(null);
  const mobile = useIsMobile();
  const size = mobile ? 168 : 280;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const measure = () => {
      const circle = section.querySelector("[data-structs-planet]");
      if (!circle) return;
      const s = section.getBoundingClientRect();
      const c = circle.getBoundingClientRect();
      section.style.setProperty("--structs-cx", `${c.left - s.left + c.width / 2}px`);
      section.style.setProperty("--structs-cy", `${c.top - s.top + c.height / 2}px`);
      section.style.setProperty("--structs-r", `${c.width / 2}px`);
      const name = section.querySelector("[data-structs-title]");
      if (!name) return;
      const title = name.getBoundingClientRect();
      if (title.height > 0) {
        section.style.setProperty("--dialog-anchor", `${title.top - s.top}px`);
      }
    };
    measure();
    const timer = window.setTimeout(measure, 560);
    const settled = window.setTimeout(measure, 900);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(settled);
      window.removeEventListener("resize", measure);
    };
  }, [mobile, size]);

  if (!structs) return null;

  return (
    <section
      ref={sectionRef}
      id="games"
      className="relative overflow-hidden bg-[#070d16] pt-4 pb-16 md:pt-8 md:pb-24"
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <StructsScene active />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center md:px-6">
        <p
          className="font-mono-label text-[8px] tracking-widest uppercase md:text-[9px]"
          style={{ color: structs.accent }}
        >
          {structs.status}
        </p>
        <h1 className="font-display mt-3 text-5xl font-extrabold tracking-tight text-white md:text-7xl">
          {structs.name}
        </h1>
        <p className="mt-4 text-lg text-white/75 md:text-xl">{structs.tagline}</p>
        <a
          href={structs.href}
          target="_blank"
          rel="noreferrer"
          className="btn-bounce mt-6 inline-flex rounded-full bg-[var(--lime)] px-6 py-3.5 text-sm font-bold text-[var(--ink)] shadow-[4px_4px_0_var(--cyan)]"
        >
          Launch Structs
        </a>
      </div>

      <div className="relative z-20 mx-auto mt-8 flex flex-col items-center md:mt-10">
        <span className="font-mono-label mb-3 text-[9px] tracking-widest text-white uppercase md:text-[10px]">
          {structs.era}
        </span>
        <span
          data-structs-planet
          className="relative block overflow-hidden rounded-full border-4 bg-[#070d16]"
          style={{
            width: size,
            height: size,
            borderColor: structs.accent,
            boxShadow: `0 0 48px ${structs.accent}66`,
          }}
        >
          <Image
            src={structs.artwork}
            alt=""
            fill
            sizes={`${size}px`}
            className="pointer-events-none object-cover"
            priority
          />
        </span>
        <span
          data-structs-title
          className="font-display mt-4 text-xl font-bold text-white md:text-2xl"
        >
          {structs.name}
        </span>
      </div>

      <div className="relative z-10 px-4">
        <div className="mx-auto mt-28 w-full max-w-[425px]">
          <UniverseDossier game={structs} className="dossier-spring" />
        </div>
      </div>
    </section>
  );
}

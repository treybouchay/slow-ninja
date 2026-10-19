import type { Metadata } from "next";
import { IBM_Plex_Mono, Source_Sans_3, Syne } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Slow Ninja — Skill-based systems since 2014",
    template: "%s · Slow Ninja",
  },
  description:
    "Slow Ninja is a game studio building readable, skill-based worlds—Structs, Coindroids, and Schemaverse—with technical writing from the craft of making them.",
  metadataBase: new URL("https://slow.ninja"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col font-[family-name:var(--font-body)]">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

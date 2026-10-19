import type { Metadata } from "next";
import { Inter, Inter_Tight, Press_Start_2P } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

/* Match playstructs.com font stack: Inter, Inter Tight, Press Start 2P */
const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const display = Inter_Tight({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const pixel = Press_Start_2P({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: {
    default: "Slow Ninja — Building games for the sentient",
    template: "%s · Slow Ninja",
  },
  description:
    "Slow Ninja makes skill-based games with serious systems and a playful streak—Structs, Coindroids, Schemaverse, and a technical journal.",
  metadataBase: new URL("https://slow.ninja"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${pixel.variable} h-full`}
    >
      <body className="font-body flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

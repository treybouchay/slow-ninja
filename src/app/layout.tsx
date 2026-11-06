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
    default: "Structs — A 5X space strategy game",
    template: "%s · Slow Ninja",
  },
  description:
    "Structs is Slow Ninja’s 5X space strategy game. Command sentient machines racing for Alpha Matter across a decentralized Cosmos galaxy.",
  metadataBase: new URL("https://slow.ninja"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${pixel.variable} h-full`}
    >
      <body className="font-body flex min-h-full flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var m={gold:['#f3c15b','#e08a3c'],lilac:['#e4d4ff','#ff7a59']};var p=localStorage.getItem('slow-ninja-palette');if(m[p]){document.documentElement.dataset.palette=p;document.documentElement.style.setProperty('--lime',m[p][0]);document.documentElement.style.setProperty('--cyan',m[p][1])}}catch(e){}",
          }}
        />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

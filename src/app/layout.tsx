import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Literata } from "next/font/google";
import Spotlight from "@/components/ui/Spotlight/Spotlight";
import { getProfile } from "@/lib/content/content";
import { buildMetadata } from "@/lib/metadata/metadata";
import "./globals.css";

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-head",
  subsets: ["latin"],
});

const literata = Literata({
  variable: "--font-body",
  subsets: ["latin"],
});

// Lets the fixed bottom bar reach the screen edge and use the safe area.
export const viewport: Viewport = {
  viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getProfile());
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${jetBrainsMono.variable} ${literata.variable}`}
    >
      <body>
        <Spotlight />
        {children}
      </body>
    </html>
  );
}

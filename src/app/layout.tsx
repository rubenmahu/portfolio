import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import { getProfile } from "@/lib/content/content";
import { buildMetadata } from "@/lib/metadata/metadata";
import "./globals.css";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-head",
  subsets: ["latin"],
  // Optical size: the big titles use the display cut of the font.
  axes: ["opsz"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
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
      className={`${bricolageGrotesque.variable} ${inter.variable} ${jetBrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

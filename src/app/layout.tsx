import type { Metadata } from "next";
import { Familjen_Grotesk, Literata } from "next/font/google";
import { getProfile } from "@/lib/content/content";
import { buildMetadata } from "@/lib/metadata/metadata";
import "./globals.css";

const familjenGrotesk = Familjen_Grotesk({
  variable: "--font-head",
  subsets: ["latin"],
});

const literata = Literata({
  variable: "--font-body",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getProfile());
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${familjenGrotesk.variable} ${literata.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

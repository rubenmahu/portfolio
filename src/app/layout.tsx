import type { Metadata } from "next";
import { Familjen_Grotesk, Literata } from "next/font/google";
import "./globals.css";

const familjenGrotesk = Familjen_Grotesk({
  variable: "--font-head",
  subsets: ["latin"],
});

const literata = Literata({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rubén Maestro | Desarrollador frontend",
  description:
    "Portfolio de Rubén Maestro: frontend con Angular y React, y aprendizaje de desarrollo con agentes de IA.",
};

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

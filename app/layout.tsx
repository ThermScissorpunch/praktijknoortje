import "../styles.css";
import React from "react";
import { ThemeProvider } from "../components/theme-provider";
import { Inter as FontSans, Lato, Nunito } from "next/font/google";
import { cn } from "../lib/utils";
import { Metadata } from "next";
import client from "../tina/__generated__/client";

const SITE_URL = "https://www.praktijknoortje.nl";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Praktijk Noortje - Hypnotherapie & EMDR in Boekel",
    template: "%s | Praktijk Noortje",
  },
  description:
    "Ben je op zoek naar meer ontspanning, emotionele balans, wil je trauma's of blokkades aanpakken of gedragspatronen doorbreken? Praktijk Noortje biedt hypnotherapie en EMDR in Boekel.",
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: "Praktijk Noortje",
    title: "Praktijk Noortje - Hypnotherapie & EMDR in Boekel",
    description:
      "Ben je op zoek naar meer ontspanning, emotionele balans, wil je trauma's of blokkades aanpakken of gedragspatronen doorbreken?",
    url: SITE_URL,
  },
  twitter: {
    card: "summary",
    title: "Praktijk Noortje - Hypnotherapie & EMDR in Boekel",
    description:
      "Ben je op zoek naar meer ontspanning, emotionele balans, wil je trauma's of blokkades aanpakken of gedragspatronen doorbreken?",
  },
  alternates: {
    canonical: SITE_URL,
  },
  other: {
    "trustpilot-one-time-domain-verification-id":
      "bc192de7-bddb-4d18-9a44-cae6c0afd01a",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const globalQuery = await client.queries.global({
    relativePath: "index.json",
  });
  const global = globalQuery.data.global;

  const selectFont = (fontName: string) => {
    switch (fontName) {
      case "nunito":
        return `font-nunito ${nunito.variable}`;
      case "lato":
        return `font-lato ${lato.variable}`;
      case "sans":
      default:
        return `font-sans ${fontSans.variable} `;
    }
  };
  const fontVariable = selectFont(global.theme.font);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: "Praktijk Noortje",
    description:
      "Hypnotherapie en EMDR praktijk in Boekel. Hulp bij ontspanning, emotionele balans, trauma's, blokkades en gedragspatronen.",
    url: SITE_URL,
    logo: "https://assets.tina.io/4c56b08b-ff46-4470-b58a-44777f9310dd/logo.png",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Boekel",
      addressCountry: "NL",
    },
    additionalType: "https://schema.org/HealthAndBeautyBusiness",
  };

  return (
    <html lang="nl" suppressHydrationWarning>
      <body
        className={cn("min-h-screen flex flex-col antialiased", fontVariable)}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          forcedTheme={global.theme.darkMode}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

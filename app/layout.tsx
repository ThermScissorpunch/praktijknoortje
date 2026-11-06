import "../styles.css";
import React from "react";
import { ThemeProvider } from "../components/theme-provider";
import { Inter as FontSans, Lato, Nunito } from "next/font/google";
import { cn } from "../lib/utils";
import { Metadata } from "next";
import client from "../tina/__generated__/client";
import {
  BUSINESS,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
} from "../lib/seo";

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
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
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

  const offer = (
    name: string,
    price: number,
    description: string,
    path = "/tarieven"
  ) => ({
    "@type": "Offer",
    price,
    priceCurrency: "EUR",
    url: `${SITE_URL}/tarieven`,
    itemOffered: {
      "@type": "Service",
      name,
      description,
      url: `${SITE_URL}${path}`,
    },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#business`,
        additionalType: "https://schema.org/HealthAndBeautyBusiness",
        name: SITE_NAME,
        description:
          "Praktijk voor hypnotherapie en EMDR in Boekel. Hulp bij trauma, angst, blokkades, chronische pijn, gedragspatronen en stoppen met roken.",
        url: SITE_URL,
        logo: `${SITE_URL}/uploads/logo.png`,
        image: `${SITE_URL}${DEFAULT_OG_IMAGE.url}`,
        telephone: BUSINESS.phone,
        email: BUSINESS.email,
        priceRange: "€50 - €350",
        hasMap: BUSINESS.mapsUrl,
        address: {
          "@type": "PostalAddress",
          streetAddress: BUSINESS.street,
          postalCode: BUSINESS.postalCode,
          addressLocality: BUSINESS.city,
          addressRegion: BUSINESS.region,
          addressCountry: BUSINESS.country,
        },
        areaServed: [
          "Boekel",
          "Uden",
          "Gemert",
          "Veghel",
          "Erp",
          "Volkel",
          "Noord-Brabant",
        ],
        founder: { "@id": `${SITE_URL}/#noortje` },
        makesOffer: [
          offer("Kennismakingsgesprek en advies", 50, "Kennismakingsgesprek van ongeveer 45 minuten"),
          offer("EMDR", 80, "EMDR-sessie van ongeveer 60 minuten, ook EMDR flash forward", "/emdr"),
          offer("Hypnotherapie", 150, "Hypnotherapie-sessie van ongeveer 120 minuten, waaronder regressie en Soulkey", "/hypnotherapie"),
          offer("Hypnotic Heaven", 80, "Hypnotherapie bij chronische pijn, langdurige ziekte en oncologie, ongeveer 60 minuten", "/hypnotic-heaven"),
          offer("Stoppen met roken", 350, "Kennismaking plus 2 of 3 sessies hypnose", "/stoppen-met-roken"),
        ],
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#noortje`,
        name: BUSINESS.owner,
        jobTitle: "Hypnotherapeut, EMDR-therapeut en Sociaal Psychiatrisch Verpleegkundige",
        url: `${SITE_URL}/over-mij`,
        worksFor: { "@id": `${SITE_URL}/#business` },
        knowsAbout: [
          "EMDR",
          "Hypnotherapie",
          "Regressietherapie",
          "Traumaverwerking",
          "Stoppen met roken",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: "nl-NL",
        publisher: { "@id": `${SITE_URL}/#business` },
      },
    ],
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

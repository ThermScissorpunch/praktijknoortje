import type { Metadata } from "next";

export const SITE_URL = "https://www.praktijknoortje.nl";
export const SITE_NAME = "Praktijk Noortje";

/** Name, address and phone. Keep identical to the Google Business Profile listing. */
export const BUSINESS = {
  name: SITE_NAME,
  owner: "Noortje Aldenhuijsen",
  street: "Molenstraat 16",
  postalCode: "5427 PV",
  city: "Boekel",
  region: "Noord-Brabant",
  country: "NL",
  phone: "+31611353776",
  phoneDisplay: "06 11 35 37 76",
  email: "info@praktijknoortje.nl",
  mapsUrl: "https://maps.app.goo.gl/aPd9YPzCN5QMQASn7",
};

export const DEFAULT_TITLE = "Praktijk Noortje - Hypnotherapie & EMDR in Boekel";
export const DEFAULT_DESCRIPTION =
  "Hypnotherapie en EMDR in Boekel (Noord-Brabant). Hulp bij trauma, angst, blokkades, chronische pijn en stoppen met roken. Plan een kennismakingsgesprek.";

export const DEFAULT_OG_IMAGE = {
  // 1200x630 crop of /uploads/Noortje (11 van 1).jpg, the size social platforms expect
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Noortje Aldenhuijsen, hypnotherapeut en EMDR-therapeut in Boekel",
};

/**
 * Next.js merges metadata shallowly: a page that sets `openGraph` replaces the
 * layout's `openGraph` entirely. This helper rebuilds the full set per page so
 * siteName, locale and image are never lost.
 */
export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  type = "website",
  image,
  publishedTime,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path: string;
  type?: "website" | "article";
  image?: string;
  publishedTime?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const socialTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const images = image ? [{ url: image }] : [DEFAULT_OG_IMAGE];

  return {
    // An explicit `title: undefined` removes the layout default, leaving the page without a <title>.
    title: title ?? { absolute: DEFAULT_TITLE },
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      locale: "nl_NL",
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      url,
      images,
      ...(publishedTime && { publishedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: images.map((i) => i.url),
    },
    ...(noIndex && { robots: { index: false, follow: true } }),
  };
}

/** Flattens a TinaCMS rich-text tree to plain text, for meta descriptions. */
export function richTextToPlain(node: unknown, maxLength = 160): string {
  const parts: string[] = [];
  const walk = (n: any) => {
    if (!n) return;
    if (typeof n.text === "string") parts.push(n.text);
    if (Array.isArray(n.children)) n.children.forEach(walk);
  };
  walk(node);
  const text = parts.join(" ").replace(/\s+/g, " ").trim();
  return text.length > maxLength
    ? `${text.slice(0, maxLength - 1).replace(/\s+\S*$/, "")}…`
    : text;
}

/** Treatment pages that sit under /aanbod in the breadcrumb trail (URLs stay flat). */
export const TREATMENT_PAGES = [
  "emdr",
  "hypnotherapie",
  "hypnotic-heaven",
  "stoppen-met-roken",
];

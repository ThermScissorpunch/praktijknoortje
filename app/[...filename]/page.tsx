import React from "react";
import { Metadata } from "next";
import client from "../../tina/__generated__/client";
import ClientPage from "./client-page";
import Layout from "../../components/layout/layout";

const SITE_URL = "https://www.praktijknoortje.nl";

export async function generateMetadata({
  params,
}: {
  params: { filename: string[] };
}): Promise<Metadata> {
  const data = await client.queries.page({
    relativePath: `${params.filename}.md`,
  });
  const page = data.data.page;
  const seoTitle = page.seoTitle || page.title;
  const seoDescription = page.seoDescription || undefined;
  const isHome = params.filename[0] === "home";
  const canonicalPath = isHome ? "" : `/${params.filename.join("/")}`;

  return {
    title: isHome ? undefined : seoTitle,
    description: seoDescription,
    alternates: {
      canonical: `${SITE_URL}${canonicalPath}`,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `${SITE_URL}${canonicalPath}`,
      type: "website",
    },
  };
}

export default async function Page({
  params,
}: {
  params: { filename: string[] };
}) {
  const data = await client.queries.page({
    relativePath: `${params.filename}.md`,
  });
  const page = data.data.page;
  const isHome = params.filename[0] === "home";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      ...(!isHome
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: page.title,
              item: `${SITE_URL}/${params.filename.join("/")}`,
            },
          ]
        : []),
    ],
  };

  return (
    <Layout rawPageData={data}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ClientPage {...data}></ClientPage>
    </Layout>
  );
}

export async function generateStaticParams() {
  const pages = await client.queries.pageConnection();
  const paths = pages.data?.pageConnection.edges.map((edge) => ({
    filename: edge.node._sys.breadcrumbs,
  }));

  return paths || [];
}

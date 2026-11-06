import React from "react";
import { Metadata } from "next";
import client from "../../tina/__generated__/client";
import ClientPage from "./client-page";
import Layout from "../../components/layout/layout";
import { SITE_URL, TREATMENT_PAGES, buildMetadata } from "../../lib/seo";

export async function generateMetadata({
  params,
}: {
  params: { filename: string[] };
}): Promise<Metadata> {
  const data = await client.queries.page({
    relativePath: `${params.filename}.md`,
  });
  const page = data.data.page;
  const isHome = params.filename[0] === "home";

  return buildMetadata({
    title: isHome ? undefined : page.seoTitle || page.title,
    description: page.seoDescription || undefined,
    path: isHome ? "" : `/${params.filename.join("/")}`,
  });
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

  const crumbs = [{ name: "Home", item: SITE_URL }];
  if (TREATMENT_PAGES.includes(params.filename[0])) {
    crumbs.push({ name: "Aanbod", item: `${SITE_URL}/aanbod` });
  }
  if (!isHome) {
    crumbs.push({
      name: page.title,
      item: `${SITE_URL}/${params.filename.join("/")}`,
    });
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      ...crumb,
    })),
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

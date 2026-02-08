import React from "react";
import { Metadata } from "next";
import client from "../../../tina/__generated__/client";
import Layout from "../../../components/layout/layout";
import PostClientPage from "./client-page";

const SITE_URL = "https://www.praktijknoortje.nl";

export async function generateMetadata({
  params,
}: {
  params: { filename: string[] };
}): Promise<Metadata> {
  const data = await client.queries.post({
    relativePath: `${params.filename.join("/")}.mdx`,
  });
  const post = data.data.post;
  const canonicalUrl = `${SITE_URL}/posts/${params.filename.join("/")}`;

  return {
    title: post.title,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      url: canonicalUrl,
      type: "article",
      ...(post.heroImg && { images: [{ url: post.heroImg }] }),
      ...(post.date && { publishedTime: post.date }),
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: { filename: string[] };
}) {
  const data = await client.queries.post({
    relativePath: `${params.filename.join("/")}.mdx`,
  });
  const post = data.data.post;
  const canonicalUrl = `${SITE_URL}/posts/${params.filename.join("/")}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    url: canonicalUrl,
    ...(post.date && { datePublished: post.date }),
    ...(post.heroImg && { image: post.heroImg }),
    ...(post.author && {
      author: {
        "@type": "Person",
        name: post.author.name,
      },
    }),
    publisher: {
      "@type": "Organization",
      name: "Praktijk Noortje",
      url: SITE_URL,
    },
  };

  return (
    <Layout rawPageData={data}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostClientPage {...data} />
    </Layout>
  );
}

export async function generateStaticParams() {
  const posts = await client.queries.postConnection();
  const paths = posts.data?.postConnection.edges.map((edge) => ({
    filename: edge.node._sys.breadcrumbs,
  }));
  return paths || [];
}

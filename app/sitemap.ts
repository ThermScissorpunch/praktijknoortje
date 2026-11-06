import { MetadataRoute } from "next";
import client from "../tina/__generated__/client";
import { SITE_URL } from "../lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await client.queries.pageConnection();
  const posts = await client.queries.postConnection();

  const pageEntries: MetadataRoute.Sitemap = (
    pages.data?.pageConnection.edges ?? []
  ).map((edge) => {
    const isHome = edge.node._sys.filename === "home";
    return {
      url: isHome
        ? SITE_URL
        : `${SITE_URL}/${edge.node._sys.breadcrumbs.join("/")}`,
      changeFrequency: isHome ? "weekly" : "monthly",
      priority: isHome ? 1.0 : 0.8,
    };
  });

  const postEntries: MetadataRoute.Sitemap = (
    posts.data?.postConnection.edges ?? []
  ).map((edge) => ({
    url: `${SITE_URL}/posts/${edge.node._sys.breadcrumbs.join("/")}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...pageEntries,
    // The blog index is noindex while empty, so only list it once posts exist.
    ...(postEntries.length > 0
      ? [
          {
            url: `${SITE_URL}/posts`,
            changeFrequency: "weekly" as const,
            priority: 0.7,
          },
        ]
      : []),
    ...postEntries,
  ];
}

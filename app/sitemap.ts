import { MetadataRoute } from "next";
import client from "../tina/__generated__/client";

const SITE_URL = "https://www.praktijknoortje.nl";

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
    {
      url: `${SITE_URL}/posts`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...postEntries,
  ];
}

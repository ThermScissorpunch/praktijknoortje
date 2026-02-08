import { Metadata } from "next";
import Layout from "../../components/layout/layout";
import client from "../../tina/__generated__/client";
import PostsClientPage from "./client-page";

export const metadata: Metadata = {
  title: "Blog",
  alternates: {
    canonical: "https://www.praktijknoortje.nl/posts",
  },
  openGraph: {
    title: "Blog | Praktijk Noortje",
    url: "https://www.praktijknoortje.nl/posts",
    type: "website",
  },
};

export default async function PostsPage() {
  const posts = await client.queries.postConnection();

  if (!posts) {
    return null;
  }

  return (
    <Layout rawPageData={posts.data}>
      <PostsClientPage {...posts} />
    </Layout>
  );
}

import { Metadata } from "next";
import Layout from "../../components/layout/layout";
import client from "../../tina/__generated__/client";
import PostsClientPage from "./client-page";
import { buildMetadata } from "../../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const posts = await client.queries.postConnection();
  const hasPosts = (posts.data?.postConnection.edges?.length ?? 0) > 0;

  return buildMetadata({
    title: "Blog",
    description:
      "Artikelen over hypnotherapie, EMDR, traumaverwerking en de kracht van het onderbewuste, door Praktijk Noortje in Boekel.",
    path: "/posts",
    // An empty listing page is thin content; keep it out of the index until there are posts.
    noIndex: !hasPosts,
  });
}

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

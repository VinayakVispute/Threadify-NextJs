import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const result = await fetchPosts(1, 30);
  const userInfo = await currentUser();

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No thread found</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <ThreadCard
                key={post?.id}
                id={post?.id}
                currentUser={userInfo?.id}
                parentId={post?.parentId}
                author={post?.author}
                community={post?.community}
                content={post?.text}
                createdAt={post?.createdAt}
                comments={post?.children}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
}

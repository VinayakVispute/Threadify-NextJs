import { fetchUserPosts } from "@/lib/actions/thread.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";

async function ThreadsTab({ currentUserId, accountId, accountType }) {
  let result = await fetchUserPosts(accountId);
  if (!result) redirect("/");

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.threads.map((thread) => (
        <ThreadCard
          key={thread?.id}
          id={thread?.id}
          currentUser={currentUserId}
          parentId={thread?.parentId}
          author={
            accountType === "User"
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          } //todo
          community={thread?.community} //todo
          content={thread?.text}
          createdAt={thread?.createdAt}
          comments={thread?.children}
        />
      ))}
    </section>
  );
}

export default ThreadsTab;

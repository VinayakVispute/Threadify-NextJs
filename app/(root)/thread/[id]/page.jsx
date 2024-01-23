import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function page({ params }) {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (userInfo && userInfo.onboarded === false) redirect("/onboarding");

  const thread = await fetchThreadById(params.id);

  return (
    <section className="relative">
      <div>
        {/* !important Error Maybe */}
        <ThreadCard
          key={thread?.id}
          id={thread?.id}
          currentUser={userInfo?.id}
          parentId={thread?.parentId}
          author={thread?.author}
          community={thread?.community}
          content={thread?.text}
          createdAt={thread?.createdAt}
          comments={thread?.children}
        />
      </div>
      <div className="mt-7">
        <Comment
          threadId={thread?.id}
          currentUserImg={userInfo?.image}
          currentUserId={JSON.stringify(userInfo?._id)}
        />
      </div>
      <div className="mt-10">
        {thread?.children?.map((childItems) => (
          <ThreadCard
            key={childItems?.id}
            id={childItems?.id}
            currentUser={childItems?.id}
            parentId={childItems?.parentId}
            author={childItems?.author}
            community={childItems?.community}
            content={childItems?.text}
            createdAt={childItems?.createdAt}
            comments={childItems?.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
}

export default page;

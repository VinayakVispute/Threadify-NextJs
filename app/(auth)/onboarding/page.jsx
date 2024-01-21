import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs";

const Page = async () => {
  const user = await currentUser();

  const userInfo = {};

  const userData = {
    id: user?.id,
    objectId: userInfo?._id, //will come from database,,
    username: userInfo?.username || user?.username,
    name: userInfo?.name || user?.firstName || "",
    bio: userInfo?.bio || "",
    image: userInfo?.image || user?.imageUrl,
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Threadify-OnBoarding</h1>
      {/* <p className="mt-3 text-base-regular text-light-2 text-red-800 font-bold text-sm"> */}
      <p
        className="mt-3  text-red-800 font-bold"
        style={{ fontSize: "0.75rem", lineHeight: "1rem" }}
      >
        Complete your profile now to use Threadify
      </p>
      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </main>
  );
};

export default Page;

"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDb } from "../mongoose";
import Thread from "../models/thread.model";

export async function updateUser({ userId, username, name, bio, image, path }) {
  try {
    connectToDb();

    await User.findOneAndUpdate(
      {
        id: userId,
      },
      {
        username: username.toLowerCase(),
        name,
        image,
        bio,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error) {
    throw new Error(`Failed to Update/Set User : ${error.message}`);
  }
}

export async function fetchUser(userId) {
  try {
    connectToDb();

    return await User.findOne({ id: userId });
    // .populate({
    //   path: "communities",
    //   model: Community,
    // });
  } catch (error) {
    throw new Error(`Failed to Fetch User : ${error.message}`);
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}) {
  try {
    connectToDb();
    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, "i"); // case insensitive

    const query = {
      id: { $ne: userId },
    };

    if (searchString.trim != "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = { createdBy: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = User.countDocuments(query);

    const users = await usersQuery.exec();
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    throw new Error(`Failed to fetch users : ${error.message}`);
  }
}

export async function getActivity(userId) {
  try {
    connectToDb();

    //find all threads by the users

    const userThreads = await Thread.find({ author: userId });
    console.log("userThreads", userThreads);
    //collect all  the child threads ids (replies) from the children field

    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);
    console.log("childThreadIds", childThreadIds);

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });
    console.log("replies", replies);

    return replies;
  } catch (error) {
    throw new Error(`Error fetching Activity: ${error.message}`);
  }
}

"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDb } from "../mongoose";

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

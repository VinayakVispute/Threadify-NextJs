"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDb } from "../mongoose";

export async function CreateThread({ text, author, communityId, path }) {
  try {
    connectToDb();

    const CreateThread = await Thread.create({
      text,
      author,
      community: null,
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: CreateThread._id },
    });

    revalidatePath(path);
  } catch (error) {
    throw new Error(`Error creating thread: ${error.message}`);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDb();

  const skipAmount = (pageNumber - 1) * pageSize;

  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: -1 })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });

  const totalPostsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

export async function fetchThreadById(threadId) {
  try {
    connectToDb();

    //TODO : Populate the Community field

    const thread = await Thread.findById(threadId)
      .populate({
        path: "author",
        module: User,
        select: "_id id image name",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            selected: "_id id image parentId name",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              selected: "_id id image parentId name",
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (error) {
    throw new Error(`Error fetching thread: ${error.message}`);
  }
}

export async function addCommentToThread(threadId, commentText, userId, path) {
  connectToDb();
  try {
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) throw new Error("Thread not found");

    //
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
      community: null,
    });

    const savedCommentThread = await commentThread.save();

    originalThread.children.push(savedCommentThread._id);

    await originalThread.save();

    revalidatePath(path);
  } catch (error) {
    throw new Error(`Error adding comment to thread: ${error.message}`);
  }
}

export async function fetchUserPosts(userId) {
  try {
    connectToDb();

    //Populate Community

    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "author",
        model: User,
        select: "id image  name",
      },
    });

    return threads;
  } catch (error) {
    throw new Error(`Error fetching threads by user posts: ${error.message}`);
  }
}

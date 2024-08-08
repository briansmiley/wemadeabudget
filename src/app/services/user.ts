import { get } from "http";
import prisma from "../client";
import { auth, currentUser, User } from "@clerk/nextjs/server";
const queries = {
  findUserByClerkId: async (clerkId: string) => {
    const user = await prisma.user.findUnique({
      where: {
        clerkId: clerkId
      }
    });
    return user;
  }
};
const mutations = {
  /** Finds, updates, or adds a user using clerk id and optional email and username */
  upsertClerkUser: async (
    clerkId: string,
    email?: string,
    username?: string
  ) => {
    const user = await prisma.user.upsert({
      where: {
        clerkId: clerkId
      },
      update: {
        email: email,
        username: username
      },
      create: {
        clerkId: clerkId,
        email: email ?? "",
        username: username ?? ""
      }
    });
    return user;
  },
  removeUser: async (userId: string) => {
    const deletedUser = await prisma.user.delete({
      where: {
        id: userId
      }
    });
    return deletedUser;
  }
};
export const userServices = {
  findUserByClerkId: async (clerkId: string) => {
    return await queries.findUserByClerkId(clerkId);
  },
  upsertUserFromClerkDetails: async (
    clerkId: string,
    email: string,
    username: string
  ) => {
    return await mutations.upsertClerkUser(clerkId, email, username);
  },
  removeUser: async (userId: string) => {
    return await mutations.removeUser(userId);
  }
};

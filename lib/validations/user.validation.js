import * as z from "zod";

export const UserValidation = z.object({
  profile_photo: z.string().url().nonempty(),
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(30, { message: "Name cannot exceed 30 characters" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(30, { message: "Username cannot exceed 30 characters" }),
  bio: z
    .string()
    .min(3, { message: "Bio must be at least 3 characters long" })
    .max(1000, { message: "Bio cannot exceed 1000 characters" }),
});

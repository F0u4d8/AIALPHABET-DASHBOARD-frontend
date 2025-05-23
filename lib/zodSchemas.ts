import { Permissions } from "@prisma/client";
import { boolean, number, object, string, any, z } from "zod";

export const signUpSchema = object({
  email: string({ required_error: "Email is required" }).email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must be at most 32 characters"),
  qrCode: string({ required_error: "QR code is required" }),
});

export const signInSchema = object({
  email: string({ required_error: "Email is required" }).email("Invalid email"),
  password: string({ required_error: "Password is required" }),
});

export const profileSchema = object({
  username: string({ required_error: "username is required" }),
  avatarUrl: string({ required_error: "avatar is required" }),
});

export const profileUpdateSchema = object({
  username: string({ required_error: "username is required" }),
  avatarUrl: string({ required_error: "avatar is required" }),
  email: string({ required_error: "email is required" }).email("Invalid email"),
});

export const categorySchema = object({
  name: string({ required_error: "category name is required" }),
  description: string({ required_error: "category description is required" }),
});

export const contentSchema = object({
  title: string({ required_error: "content title is required" }),
  pitch: string({ required_error: "content pitch is required" }),
  categoryId: string({ required_error: "category id is required" }),
  appStoreUrl: string({
    required_error: "content app store url is required",
  }).url("Invalid app store url"),
  playStoreUrl: string({
    required_error: "content play store url is required",
  }).url("Invalid play store url"),
  image: any().optional(),
  imageUrl: string().url("Invalid image URL").optional(),
}).refine((data) => data.image || data.imageUrl, {
  message: "Either image file or image URL must be provided",
  path: ["image"],
});

export const todoSchema = object({
  title: string({ required_error: "Title is required" }),
  description: string().optional(),
  priority: number().int().min(0).max(3).default(2),
  isCompleted: boolean().default(false),
});

export const updateTodoSchema = object({
  title: string().optional(),
  description: string().optional(),
  priority: number().int().min(0).max(3).default(2).optional(),
  isCompleted: boolean().default(false).optional(),
});

export const bookSchema = z
  .object({
    title: z.string().min(1, "العنوان مطلوب"),
    description: z.string().optional(),
    permission: z.nativeEnum(Permissions).array(),
    image: z.any().optional(),
    imageUrl: z.string().url("Invalid image URL").optional(),
  })
  .refine((data) => data.image || data.imageUrl || true, {
    message: "Either image file or image URL must be provided",
    path: ["image"],
  });

export const qrCodeSchema = z.object({
  bookId: z.string().min(1, "الكتاب مطلوب"),
});

// Password update schema
export const passwordUpdateSchema = z.object({
  currentPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must be at most 32 characters"),
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must be at most 32 characters"),
});

import { Permission } from "@prisma/client";
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
  appStoreUrl: string({ required_error: "content app store url is required" }).url("Invalid app store url"),
  playStoreUrl: string({ required_error: "content play store url is required" }).url("Invalid play store url"),
  image: any({ required_error: "content image is required" }), // Changed from URL to file
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

export const bookSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  description: z.string().optional(),
  permission: z.nativeEnum(Permission).array(),
  image: z.instanceof(File, { message: "الصورة مطلوبة" }),
});

export const qrCodeSchema = z.object({
  bookId: z.string().min(1, "الكتاب مطلوب"),
});

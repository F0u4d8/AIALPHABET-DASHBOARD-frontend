import { object, string  } from "zod";

export const signUpSchema = object({
 
    email: string({ required_error: "Email is required" }).email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must be at most 32 characters"),
    qrCode: string({required_error : "QR code is required"}) ,
});

export const signInSchema = object({
  email: string({ required_error: "Email is required" }).email("Invalid email"),
  password: string({ required_error: "Password is required" }),
});


export const profileSchema = object({
  username: string({ required_error: "username is required" }),
  avatarUrl: string({ required_error: "avatar is required" }).url("Invalid avatar"),
});
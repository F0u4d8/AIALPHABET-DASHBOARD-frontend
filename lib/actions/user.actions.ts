"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

export const logout = async () => {
  await signOut({ redirectTo: "/" });
  revalidatePath("/");
};

export const loginWithCreds = async (
  state: any,
  formData: FormData
)=> {
  const rawFormData = {
    email: formData.get("email"),
    password: formData.get("password"),
    redirectTo: "/dashboard",
  };

  try {
    await signIn("credentials", rawFormData);
    revalidatePath("/dashboard");

  } catch (error: any) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'
        default:
          return 'Something went wrong.'
      }
  }
  throw error;

  }
};

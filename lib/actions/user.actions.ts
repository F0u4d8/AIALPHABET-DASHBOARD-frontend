"use server";

import { signIn, signOut } from "@/auth";
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
    if (error.type === "AuthError") {
      return { 
          error: { message: error.message }
      }
  }
  throw error;

  }
};

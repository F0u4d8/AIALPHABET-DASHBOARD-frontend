"use server";

import { signIn, signOut } from "@/auth";
import { revalidatePath } from "next/cache";

export const logout = async () => {
  await signOut({ redirectTo: "/" });
  revalidatePath("/");
};

export const loginWithCreds = async (  prevState: string | undefined,
  formData: FormData) => {
  const rawFormData = {
    email: formData.get("email"),
    password: formData.get("password"),
    redirectTo: "/",
  };

  try {
    await signIn("credentials", rawFormData);
    revalidatePath("/dashboard");

  } catch (error: any) {
    throw error;
  }
};

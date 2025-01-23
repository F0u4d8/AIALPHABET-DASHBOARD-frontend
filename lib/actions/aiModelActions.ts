"use server";

import prisma from "../db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const aiModelSchema = z.object({
  name: z.string().min(1, "Model name is required"),
  apiKey: z.string().min(1, "API key is required"),
});

export async function fetchAiModel() {
  try {
    const model = await prisma.aiModel.findFirst();
    return model;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch AI model.");
  }
}

export async function updateAiModel(prevState: any, formData: FormData) {
  const validatedFields = aiModelSchema.safeParse({
    name: formData.get("name"),
    apiKey: formData.get("apiKey"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid fields. Failed to update AI model.",
    };
  }

  const { name, apiKey } = validatedFields.data;

  try {
    // Delete any existing models first
    await prisma.aiModel.deleteMany();

    // Create new model
    await prisma.aiModel.create({
      data: {
        name,
        apiKey,
      },
    });

    revalidatePath("/dashboard/settings");
    return { message: "AI Model updated successfully" };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to update AI model.",
    };
  }
}

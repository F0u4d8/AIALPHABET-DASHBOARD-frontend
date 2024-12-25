"use server";

import prisma from "../db";
import { categorySchema, contentSchema } from "../zodSchemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const ITEMS_PER_PAGE = process.env.ITEMS_PER_PAGE;

export async function fetchContentsPages(query: string | null) {
  try {
    const count = await prisma.content.count({
      where: query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { pitch: { contains: query, mode: "insensitive" } },
              { category: { name: { contains: query, mode: "insensitive" } } },
            ],
          }
        : {},
    });

    const totalPages = Math.ceil(count / Number(ITEMS_PER_PAGE));
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of categories.");
  }
}

export async function fetchFilteredContents(
  query: string | null,
  currentPage: number
) {
  try {
    const offset = (currentPage - 1) * Number(ITEMS_PER_PAGE);

    const data = await prisma.content.findMany({
      select: {
        id: true,
        title: true,
        pitch: true,
        category: {
          select: {
            name: true,
          },
        },
        image: true,
        url: true,
      },
      where: query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { pitch: { contains: query, mode: "insensitive" } },
              { category: { name: { contains: query, mode: "insensitive" } } },
            ],
          }
        : {},
      orderBy: {
        title: "desc",
      },
      take: Number(ITEMS_PER_PAGE), // This limits the number of results
      skip: offset, // This implements the offset
    });

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch categories.");
  }
}

export async function createContent(prevState: any, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = contentSchema.safeParse({
    title: formData.get("title"),
    pitch: formData.get("pitch"),
    categoryId: formData.get("categoryId"),
    url: formData.get("url"),
    image: formData.get("image"),

  });

  // If form validation fails, return errors early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Content.",
    };
  }

  // Prepare data for insertion
  const { title , categoryId ,image ,pitch ,url } = validatedFields.data;

  try {
    await prisma.content.create({
      data: {
        title,
        pitch,image ,url ,categoryId
      },
    });
  } catch (error) {
    // Type assertion for better error handling
    const prismaError = error as {
      code?: string;
      meta?: { target?: string[] };
    };

    // Handle specific database errors
    if (prismaError.code === "P2002") {
      // Unique constraint violation
      const field = prismaError.meta?.target?.[0] || "field";
      return {
        message: `A content with this ${field} already exists.`,
        errors: {
          [field]: [`This ${field} is already taken.`],
        },
      };
    }

    if (prismaError.code === "P2003") {
      // Foreign key constraint violation
      return {
        message: "Referenced record does not exist.",
      };
    }

    if (prismaError.code === "P2025") {
      // Record not found
      return {
        message: "Record not found.",
      };
    }

    // Log the full error for debugging
    console.error("Database Error:", error);

    // Return a generic error message for unhandled cases
    return {
      message: "An unexpected error occurred while creating content.",
    };
  }

  // Success case
  revalidatePath("/dashboard/contents");
  redirect("/dashboard/contents");
}

export async function updateCategory(
  id: string,
  prevState: any,
  formData: FormData
) {
  // Validate form fields using Zod
  const validatedFields = categorySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  // If form validation fails, return errors early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Category.",
    };
  }

  // Prepare data for insertion
  const { name, description } = validatedFields.data;

  try {
    await prisma.category.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
    });
  } catch (error) {
    // Type assertion for better error handling
    const prismaError = error as {
      code?: string;
      meta?: { target?: string[] };
    };

    // Handle specific database errors
    if (prismaError.code === "P2002") {
      // Unique constraint violation
      const field = prismaError.meta?.target?.[0] || "field";
      return {
        message: `A category with this ${field} already exists.`,
        errors: {
          [field]: [`This ${field} is already taken.`],
        },
      };
    }

    if (prismaError.code === "P2003") {
      // Foreign key constraint violation
      return {
        message: "Referenced record does not exist.",
      };
    }

    if (prismaError.code === "P2025") {
      // Record not found
      return {
        message: "Record not found.",
      };
    }

    // Log the full error for debugging
    console.error("Database Error:", error);

    // Return a generic error message for unhandled cases
    return {
      message: "An unexpected error occurred while updating the category.",
    };
  }

  // Success case
  revalidatePath("/dashboard/categories");
  redirect("/dashboard/categories");
}

export async function deleteContent(id: string) {
  try {
    await prisma.content.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete content.");
  }

  // Success case
  revalidatePath("/dashboard/contents");
  redirect("/dashboard/contents");
}

export async function fetchCategoryById(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    throw new Error("Failed to fetch category");
  }
}

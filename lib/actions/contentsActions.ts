"use server";

import prisma from "../db";
import { contentSchema } from "../zodSchemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const ITEMS_PER_PAGE = process.env.ITEMS_PER_PAGE;
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

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
        appStoreUrl: true,
        playStoreUrl: true,
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
    appStoreUrl: formData.get("appStoreUrl"),
    playStoreUrl: formData.get("playStoreUrl"),
    image: formData.get("image"),
  });

  // If form validation fails, return errors early
  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Content.",
    };
  }

  // Prepare data for insertion
  const { title, categoryId, image, pitch, appStoreUrl, playStoreUrl } = validatedFields.data;

  // Ensure the upload directory exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  // Save the image locally
  const imageFile = image as File;
  const imageFileName = `${uuidv4()}-${imageFile.name}`;
  const imagePath = path.join(UPLOAD_DIR, imageFileName);
  const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
  fs.writeFileSync(imagePath, imageBuffer);

  const imageUrl = `/uploads/${imageFileName}`;

  try {
    await prisma.content.create({
      data: {
        title,
        pitch,
        image: imageUrl,
       appStoreUrl , playStoreUrl ,
        categoryId,
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

export async function fetchContentById(id: string) {
  try {
    const category = await prisma.content.findUnique({
      where: { id },
    });

    if (!category) {
      throw new Error("Content not found");
    }

    return category;
  } catch (error) {
    console.error("Error fetching content by ID:", error);
    throw new Error("Failed to fetch content");
  }
}

export async function updateContent(id: string, prevState: any, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = contentSchema.safeParse({
    title: formData.get("title"),
    pitch: formData.get("pitch"),
    categoryId: formData.get("categoryId"),
appStoreUrl: formData.get("appStoreUrl"),
playStoreUrl: formData.get("playStoreUrl"),
    image: formData.get("image"),
  });

  // If form validation fails, return errors early
  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Content.",
    };
  }

  // Prepare data for update
  const { title, categoryId, image, pitch, appStoreUrl, playStoreUrl } = validatedFields.data;

  // Fetch the existing content to get the current image URL
  const existingContent = await prisma.content.findUnique({
    where: { id },
  });

  if (!existingContent) {
    return {
      message: "Content not found.",
    };
  }

  let imageUrl = existingContent.image;
console.log(imageUrl , image);

  // If a new image is provided, delete the old one and save the new one
  if (image) {
    // Ensure the upload directory exists
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    // Delete the old image
    const oldImagePath = path.join(process.cwd(), "public", existingContent.image);
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }

    // Save the new image locally
    const imageFile = image as File;
    const imageFileName = `${uuidv4()}-${imageFile.name}`;
    const imagePath = path.join(UPLOAD_DIR, imageFileName);
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    fs.writeFileSync(imagePath, imageBuffer);

    imageUrl = `/uploads/${imageFileName}`;
  }

  try {
    await prisma.content.update({
      where: { id },
      data: {
        title,
        pitch,
        image: imageUrl,
        appStoreUrl , playStoreUrl ,
        categoryId,
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
      message: "An unexpected error occurred while updating content.",
    };
  }

  // Success case
  revalidatePath("/dashboard/contents");
  redirect("/dashboard/contents");
}

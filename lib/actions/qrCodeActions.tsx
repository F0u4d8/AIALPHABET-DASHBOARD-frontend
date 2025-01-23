"use server";

import prisma from "../db";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { qrCodeSchema } from "../zodSchemas";


const ITEMS_PER_PAGE = process.env.ITEMS_PER_PAGE;


export async function fetchQRCodesPages(query: string | null) {
  try {
    const count = await prisma.qRCode.count({where : query ? {book : {title : {contains : query }}} : {}});

    const totalPages = Math.ceil(count / Number(ITEMS_PER_PAGE));
    
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of QR codes.");
  }
}

export async function fetchQRCodes(params: string | null ,
  currentPage: number
) {
  try {
    const offset = (currentPage - 1) * Number(ITEMS_PER_PAGE);

    const data = await prisma.qRCode.findMany({
      select: {
        id: true,
        code: true,
        createdAt: true,
        copied: true,
        book: {
          select: {
            title: true,
          },
        },

      },
      where : params ? {book : {title : {contains : params }}} : {},
      orderBy: {
        createdAt: "desc",
      },
      take: Number(ITEMS_PER_PAGE), // This limits the number of results
      skip: offset, // This implements the offset
    });

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch codes.");
  }
}



// Create a new QR code with a random code
export async function createQRCode(prevState: any, formData: FormData) {
  const code = uuidv4(); // Generate a random code

  const validatedFields = qrCodeSchema.safeParse({
    bookId: formData.get("bookId"),
 
  });

    // If form validation fails, return errors early
    if (!validatedFields.success) {
      console.log(validatedFields.error.flatten().fieldErrors);
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Missing Fields. Failed to Create Code.",
      };
    }
  
    const { bookId } = validatedFields.data;
  try {
    await prisma.qRCode.create({
      data: {
        code,
        bookId:bookId
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
      return {
        message: "A QR code with this code already exists.",
        errors: {
          code: ["This code is already taken."],
        },
      };
    }

    // Log the full error for debugging
    console.error("Database Error:", error);

    // Return a generic error message for unhandled cases
    return {
      message: "An unexpected error occurred while creating QR code.",
    };
  }

  // Success case
  revalidatePath("/dashboard/codes");
}

// Mark QR codes as copied
export async function markQRCodesAsCopied(ids: string[]) {
  try {
    await prisma.qRCode.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        copied: true,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to mark QR codes as copied.");
  }

  // Success case
  revalidatePath("/dashboard/codes");
}

// Delete a QR code
export async function deleteQRCode(id: string) {
  try {
    await prisma.qRCode.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete QR code.");
  }

  // Success case
  revalidatePath("/dashboard/codes");
}


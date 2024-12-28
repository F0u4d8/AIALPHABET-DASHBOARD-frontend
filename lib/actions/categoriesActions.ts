"use server";

import prisma from "../db";
import { categorySchema } from "../zodSchemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";





const ITEMS_PER_PAGE = process.env.ITEMS_PER_PAGE;


export async function fetchCategories() {
  try {
    const data = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'desc'
      }
    });

    return data
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch categories.')
  }
}


export async function fetchCategoriesPages(query: string | null) {
  try {
    const count = await prisma.category.count({
      where: query ? {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      } : {}
    });
     
    const totalPages = Math.ceil(count /Number(ITEMS_PER_PAGE) )
    return totalPages
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch total number of categories.')
  }
}

export async function fetchFilteredCategories(
  query: string | null,
  currentPage: number
) {
  try {
    const offset = (currentPage - 1) * Number(ITEMS_PER_PAGE)

const data = await prisma.category.findMany({
  select: {
    id: true,
    _count: true,
    description: true,
    name: true
  },
  where: query ? {
    OR: [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } }
    ]
  } : {},
  orderBy: {
    name: 'desc'
  },
  take: Number(ITEMS_PER_PAGE) ,  // This limits the number of results
  skip: offset          // This implements the offset
});

    return data
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch categories.')
  }
}





export async function createCategory(prevState: any, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = categorySchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  // If form validation fails, return errors early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Category.',
    }
  }

  // Prepare data for insertion
  const { name, description } = validatedFields.data

  try {
    await prisma.category.create({
      data: {
        name,
        description
      }
    });
  } catch (error) {
    // Type assertion for better error handling
    const prismaError = error as { code?: string, meta?: { target?: string[] } };
    
    // Handle specific database errors
    if (prismaError.code === 'P2002') {
      // Unique constraint violation
      const field = prismaError.meta?.target?.[0] || 'field';
      return {
        message: `A category with this ${field} already exists.`,
        errors: {
          [field]: [`This ${field} is already taken.`]
        }
      };
    }

    if (prismaError.code === 'P2003') {
      // Foreign key constraint violation
      return {
        message: 'Referenced record does not exist.',
      };
    }

    if (prismaError.code === 'P2025') {
      // Record not found
      return {
        message: 'Record not found.',
      };
    }

    // Log the full error for debugging
    console.error('Database Error:', error);
    
    // Return a generic error message for unhandled cases
    return {
      message: 'An unexpected error occurred while creating the category.',
    };
  }

  // Success case
  revalidatePath('/dashboard/categories');
  redirect('/dashboard/categories');
}


export async function updateCategory( id: string ,prevState: any, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = categorySchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  // If form validation fails, return errors early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Category.',
    }
  }

  // Prepare data for insertion
  const { name, description } = validatedFields.data

  try {
    await prisma.category.update({
      where: {
        id
      },
      data: {
        name,
        description
      }
    });
  } catch (error) {
    // Type assertion for better error handling
    const prismaError = error as { code?: string, meta?: { target?: string[] } };
    
    // Handle specific database errors
    if (prismaError.code === 'P2002') {
      // Unique constraint violation
      const field = prismaError.meta?.target?.[0] || 'field';
      return {
        message: `A category with this ${field} already exists.`,
        errors: {
          [field]: [`This ${field} is already taken.`]
        }
      };
    }

    if (prismaError.code === 'P2003') {
      // Foreign key constraint violation
      return {
        message: 'Referenced record does not exist.',
      };
    }

    if (prismaError.code === 'P2025') {
      // Record not found
      return {
        message: 'Record not found.',
      };
    }

    // Log the full error for debugging
    console.error('Database Error:', error);
    
    // Return a generic error message for unhandled cases
    return {
      message: 'An unexpected error occurred while updating the category.',
    };
  }

  // Success case
  revalidatePath('/dashboard/categories');
  redirect('/dashboard/categories');
}


export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: {
        id
      }
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete category.');
  }

  // Success case
  revalidatePath('/dashboard/categories');
  redirect('/dashboard/categories');
}




export async function fetchCategoryById(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      throw new Error('Category not found');
    }


    
    return category;
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    throw new Error('Failed to fetch category');
  }

  

}
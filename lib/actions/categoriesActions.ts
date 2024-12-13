"use server";

import { auth } from "@/auth";
import toast from "react-hot-toast";

const session = await auth();

const ITEMS_PER_PAGE = process.env.ITEMS_PER_PAGE;

export async function fetchCategoriesPages(query: string) {
  try {

    const response = await fetch(
      `${process.env.API_SERVER_BASE_URL}/api/countCategories/query=${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session!.sessionToken}`,
        },
      }
    );
    const categoriesPages: { count: string } = await response.json();

    const totalPages = Math.ceil(
      Number(categoriesPages.count) / Number(ITEMS_PER_PAGE)
    );
    return totalPages;
  } catch (error: any) {
    toast.error(error);
  }
}



export async function fetchCategoriesPages(query: string) {
  try {

    const response = await fetch(
      `${process.env.API_SERVER_BASE_URL}/api/countCategories/query=${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session!.sessionToken}`,
        }, next: { tags: ['categories'] }
      }
    );
    const categoriesPages: { count: string } = await response.json();

    const totalPages = Math.ceil(
      Number(categoriesPages.count) / Number(ITEMS_PER_PAGE)
    );
    return totalPages;
  } catch (error: any) {
    toast.error(error);
  }
}

"use server";

import prisma from "../db";

export async function fetchStatistics() {
  try {
    const [usersCount, categoriesCount, contentsCount, codesCount] = await Promise.all([
      prisma.user.count(),
      prisma.category.count(),
      prisma.content.count(),
      prisma.qRCode.count(),
    ]);

    return {
      usersCount,
      categoriesCount,
      contentsCount,
      codesCount,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch statistics.");
  }
}

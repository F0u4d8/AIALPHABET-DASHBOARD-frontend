/*
  Warnings:

  - The `permission` column on the `Book` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `permission` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Permissions" AS ENUM ('CHATBOT', 'TODOTASK', 'FUTUREDAY', 'AITOOLS', 'FOCUS', 'ALL');

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "permission",
ADD COLUMN     "permission" "Permissions"[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "permission",
ADD COLUMN     "permission" "Permissions"[];

-- DropEnum
DROP TYPE "Permission";

/*
  Warnings:

  - You are about to drop the column `url` on the `Content` table. All the data in the column will be lost.
  - Added the required column `appStoreUrl` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playStoreUrl` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Content" DROP COLUMN "url",
ADD COLUMN     "appStoreUrl" TEXT NOT NULL,
ADD COLUMN     "playStoreUrl" TEXT NOT NULL;

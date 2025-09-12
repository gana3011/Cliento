/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Buyer" DROP CONSTRAINT "Buyer_ownerId_fkey";

-- DropTable
DROP TABLE "public"."User";

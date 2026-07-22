/*
  Warnings:

  - You are about to drop the column `isBooked` on the `Slot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Slot" DROP COLUMN "isBooked";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'UTC';

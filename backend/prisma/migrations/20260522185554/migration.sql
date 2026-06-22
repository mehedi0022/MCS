/*
  Warnings:

  - You are about to drop the column `sortOrder` on the `ourstorycard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ourstorycard` DROP COLUMN `sortOrder`,
    ADD COLUMN `imagePublicId` VARCHAR(191) NULL,
    MODIFY `id` VARCHAR(191) NOT NULL DEFAULT 'main';

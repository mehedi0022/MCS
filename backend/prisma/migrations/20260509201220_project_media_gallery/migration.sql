-- AlterTable
ALTER TABLE `project` ADD COLUMN `category` VARCHAR(191) NOT NULL DEFAULT 'General',
    ADD COLUMN `gallery` JSON NULL,
    ADD COLUMN `imagePublicId` VARCHAR(191) NULL;

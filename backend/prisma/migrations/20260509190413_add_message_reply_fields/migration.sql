-- AlterTable
ALTER TABLE `contactmessage` ADD COLUMN `repliedAt` DATETIME(3) NULL,
    ADD COLUMN `repliedBy` VARCHAR(191) NULL,
    ADD COLUMN `replyMessage` TEXT NULL;

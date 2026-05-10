-- CreateTable
CREATE TABLE `SiteSettings` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'main',
    `logoUrl` VARCHAR(191) NULL,
    `logoPublicId` VARCHAR(191) NULL,
    `faviconUrl` VARCHAR(191) NULL,
    `faviconPublicId` VARCHAR(191) NULL,
    `officeAddressLine1` VARCHAR(191) NULL,
    `officeAddressLine2` VARCHAR(191) NULL,
    `mapLocation` VARCHAR(191) NULL,
    `mapLocationText` VARCHAR(191) NULL,
    `contactEmails` JSON NULL,
    `contactPhones` JSON NULL,
    `branches` JSON NULL,
    `socialLinks` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

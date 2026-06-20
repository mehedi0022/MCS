-- AlterTable
ALTER TABLE `SiteSettings`
    ADD COLUMN `navbarBrandText` VARCHAR(191) NULL,
    ADD COLUMN `navbarBrandAccent` VARCHAR(191) NULL,
    ADD COLUMN `navbarBrandSubtext` VARCHAR(191) NULL;

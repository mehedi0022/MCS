CREATE TABLE `TrainingPage` (
  `id` VARCHAR(191) NOT NULL DEFAULT 'main',
  `heroBadge` VARCHAR(191) NOT NULL DEFAULT 'Training & Capacity Development',
  `heroTitleLine1` TEXT NOT NULL,
  `heroTitleHighlight` TEXT NOT NULL,
  `heroDescription` TEXT NOT NULL,
  `snapshotEyebrow` VARCHAR(191) NOT NULL DEFAULT 'Program Snapshot',
  `learningPathTitle` VARCHAR(191) NOT NULL DEFAULT 'Learning Path',
  `outcomesTitle` VARCHAR(191) NOT NULL DEFAULT 'Expected Outcomes',
  `ctaTitle` TEXT NOT NULL,
  `ctaDescription` TEXT NOT NULL,
  `primaryButtonText` VARCHAR(191) NOT NULL DEFAULT 'Request Training Plan',
  `primaryButtonLink` VARCHAR(191) NOT NULL DEFAULT '/contact',
  `secondaryButtonText` VARCHAR(191) NOT NULL DEFAULT 'View FAQ',
  `secondaryButtonLink` VARCHAR(191) NOT NULL DEFAULT '/faq',
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `TrainingItem` (
  `id` VARCHAR(191) NOT NULL,
  `section` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `iconKey` VARCHAR(191) NULL,
  `value` VARCHAR(191) NULL,
  `sortOrder` INTEGER NOT NULL DEFAULT 0,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX `TrainingItem_section_sortOrder_idx` ON `TrainingItem`(`section`, `sortOrder`);

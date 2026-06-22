-- CreateTable
CREATE TABLE `DeliveryApproachSection` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'main',
    `eyebrow` VARCHAR(191) NOT NULL DEFAULT 'Our Delivery Approach',
    `title` VARCHAR(191) NOT NULL DEFAULT 'Accurate. Actionable. Sustainable.',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeliveryApproachStep` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `iconKey` VARCHAR(191) NOT NULL DEFAULT 'Search',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seed default section content for existing deployments.
INSERT INTO `DeliveryApproachSection` (`id`, `eyebrow`, `title`, `isActive`, `createdAt`, `updatedAt`)
VALUES ('main', 'Our Delivery Approach', 'Accurate. Actionable. Sustainable.', true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));

INSERT INTO `DeliveryApproachStep` (`id`, `title`, `description`, `iconKey`, `sortOrder`, `isActive`, `createdAt`, `updatedAt`)
VALUES
  (UUID(), 'Field Data Collection', 'High-quality survey and monitoring data collection from riverine, coastal, and marine environments.', 'Search', 1, true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
  (UUID(), 'Technical Analysis', 'Integrated GIS, modelling, and environmental analysis to produce reliable technical insights.', 'PenTool', 2, true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
  (UUID(), 'Practical Solutions', 'Actionable recommendations aligned with project realities, timelines, and operational needs.', 'Activity', 3, true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
  (UUID(), 'Sustainable Delivery', 'Implementation support focused on long-term environmental and operational performance.', 'ShieldCheck', 4, true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));

CREATE TABLE `ClientSector` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `body` TEXT NOT NULL,
    `points` JSON NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `ClientSector` (`id`, `title`, `body`, `points`, `sortOrder`, `isPublished`, `createdAt`, `updatedAt`) VALUES
(UUID(), 'Government & Public Sector', 'We support government agencies responsible for waterways, ports, coastal management, and infrastructure development.', JSON_ARRAY('Hydrographic and survey data for navigation and dredging', 'Feasibility studies and project planning', 'Environmental and morphological assessments', 'Capacity development and technical training'), 0, true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
(UUID(), 'Ports & Maritime Sector', 'Specialized technical support for ports, terminals, shipyards, and marine operators.', JSON_ARRAY('Channel surveys and navigability assessment', 'Dredging monitoring and volume verification', 'Coastal and port infrastructure support', 'Hydrographic data for safe vessel operations'), 10, true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
(UUID(), 'Water Resources & Infrastructure', 'Support for projects involving rivers, flood management, and coastal protection.', JSON_ARRAY('Hydrodynamic modelling and analysis', 'Topographic and geospatial surveys', 'River morphology and sediment studies', 'Flood risk and hazard assessment'), 20, true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
(UUID(), 'Development Partners & Donor Projects', 'Collaboration with international agencies and consultancy teams on development initiatives.', JSON_ARRAY('Technical surveys and data collection', 'Environmental and social assessments', 'Capacity building and training', 'Monitoring and evaluation support'), 30, true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
(UUID(), 'Environmental & Research Sector', 'Support for environmental sustainability and scientific research initiatives.', JSON_ARRAY('Environmental baseline studies', 'Biodiversity and habitat mapping', 'Oceanographic and climate data analysis', 'GIS-based research support'), 40, true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));

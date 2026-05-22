-- AlterTable
ALTER TABLE `ourstorycard` ADD COLUMN `headingLine1` TEXT NOT NULL DEFAULT 'Built by the sea,',
    ADD COLUMN `headingLine2` TEXT NOT NULL DEFAULT 'for the sea.',
    ADD COLUMN `sinceLabel` VARCHAR(191) NOT NULL DEFAULT 'Since 2014',
    ADD COLUMN `storyHtml` TEXT NOT NULL DEFAULT '<p>Maritime Solutions was founded by a small group of naval architects and former captains who shared a singular realization: the industry was changing faster than the engineering firms could adapt.</p><p>We started in a small office near the Port of Singapore with nothing but a set of blueprints and a commitment to radical transparency. We didn''t want to be another generic corporate consultancy; we wanted to be technical partners who understood the vibration of the engine and the weight of the cargo.</p><p>Today, we have grown into a global presence, yet our purpose remains unchanged: providing the engineering backbone for those who navigate the world''s most vital waterways.</p>';

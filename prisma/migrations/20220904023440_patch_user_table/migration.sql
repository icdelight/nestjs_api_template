-- AlterTable
ALTER TABLE `goals` MODIFY `type_goals` VARCHAR(250) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `id_area` INTEGER NULL,
    ADD COLUMN `id_sub_area` INTEGER NULL;

-- CreateTable
CREATE TABLE `mst_area` (
    `id_area` INTEGER NULL,
    `id_sub_area` INTEGER NOT NULL,
    `desc_area` VARCHAR(255) NULL,
    `desc_sub_area` VARCHAR(255) NULL,
    `id_parent_area` VARCHAR(255) NULL,
    `active` INTEGER NULL,

    PRIMARY KEY (`id_sub_area`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

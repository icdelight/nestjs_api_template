/*
  Warnings:

  - You are about to alter the column `type_goals` on the `goals` table. The data in that column could be lost. The data in that column will be cast from `VarChar(250)` to `Json`.
  - You are about to alter the column `indikator` on the `goals` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `Json`.

*/
-- AlterTable
ALTER TABLE `goals` ADD COLUMN `id_area` INTEGER NULL,
    ADD COLUMN `id_cluster` INTEGER NULL,
    ADD COLUMN `kodefikasi` VARCHAR(255) NULL,
    ADD COLUMN `parent_family` INTEGER NULL,
    MODIFY `type_goals` JSON NULL,
    MODIFY `indikator` JSON NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `cluster` (
    `id_cluster` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_cluster` VARCHAR(255) NULL,
    `id_area` INTEGER NULL,
    `flag_active` INTEGER NULL,
    `createdAt` DATETIME(0) NULL,
    `modifiedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `id_sub_areas` LONGTEXT NULL,

    PRIMARY KEY (`id_cluster`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

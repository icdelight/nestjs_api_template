/*
  Warnings:

  - The primary key for the `roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `roles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `roles` DROP PRIMARY KEY,
    DROP COLUMN `userId`,
    MODIFY `id_role` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `goals` (
    `id_goals` INTEGER NOT NULL AUTO_INCREMENT,
    `title_goals` VARCHAR(150) NULL,
    `desc_goals` VARCHAR(500) NULL,
    `pic_goals` VARCHAR(150) NULL,
    `start_date` DATETIME(0) NULL,
    `due_date` DATETIME(0) NULL,
    `status_goals` INTEGER NULL,
    `progress` INTEGER NULL,
    `parent_goals` INTEGER NULL,
    `type_goals` VARCHAR(25) NULL,
    `last_modified_date` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id_goals`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

/*
  Warnings:

  - Made the column `id_area` on table `mst_area` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `mst_area` MODIFY `id_area` INTEGER NOT NULL,
    MODIFY `id_sub_area` INTEGER NOT NULL AUTO_INCREMENT;

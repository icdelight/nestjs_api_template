/*
  Warnings:

  - You are about to alter the column `id_parent_area` on the `mst_area` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Int`.

*/
-- AlterTable
ALTER TABLE `mst_area` MODIFY `id_parent_area` INTEGER NULL;

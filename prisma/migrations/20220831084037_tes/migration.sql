-- AlterTable
ALTER TABLE `goals` ADD COLUMN `indikator` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `roles` ADD PRIMARY KEY (`id_role`, `id_menu`);

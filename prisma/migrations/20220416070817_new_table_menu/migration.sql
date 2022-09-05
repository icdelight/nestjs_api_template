-- CreateTable
CREATE TABLE `menu` (
    `id_menu` INTEGER NOT NULL AUTO_INCREMENT,
    `menu_name` VARCHAR(50) NULL,
    `menu_link` VARCHAR(255) NULL,

    PRIMARY KEY (`id_menu`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

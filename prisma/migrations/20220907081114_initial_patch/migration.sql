-- CreateTable
CREATE TABLE IF NOT EXISTS  `users` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NULL,
    `pass` VARCHAR(500) NULL,
    `flag_active` BOOLEAN NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `apps` VARCHAR(20) NULL,
    `role` VARCHAR(3) NULL,
    `id_area` INTEGER NULL,
    `id_sub_area` INTEGER NULL,

    INDEX `apps_idx`(`apps`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS  `roles` (
    `id_role` INTEGER NOT NULL,
    `role_name` VARCHAR(50) NULL,
    `id_menu` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id_role`, `id_menu`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS  `menu` (
    `id_menu` INTEGER NOT NULL AUTO_INCREMENT,
    `menu_name` VARCHAR(50) NULL,
    `menu_link` VARCHAR(255) NULL,
    `role` VARCHAR(3) NULL,

    PRIMARY KEY (`id_menu`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE  IF NOT EXISTS `goals` (
    `id_goals` INTEGER NOT NULL AUTO_INCREMENT,
    `title_goals` VARCHAR(150) NULL,
    `desc_goals` VARCHAR(500) NULL,
    `pic_goals` VARCHAR(150) NULL,
    `start_date` DATETIME(0) NULL,
    `due_date` DATETIME(0) NULL,
    `status_goals` INTEGER NULL,
    `progress` INTEGER NULL,
    `parent_goals` INTEGER NULL,
    `type_goals` VARCHAR(250) NULL,
    `last_modified_date` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `indikator` VARCHAR(500) NULL,

    PRIMARY KEY (`id_goals`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS  `mst_area` (
    `id_area` INTEGER NULL,
    `id_sub_area` INTEGER NOT NULL,
    `desc_area` VARCHAR(255) NULL,
    `desc_sub_area` VARCHAR(255) NULL,
    `id_parent_area` INTEGER NULL,
    `active` INTEGER NULL,

    PRIMARY KEY (`id_sub_area`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

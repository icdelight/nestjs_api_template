-- CreateTable
CREATE TABLE IF NOT EXISTS `users` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NULL,
    `pass` VARCHAR(500) NULL,
    `flag_active` BOOLEAN NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,

    UNIQUE INDEX `users_name_key`(`name`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `roles` (
    `id_role` INTEGER NOT NULL AUTO_INCREMENT,
    `role_name` VARCHAR(50) NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id_role`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `roles` ADD CONSTRAINT `roles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

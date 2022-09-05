-- DropForeignKey
ALTER TABLE `roles` DROP FOREIGN KEY `roles_userId_fkey`;

-- DropIndex
DROP INDEX `users_name_key` ON `users`;

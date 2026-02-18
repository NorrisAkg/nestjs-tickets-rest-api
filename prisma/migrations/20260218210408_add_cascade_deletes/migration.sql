-- DropForeignKey
ALTER TABLE `refresh_tokens` DROP FOREIGN KEY `refresh_tokens_userId_fkey`;

-- DropForeignKey
ALTER TABLE `tickets` DROP FOREIGN KEY `tickets_authorId_fkey`;

-- DropIndex
DROP INDEX `refresh_tokens_userId_fkey` ON `refresh_tokens`;

-- DropIndex
DROP INDEX `tickets_authorId_fkey` ON `tickets`;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

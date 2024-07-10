-- AlterTable
ALTER TABLE `users` ADD COLUMN `isBlocked` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `verificationCode` VARCHAR(191) NULL;

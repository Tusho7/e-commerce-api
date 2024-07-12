-- AlterTable
ALTER TABLE `products` ADD COLUMN `isOnSale` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `salePercentage` INTEGER NULL DEFAULT 0;

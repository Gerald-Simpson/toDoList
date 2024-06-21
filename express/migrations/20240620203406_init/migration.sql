/*
  Warnings:

  - Added the required column `titleId` to the `listItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `listItems` ADD COLUMN `complete` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `titleId` INTEGER NOT NULL;

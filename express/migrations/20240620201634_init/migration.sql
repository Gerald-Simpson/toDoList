/*
  Warnings:

  - Added the required column `id` to the `toDoList` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `toDoList_cookieId_key` ON `toDoList`;

-- AlterTable
ALTER TABLE `toDoList` ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

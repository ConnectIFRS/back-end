/*
  Warnings:

  - You are about to drop the column `usersId` on the `Preferences` table. All the data in the column will be lost.
  - Made the column `content` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "_PreferencesToUsers" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PreferencesToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Preferences" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PreferencesToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("content", "id", "userId") SELECT "content", "id", "userId" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE TABLE "new_Preferences" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL
);
INSERT INTO "new_Preferences" ("icon", "id", "title") SELECT "icon", "id", "title" FROM "Preferences";
DROP TABLE "Preferences";
ALTER TABLE "new_Preferences" RENAME TO "Preferences";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_PreferencesToUsers_AB_unique" ON "_PreferencesToUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_PreferencesToUsers_B_index" ON "_PreferencesToUsers"("B");

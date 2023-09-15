-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "classId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Users_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Classes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Classes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "class" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_login_key" ON "Users"("login");

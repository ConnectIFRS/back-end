-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "classId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profilePic" TEXT NOT NULL,
    CONSTRAINT "Users_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Classes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Classes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "className" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Likes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    CONSTRAINT "Likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Followers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "followerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Followers_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Followers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Preferences" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "usersId" TEXT NOT NULL,
    CONSTRAINT "Preferences_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_login_key" ON "Users"("login");

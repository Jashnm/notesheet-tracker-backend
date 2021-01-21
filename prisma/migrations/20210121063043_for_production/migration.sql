-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Lecturer', 'HOD', 'DEAN', 'REGISTRAR', 'PRESIDENT');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('LIVE', 'COMPLETED');

-- CreateTable
CREATE TABLE "users" (
"id" SERIAL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT E'Lecturer',
    "deptId" INTEGER,
    "schoolId" INTEGER,
    "isAdmin" BOOLEAN DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
"id" SERIAL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "schoolId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school" (
"id" SERIAL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notesheets" (
"id" SERIAL,
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL,
    "financial" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AllUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users.uuid_unique" ON "users"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "users.email_unique" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_schoolId_unique" ON "users"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "departments.uuid_unique" ON "departments"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "school.uuid_unique" ON "school"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "notesheets.uuid_unique" ON "notesheets"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "_AllUsers_AB_unique" ON "_AllUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_AllUsers_B_index" ON "_AllUsers"("B");

-- AddForeignKey
ALTER TABLE "users" ADD FOREIGN KEY("deptId")REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD FOREIGN KEY("schoolId")REFERENCES "school"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD FOREIGN KEY("schoolId")REFERENCES "school"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notesheets" ADD FOREIGN KEY("userId")REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AllUsers" ADD FOREIGN KEY("A")REFERENCES "notesheets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AllUsers" ADD FOREIGN KEY("B")REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

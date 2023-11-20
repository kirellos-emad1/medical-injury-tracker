-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InjuryList" (
    "id" TEXT NOT NULL,
    "reporter" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "InjuryList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Injury" (
    "id" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "injuryListId" TEXT NOT NULL,

    CONSTRAINT "Injury_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "InjuryList" ADD CONSTRAINT "InjuryList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Injury" ADD CONSTRAINT "Injury_injuryListId_fkey" FOREIGN KEY ("injuryListId") REFERENCES "InjuryList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

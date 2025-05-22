-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kana" (
    "id" TEXT NOT NULL,
    "character" TEXT NOT NULL,
    "romaji" TEXT NOT NULL,

    CONSTRAINT "Kana_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAccuracy" (
    "id" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "kana_id" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "correct_attempts" INTEGER NOT NULL DEFAULT 0,
    "accuracy" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "UserAccuracy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Kana_character_key" ON "Kana"("character");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccuracy_user_email_kana_id_key" ON "UserAccuracy"("user_email", "kana_id");

-- AddForeignKey
ALTER TABLE "UserAccuracy" ADD CONSTRAINT "UserAccuracy_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAccuracy" ADD CONSTRAINT "UserAccuracy_kana_id_fkey" FOREIGN KEY ("kana_id") REFERENCES "Kana"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


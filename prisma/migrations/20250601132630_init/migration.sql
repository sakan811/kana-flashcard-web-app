-- CreateTable
CREATE TABLE "Kana" (
    "id" TEXT NOT NULL,
    "character" TEXT NOT NULL,
    "romaji" TEXT NOT NULL,

    CONSTRAINT "Kana_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KanaProgress" (
    "id" TEXT NOT NULL,
    "kana_id" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "correct_attempts" INTEGER NOT NULL DEFAULT 0,
    "accuracy" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "KanaProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Kana_character_key" ON "Kana"("character");

-- CreateIndex
CREATE UNIQUE INDEX "KanaProgress_kana_id_key" ON "KanaProgress"("kana_id");

-- AddForeignKey
ALTER TABLE "KanaProgress" ADD CONSTRAINT "KanaProgress_kana_id_fkey" FOREIGN KEY ("kana_id") REFERENCES "Kana"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

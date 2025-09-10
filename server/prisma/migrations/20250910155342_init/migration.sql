-- CreateTable
CREATE TABLE "entries" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "workoutType" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "notes" TEXT,

    CONSTRAINT "entries_pkey" PRIMARY KEY ("id")
);

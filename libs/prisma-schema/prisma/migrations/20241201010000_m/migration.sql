ALTER TABLE "Balance" RENAME TO "BalanceHistory";

CREATE TABLE "Balance" (
    "id" UUID NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("id")
);
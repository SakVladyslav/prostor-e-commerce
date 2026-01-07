-- CreateTable
CREATE TABLE "Cart" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "items" JSONB NOT NULL,
    "itemsPrice" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalPrice" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "shippingPrice" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "taxPrice" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "sessionCardId" UUID NOT NULL,
    "userId" UUID,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

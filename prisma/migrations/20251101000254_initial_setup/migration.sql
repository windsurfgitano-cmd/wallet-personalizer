/*
  Warnings:

  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Session";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Shop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopifyDomain" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CustomizationSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopId" TEXT NOT NULL,
    "basePriceInitials" REAL NOT NULL DEFAULT 8.00,
    "basePricePhrase" REAL NOT NULL DEFAULT 12.00,
    "maxCharsInitials" INTEGER NOT NULL DEFAULT 3,
    "maxCharsPhrase" INTEGER NOT NULL DEFAULT 20,
    "enableInitials" BOOLEAN NOT NULL DEFAULT true,
    "enablePhrase" BOOLEAN NOT NULL DEFAULT true,
    "enablePreview" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CustomizationSetting_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductCustomization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopId" TEXT NOT NULL,
    "productHandle" TEXT NOT NULL,
    "enabledTypes" TEXT NOT NULL DEFAULT 'iniciales,frase',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProductCustomization_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Shop_id_key" ON "Shop"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_shopifyDomain_key" ON "Shop"("shopifyDomain");

-- CreateIndex
CREATE UNIQUE INDEX "CustomizationSetting_shopId_key" ON "CustomizationSetting"("shopId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCustomization_shopId_productHandle_key" ON "ProductCustomization"("shopId", "productHandle");

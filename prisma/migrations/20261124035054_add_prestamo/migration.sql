-- CreateEnum
CREATE TYPE "EstadoPrestamo" AS ENUM ('ACTIVO', 'DEVUELTO');

-- CreateTable
CREATE TABLE "Prestamo" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "libroId" TEXT,
    "fechaPrestamo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaVencimiento" TIMESTAMP(3) NOT NULL,
    "fechaDevolucion" TIMESTAMP(3),
    "estado" "EstadoPrestamo" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "Prestamo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Prestamo_libroId_idx" ON "Prestamo"("libroId");

-- CreateIndex
CREATE INDEX "Prestamo_userId_idx" ON "Prestamo"("userId");

-- AddForeignKey
ALTER TABLE "Prestamo" ADD CONSTRAINT "Prestamo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- Un libro no puede tener dos préstamos activos a la vez.
CREATE UNIQUE INDEX "Prestamo_libroId_activo_key"
  ON "Prestamo" ("libroId")
  WHERE "fechaDevolucion" IS NULL;
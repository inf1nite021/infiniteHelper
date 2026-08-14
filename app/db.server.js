import { PrismaClient } from "@prisma/client";

if (process.env.NODE_ENV !== "production") {
  if (!global.prismaGlobal) {
    global.prismaGlobal = new PrismaClient();
  }
}

const prisma = global.prismaGlobal ?? new PrismaClient();

export default prisma;
/**
 * Setzt den Mandanten-Kontext (app.shop) fuer Row-Level-Security und fuehrt die
 * Abfragen in derselben Transaktion aus - nur so gilt set_config(..., true).
 *
 * Zur Laufzeit verbindet die App mit einer eingeschraenkten Rolle ohne
 * BYPASSRLS. Ohne Kontext liefert die Policy nichts (fail closed), statt Daten
 * fremder Shops zu zeigen. Session bleibt bewusst ausserhalb der Policy: sie
 * wird per id gelesen, bevor ein Shop feststeht, und der naechtliche Abgleich
 * zaehlt darueber die zu bearbeitenden Shops auf.
 */
export async function withShop(shop, fn) {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.shop', ${shop}, true)`;
    return fn(tx);
  });
}

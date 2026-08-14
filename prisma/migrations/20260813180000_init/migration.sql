-- InfiniteHelper: Sitzungen und ein Vermerk je gesendeter Anfrage.
--
-- Die Sitzungstabelle traegt denselben Aufbau wie in den uebrigen Apps, sie
-- wird von @shopify/shopify-app-session-storage-prisma vorgegeben. Sie steht
-- bewusst NICHT unter Row-Level Security: Die Bibliothek liest sie ohne
-- gesetzten Shop-Kontext, und die uebrigen Apps halten es genauso.
CREATE TABLE "Session" (
    "id"            TEXT NOT NULL,
    "shop"          TEXT NOT NULL,
    "state"         TEXT NOT NULL,
    "isOnline"      BOOLEAN NOT NULL DEFAULT false,
    "scope"         TEXT,
    "expires"       TIMESTAMP(3),
    "accessToken"   TEXT NOT NULL,
    "userId"        BIGINT,
    "firstName"     TEXT,
    "lastName"      TEXT,
    "email"         TEXT,
    "accountOwner"  BOOLEAN NOT NULL DEFAULT false,
    "locale"        TEXT,
    "collaborator"  BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false,
    "refreshToken"        TEXT,
    "refreshTokenExpires" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- Vermerk, dass eine Anfrage rausging - nicht ihr Inhalt. Name, E-Mail und
-- Nachricht stehen im Helpdesk; hier bleiben sie bewusst aussen vor.
CREATE TABLE "Inquiry" (
    "id"           TEXT NOT NULL,
    "shop"         TEXT NOT NULL,
    "sentAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appsDetected" INTEGER NOT NULL DEFAULT 0,
    "appsReported" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Inquiry_shop_idx" ON "Inquiry"("shop");

-- Dieselbe Zeilensicherheit wie bei allen Tabellen mit Shopbezug in dieser
-- Datenbank, Name und Bedingung genau wie dort: ohne gesetzten Shop-Kontext
-- liefert eine Abfrage nichts, ein Shop sieht die Anfragen eines anderen nie.
-- Den Kontext setzt withShop in app/db.server.js.
--
-- Fehlte das hier, waere der Schaden still: Die Abfrage liefe einfach ueber
-- alle Zeilen.
ALTER TABLE "Inquiry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Inquiry" FORCE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON "Inquiry"
    USING ("shop" = current_setting('app.shop', true))
    WITH CHECK ("shop" = current_setting('app.shop', true));

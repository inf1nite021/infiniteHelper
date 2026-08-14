import { authenticate } from "../shopify.server";
import db, { withShop } from "../db.server";

/**
 * Deinstallation: alles loeschen, was zum Shop gehoert.
 *
 * Frueher wurden hier nur die Ueberwachungen stillgelegt und die Sitzung
 * entfernt; die eigentlichen Daten fielen erst bei shop/redact, das Shopify
 * rund 48 Stunden spaeter schickt. Die Datenschutzerklaerung sagte aber
 * Loeschung "bei Deinstallation" zu. Jetzt gilt der Text.
 *
 * Der Zweck endet mit der Deinstallation - danach gibt es keinen Grund, die
 * Daten noch zwei Tage zu halten. shop/redact bleibt als zweiter Anlauf
 * bestehen, falls dieser Webhook nie ankommt.
 *
 * Preis dieser Entscheidung: Wer versehentlich deinstalliert und neu
 * installiert, faengt mit leeren Wochenplaenen an. Das ist die Seite, auf der
 * man bei Zweifeln stehen will.
 */
export const action = async ({ request }) => {
  const { shop, session, topic } = await authenticate.webhook(request);

  console.log(`[Webhook] ${topic} für ${shop} - lösche Shopdaten.`);

  try {
    await withShop(shop, (tx) => tx.inquiry.deleteMany({ where: { shop } }));
    // Bewusst ohne Rueckgriff auf session: Der Webhook kann mehrfach kommen,
    // und beim zweiten Mal ist die Sitzung schon weg. Haenge man das Loeschen
    // daran, uebersprunge ein Wiederholungslauf genau die Arbeit, für die er
    // gedacht ist. Alle Aufrufe hier sind mehrfach ausfuehrbar.


    if (session) {
      await db.session.deleteMany({ where: { shop } });
    }

    console.log(`[Webhook] Shopdaten für ${shop} gelöscht.`);
    return new Response();
  } catch (error) {
    // 500 zurueckgeben, damit Shopify den Webhook erneut zustellt. Ein
    // stilles OK waere hier das Schlimmste: Die Loeschung faende nie statt,
    // und niemand erfuehre davon.
    console.error(`[Webhook] Löschen für ${shop} fehlgeschlagen:`, error);
    return new Response("Server Error", { status: 500 });
  }
};

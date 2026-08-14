import { authenticate } from "../shopify.server";
import db, { withShop } from "../db.server";

export const action = async ({ request }) => {
  const { topic, shop } = await authenticate.webhook(request);
  console.log(`[Webhook] ${topic} empfangen. Lösche alle Daten für: ${shop}`);

  try {
    // Die App speichert vom Haendler nur den Vermerk, dass eine Anfrage
    // rausging - Anzahlen, kein Inhalt. Er faellt hier trotzdem mit: Nach der
    // Loeschaufforderung soll nichts uebrig bleiben, auch nichts Harmloses.
    await withShop(shop, (tx) => tx.inquiry.deleteMany({ where: { shop } }));
    // Die Wochenplaene fehlten hier: Die Tabelle kam mit der Umstellung auf
    // Kategorien hinzu, die Loeschroutine wurde nicht mitgezogen. Sie blieben
    // damit samt Kategorienamen dauerhaft stehen, obwohl
    // Datenschutzerklaerung und AVV ihre Loeschung zusagen.
    // Regulaer ist hier schon nichts mehr zu tun - geloescht wird seit dem
    // 11.08.2026 bereits bei der Deinstallation. Dieser Weg bleibt als
    // zweiter Anlauf: Kam der Deinstallations-Webhook nie an, ist das hier
    // die letzte Gelegenheit, und Shopify verlangt ihn ohnehin.
    // Nachweis behalten, aber Personenbezug entfernen: Shop, Fassung und
    await db.session.deleteMany({ where: { shop: shop } });

    console.log(`[Webhook] Daten für ${shop} erfolgreich DSGVO-konform gelöscht.`);
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error(`[Webhook] Fehler beim Löschen der Daten für ${shop}:`, error);
    return new Response("Server Error", { status: 500 });
  }
};
import { MESSAGE_MAX } from "./limits";

/**
 * Die Kenndaten des Haendlers: Name, Shop, Shop-ID, Benutzer-ID.
 *
 * Ausdruecklich serverseitig ermittelt und NICHT aus dem Formular gelesen -
 * auch dann nicht, wenn sie dort angezeigt werden. Kaeme der Shop aus dem
 * Browser, liesse sich mit einem veraenderten Aufruf eine Anfrage im Namen
 * eines fremden Shops stellen.
 *
 * Bewusst fehlertolerant: Schlaegt die Abfrage fehl, bleiben Felder leer und
 * die Anfrage laesst sich trotzdem absenden. Ein Haendler, der Hilfe sucht,
 * soll nicht an einer Stoerung bei Shopify scheitern.
 */
export async function loadShopContact(admin, shopDomain, sessionToken) {
  const contact = {
    shop: shopDomain,
    firstName: "",
    lastName: "",
    shopId: "",
    /*
      Die Kennung der angemeldeten Person. Bei eingebetteten Apps liefert
      Shopify sie im "sub"-Feld des Sitzungstokens mit; ohne Online-Zugriffs-
      token gibt es sonst keinen Weg an sie heran.
    */
    userId: String(sessionToken?.sub ?? ""),
  };

  try {
    const antwort = await admin.graphql(
      `#graphql
        query helperShopContact {
          shop { id name shopOwnerName }
        }`,
    );
    const daten = await antwort.json();
    const shop = daten?.data?.shop;

    /* "gid://shopify/Shop/12345678" -> "12345678" */
    contact.shopId = String(shop?.id ?? "").split("/").pop() ?? "";

    /*
      Shopify liefert nur einen zusammenhaengenden Namen. Getrennt wird am
      letzten Leerzeichen: "Anna Maria Schmidt" wird zu "Anna Maria" +
      "Schmidt". Fehlt der Inhabername, tritt der Shopname an seine Stelle,
      zur Not die Domain - das Feld ist nie leer, denn der Endpunkt weist
      Anfragen ohne Namen ab.
    */
    const inhaber = (shop?.shopOwnerName ?? "").trim() || (shop?.name ?? "").trim() || shopDomain;
    const schnitt = inhaber.lastIndexOf(" ");
    if (schnitt > 0) {
      contact.firstName = inhaber.slice(0, schnitt);
      contact.lastName = inhaber.slice(schnitt + 1);
    } else {
      contact.firstName = inhaber;
    }
  } catch {
    /* bewusst still - siehe oben. Der Name faellt auf die Domain zurueck. */
    if (!contact.firstName) contact.firstName = shopDomain;
  }

  return contact;
}

/**
 * Pruefung der Antwortadresse.
 *
 * Bewusst nachsichtig statt streng: Ein Muster, das die Adressgrammatik
 * vollstaendig abbildet, ist beruehmt lang und weist trotzdem gueltige
 * Adressen ab. Geprueft wird deshalb nur, was hier tatsaechlich schaden
 * wuerde - genau ein @, etwas davor, ein Punkt mit mindestens zwei Zeichen
 * danach, keine Leerzeichen. Ob die Adresse wirklich existiert, zeigt erst
 * die Antwortmail.
 */
const EMAIL_MUSTER = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[A-Za-z]{2,}$/;

export function parseEmail(raw) {
  const wert = (raw ?? "").toString().trim();
  if (!wert) return { error: "emailMissing" };
  if (wert.length > 120) return { error: "emailLong" };
  if (!EMAIL_MUSTER.test(wert)) return { error: "emailInvalid" };
  return { value: wert };
}

export function parseMessage(raw) {
  const wert = (raw ?? "").toString().trim();
  if (wert.length > MESSAGE_MAX) return { error: "messageLong" };
  return { value: wert };
}

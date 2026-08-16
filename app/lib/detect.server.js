/**
 * Spuren installierter Apps.
 *
 * Shopify erlaubt keiner App, die installierten Apps eines Shops aufzulisten.
 * Geprueft am 13.08.2026: `appInstallations` antwortet mit "access denied",
 * `currentAppInstallation` liefert ausschliesslich die aufrufende App. Das ist
 * keine Frage der Zugriffsrechte, sondern so gebaut.
 *
 * Was bleibt, sind Spuren: Dinge, die eine App im Shop hinterlaesst und die
 * ueber die Admin-API sichtbar sind. Sechs Quellen decken die gaengigen Faelle
 * ab - Script-Tags, App-Bloecke im Theme, Versanddienste, Fulfillment-Dienste,
 * Rabatte aus App-Functions und Metafeld-Namensraeume. Jede nennt, woher der
 * Fund stammt: Der Haendler soll die Liste beurteilen koennen, nicht bloss
 * glauben.
 *
 * WICHTIG, und die Oberflaeche sagt es auch: Diese Erkennung ist
 * unvollstaendig. Eine App, die ausschliesslich die Admin-API nutzt - Daten
 * liest und schreibt, ohne Skript, Theme-Block, Dienst oder Rabatt anzulegen -
 * hinterlaesst keine einzige dieser Spuren. Die Liste ist ein Vorschlag, den
 * der Haendler ergaenzt, kein Inventar.
 */

/** Ein Fund. `quelle` ist die Begruendung, die dem Haendler gezeigt wird. */
function fund(name, quelle, detail = "") {
  return { name, quelle, detail };
}

/**
 * Aus einer URL den Anbieter ableiten.
 *
 * "https://cdn.klaviyo.com/onsite/js/klaviyo.js" -> "klaviyo.com". Die zweite
 * Ebene genuegt: Sie ist das, was der Haendler wiedererkennt, waehrend
 * "cdn.eu-west-1.klaviyo.com" nur Rauschen waere.
 */
export function anbieterAusUrl(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    const teile = host.split(".");
    // Bei "shop.example.co.uk" die letzten drei behalten, sonst die letzten zwei.
    const zwei = teile.slice(-2).join(".");
    const dreiNoetig = /^(co|com|org|net|ac|gov)\.[a-z]{2}$/.test(zwei);
    return teile.slice(dreiNoetig ? -3 : -2).join(".");
  } catch {
    return url.slice(0, 60);
  }
}

/**
 * Jede Quelle einzeln absichern.
 *
 * Faellt eine Abfrage aus - fehlendes Recht, Stoerung bei Shopify -, soll das
 * nicht die uebrigen mitreissen. Eine unvollstaendige Liste ist brauchbar, eine
 * leere Seite mit Fehlermeldung nicht.
 */
async function versuche(name, fn) {
  try {
    return await fn();
  } catch (error) {
    console.warn(`[Erkennung] ${name} nicht lesbar:`, error?.message ?? error);
    return [];
  }
}

async function abfrage(admin, query, variables = {}) {
  const antwort = await admin.graphql(query, { variables });
  const daten = await antwort.json();
  if (daten.errors?.length) {
    throw new Error(daten.errors.map((e) => e.message).join("; "));
  }
  return daten.data;
}

/* ── 1. Script-Tags ──────────────────────────────────────────────────────── */

async function ausScriptTags(admin) {
  const daten = await abfrage(
    admin,
    `#graphql
      query scriptTags { scriptTags(first: 100) { edges { node { src } } } }`,
  );
  const gesehen = new Map();
  for (const { node } of daten?.scriptTags?.edges ?? []) {
    if (!node?.src) continue;
    const anbieter = anbieterAusUrl(node.src);
    if (!gesehen.has(anbieter)) gesehen.set(anbieter, fund(anbieter, "script", node.src));
  }
  return [...gesehen.values()];
}

/* ── 2. App-Bloecke im Theme ─────────────────────────────────────────────── */

/**
 * Das aktive Theme haelt seine Bausteine in settings_data.json. App-Bloecke
 * stehen dort unter "blocks" mit einem type der Form
 * "shopify://apps/<handle>/blocks/<block>/<uuid>". Der Handle ist der Name, den
 * der Haendler im App-Store sieht - die brauchbarste Spur von allen.
 */
async function ausTheme(admin) {
  const daten = await abfrage(
    admin,
    `#graphql
      query themeFiles {
        themes(first: 1, roles: [MAIN]) {
          nodes {
            id
            files(first: 5, filenames: ["config/settings_data.json"]) {
              nodes { body { ... on OnlineStoreThemeFileBodyText { content } } }
            }
          }
        }
      }`,
  );
  const inhalt = daten?.themes?.nodes?.[0]?.files?.nodes?.[0]?.body?.content;
  if (!inhalt) return [];

  const gesehen = new Map();
  for (const treffer of inhalt.matchAll(/shopify:\/\/apps\/([a-z0-9-]+)\//gi)) {
    const handle = treffer[1];
    if (!gesehen.has(handle)) gesehen.set(handle, fund(handle, "theme", "App-Block im aktiven Theme"));
  }
  return [...gesehen.values()];
}

/* ── 3. Versanddienste ───────────────────────────────────────────────────── */

async function ausCarrierServices(admin) {
  const daten = await abfrage(
    admin,
    `#graphql
      query carrier { carrierServices(first: 50) { edges { node { name active } } } }`,
  );
  return (daten?.carrierServices?.edges ?? [])
    .filter(({ node }) => node?.name)
    .map(({ node }) =>
      fund(node.name, "versand", node.active ? "aktiver Versanddienst" : "Versanddienst (inaktiv)"),
    );
}

/* ── 4. Fulfillment-Dienste ──────────────────────────────────────────────── */

async function ausFulfillmentServices(admin) {
  const daten = await abfrage(
    admin,
    `#graphql
      query fulfillment {
        shop { fulfillmentServices { serviceName type } }
      }`,
  );
  return (daten?.shop?.fulfillmentServices ?? [])
    // MANUAL ist Shopifys eigener Eintrag fuer Handversand, keine App.
    .filter((s) => s?.serviceName && s.type !== "MANUAL")
    .map((s) => fund(s.serviceName, "fulfillment", "Fulfillment-Dienst"));
}

/* ── 5. Rabatte aus App-Functions ────────────────────────────────────────── */

async function ausDiscounts(admin) {
  const daten = await abfrage(
    admin,
    `#graphql
      query appDiscounts {
        discountNodes(first: 100) {
          edges {
            node {
              discount {
                ... on DiscountAutomaticApp { title appDiscountType { app { title } } }
                ... on DiscountCodeApp { title appDiscountType { app { title } } }
              }
            }
          }
        }
      }`,
  );
  const gesehen = new Map();
  for (const { node } of daten?.discountNodes?.edges ?? []) {
    const titel = node?.discount?.appDiscountType?.app?.title;
    if (titel && !gesehen.has(titel)) {
      gesehen.set(titel, fund(titel, "rabatt", `Rabatt „${node.discount.title}“`));
    }
  }
  return [...gesehen.values()];
}

/* ── 6. Metafeld-Definitionen im App-Namensraum ──────────────────────────── */

/**
 * Apps legen ihre Felder im reservierten Namensraum "app--<id>--<name>" ab.
 * Die Zahl dahinter ist keine Kennung, die dem Haendler etwas sagt - der
 * lesbare Teil ist der Name danach. Ohne ihn taugt der Fund nichts, deshalb
 * fallen namenlose Treffer raus.
 */
async function ausMetafelder(admin) {
  const daten = await abfrage(
    admin,
    `#graphql
      query mfDefs {
        metafieldDefinitions(first: 100, ownerType: PRODUCT) {
          edges { node { namespace } }
        }
      }`,
  );
  const gesehen = new Map();
  for (const { node } of daten?.metafieldDefinitions?.edges ?? []) {
    const treffer = /^app--\d+--(.+)$/.exec(node?.namespace ?? "");
    if (!treffer) continue;
    const name = treffer[1].split("--")[0];
    if (name && !gesehen.has(name)) {
      gesehen.set(name, fund(name, "metafeld", `Namensraum ${node.namespace}`));
    }
  }
  return [...gesehen.values()];
}

/**
 * Der Name, unter dem zwei Funde als dieselbe App gelten.
 *
 * Die Quellen nennen dieselbe App verschieden: Der Script-Tag liefert die
 * Domain ("klaviyo.com"), das Theme den Handle aus dem App Store ("klaviyo"),
 * ein Versanddienst den Anzeigenamen ("Klaviyo"). Ohne diese Angleichung stand
 * dieselbe App zwei- oder dreimal in der Liste - und der Haendler haette
 * abwaehlen muessen, was die App gerade erst als Fund verkauft hat.
 *
 * Verglichen wird kleingeschrieben, ohne Endung und ohne Trennzeichen. Das
 * fasst "klaviyo.com", "Klaviyo" und "klaviyo-email" NICHT alle zusammen -
 * nur die ersten beiden. Absichtlich zurueckhaltend: Zwei Zeilen zu viel sind
 * ein Schoenheitsfehler, zwei faelschlich verschmolzene Apps ein Datenfehler.
 */
export function vergleichsname(name) {
  return name
    .toLowerCase()
    .replace(/\.(com|de|io|net|org|co|app|shop|ai)$/u, "")
    .replace(/[\s._-]/gu, "");
}

/**
 * Alle Quellen abfragen und zu einer Liste zusammenfuehren.
 *
 * Parallel, weil die Quellen nichts voneinander wissen und der Haendler nicht
 * fuenf Rundreisen nacheinander abwarten soll.
 */
export async function detectApps(admin) {
  const gruppen = await Promise.all([
    versuche("Script-Tags", () => ausScriptTags(admin)),
    versuche("Theme", () => ausTheme(admin)),
    versuche("Versanddienste", () => ausCarrierServices(admin)),
    versuche("Fulfillment", () => ausFulfillmentServices(admin)),
    versuche("Rabatte", () => ausDiscounts(admin)),
    versuche("Metafelder", () => ausMetafelder(admin)),
  ]);

  // Zusammenfuehren: Dieselbe App taucht oft in mehreren Quellen auf - etwa als
  // Script-Tag und als Theme-Block. Der Haendler soll sie einmal sehen, mit
  // allen Fundstellen.
  const zusammen = new Map();
  for (const fundstelle of gruppen.flat()) {
    const schluessel = vergleichsname(fundstelle.name);
    const vorhanden = zusammen.get(schluessel);
    if (vorhanden) {
      if (!vorhanden.quellen.includes(fundstelle.quelle)) {
        vorhanden.quellen.push(fundstelle.quelle);
      }
      // Der kuerzere Name gewinnt: "klaviyo" liest sich besser als
      // "klaviyo.com", und der Theme-Handle ist der Name aus dem App Store.
      if (fundstelle.name.length < vorhanden.name.length) {
        vorhanden.name = fundstelle.name;
      }
    } else {
      zusammen.set(schluessel, {
        name: fundstelle.name,
        quellen: [fundstelle.quelle],
        detail: fundstelle.detail,
      });
    }
  }

  return [...zusammen.values()].sort((a, b) => a.name.localeCompare(b.name, "de"));
}

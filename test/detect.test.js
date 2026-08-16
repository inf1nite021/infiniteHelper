import test from "node:test";
import assert from "node:assert/strict";

import { detectApps, vergleichsname, anbieterAusUrl } from "../app/lib/detect.server.js";

/*
  Die Erkennung, ohne Shop und ohne Netz.

  detect.server.js bekommt den admin-Zugang uebergeben und importiert selbst
  nichts - deshalb genuegt hier eine Attrappe, die vorbereitete Antworten
  liefert. Geprueft wird das, was der Haendler am Ende sieht: eine Zeile je
  App, mit allen Fundstellen.

  Laufen mit:  npm test
*/

/** Attrappe: erkennt die Abfrage am Namen und liefert die passende Antwort. */
function admin(antworten) {
  return {
    graphql: async (query) => {
      const name = /query (\w+)/.exec(query)?.[1] ?? "";
      return { json: async () => ({ data: antworten[name] ?? null }) };
    },
  };
}

test("dieselbe App aus zwei Quellen wird eine Zeile", async () => {
  const gefunden = await detectApps(
    admin({
      scriptTags: { scriptTags: { edges: [{ node: { src: "https://cdn.klaviyo.com/onsite/js/klaviyo.js" } }] } },
      themeFiles: {
        themes: {
          nodes: [
            {
              files: {
                nodes: [{ body: { content: '"type":"shopify://apps/klaviyo/blocks/onsite/1234"' } }],
              },
            },
          ],
        },
      },
    }),
  );

  assert.equal(gefunden.length, 1, "klaviyo.com und klaviyo sind dieselbe App");
  assert.deepEqual(gefunden[0].quellen.sort(), ["script", "theme"]);
  // Der kuerzere Name gewinnt - der Handle aus dem App Store.
  assert.equal(gefunden[0].name, "klaviyo");
});

test("eine ausgefallene Quelle reisst die uebrigen nicht mit", async () => {
  const kaputt = {
    graphql: async (query) => {
      if (query.includes("scriptTags")) throw new Error("access denied");
      return {
        json: async () => ({
          data: query.includes("carrier")
            ? { carrierServices: { edges: [{ node: { name: "Sendcloud", active: true } }] } }
            : null,
        }),
      };
    },
  };
  const gefunden = await detectApps(kaputt);
  assert.equal(gefunden.length, 1);
  assert.equal(gefunden[0].name, "Sendcloud");
});

test("Shopifys eigener Handversand ist keine App", async () => {
  const gefunden = await detectApps(
    admin({
      fulfillment: {
        shop: {
          fulfillmentServices: [
            { serviceName: "Manual", type: "MANUAL" },
            { serviceName: "Shipmondo", type: "THIRD_PARTY" },
          ],
        },
      },
    }),
  );
  assert.deepEqual(gefunden.map((a) => a.name), ["Shipmondo"]);
});

test("aus dem Metafeld-Namensraum wird der lesbare Teil", async () => {
  const gefunden = await detectApps(
    admin({
      mfDefs: {
        metafieldDefinitions: {
          edges: [
            { node: { namespace: "app--123456--judgeme" } },
            { node: { namespace: "reviews" } }, // ohne App-Praefix: kein Fund
          ],
        },
      },
    }),
  );
  assert.deepEqual(gefunden.map((a) => a.name), ["judgeme"]);
});

test("aus der Skript-URL wird der Anbieter", () => {
  assert.equal(anbieterAusUrl("https://cdn.klaviyo.com/onsite/js/klaviyo.js"), "klaviyo.com");
  assert.equal(anbieterAusUrl("https://www.example.co.uk/app.js"), "example.co.uk");
  assert.equal(anbieterAusUrl("kein-url"), "kein-url");
});

test("der Vergleichsname fasst nur zusammen, was zusammengehoert", () => {
  assert.equal(vergleichsname("Klaviyo"), vergleichsname("klaviyo.com"));
  assert.equal(vergleichsname("Judge.me"), vergleichsname("judgeme"));
  // Zurueckhaltend: zwei verschiedene Apps bleiben zwei.
  assert.notEqual(vergleichsname("klaviyo"), vergleichsname("klaviyo-sms"));
});

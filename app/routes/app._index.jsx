// app/routes/app._index.jsx
import { useState } from "react";
import { Form, useActionData, useLoaderData, useNavigation } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { withShop } from "../db.server";
import { detectApps } from "../lib/detect.server";
import { loadShopContact, parseEmail, parseMessage } from "../lib/shopContact.server";
import { MESSAGE_MAX } from "../lib/limits";

const APP_NAME = "infiniteHelper";

export const loader = async ({ request }) => {
  const { admin, session, sessionToken } = await authenticate.admin(request);

  const [contact, detected, letzte] = await Promise.all([
    loadShopContact(admin, session.shop, sessionToken),
    detectApps(admin),
    withShop(session.shop, (tx) =>
      tx.inquiry.findFirst({ where: { shop: session.shop }, orderBy: { sentAt: "desc" } }),
    ),
  ]);

  return { contact, detected, lastSentAt: letzte?.sentAt ?? null };
};

export const action = async ({ request }) => {
  const { admin, session, sessionToken } = await authenticate.admin(request);
  const formData = await request.formData();

  const email = parseEmail(formData.get("email"));
  if (email.error) return { errorKey: email.error };

  const message = parseMessage(formData.get("message"));
  if (message.error) return { errorKey: message.error };

  /*
    Erkannte Apps kommen aus dem Formular, denn der Haendler darf sie abwaehlen
    und ergaenzen - das ist der Sinn der Uebung. Sie sind reine Anliegen-Angaben
    ohne Rechtewirkung; ein manipulierter Aufruf koennte hoechstens eine falsche
    App-Liste in ein Ticket schreiben.
  */
  const gewaehlt = formData.getAll("app").map((w) => w.toString().trim()).filter(Boolean);
  const eigene = (formData.get("ownApps") ?? "")
    .toString()
    .split(/[\n,;]+/)
    .map((w) => w.trim())
    .filter(Boolean);
  const apps = [...new Set([...gewaehlt, ...eigene])];
  const erkannt = Number.parseInt(formData.get("detectedCount"), 10) || 0;

  /* Shop und Person erneut serverseitig holen - das Formular liefert nur die freien Felder. */
  const contact = await loadShopContact(admin, session.shop, sessionToken);

  /*
    kind: "support" und nicht etwa "helper" - geprueft am 14.08.2026 in
    kontakt-api/validate.js: Ein unbekanntes kind faellt still auf "contact"
    zurueck, und dieser Zweig verwirft app, shop, shopId und userId. Die
    Anfrage waere als anonymes Kontaktformular angekommen, und ein Zammad-
    Ticket haette es auch nicht gegeben; das legt der Endpunkt nur bei
    "support" an.

    summary: true hebt die Nachrichtengrenze von 250 auf 4000 Zeichen. Die
    App-Liste haengt hinten an der Nachricht, weil der Endpunkt kein eigenes
    Feld dafuer kennt - ein zusaetzliches Feld wuerde stillschweigend
    verworfen, und still verlorene Daten sind das Schlimmste von allem.

    Leere Nachricht abfangen: Der Endpunkt weist sie mit "Nachricht fehlt" ab,
    unsere Oberflaeche laesst sie aber zu. Ohne den Rueckfallwert scheiterte
    genau die Anfrage, die nur die App-Liste schicken will.
  */
  const appListe = apps.length ? apps.map((a) => `• ${a}`).join("\n") : "(keine angegeben)";
  const nachricht = [
    message.value || "(keine Nachricht)",
    "",
    `Gefundene Apps – ${erkannt} erkannt, ${apps.length} gemeldet:`,
    appListe,
  ].join("\n");

  const payload = {
    kind: "support",
    name: [contact.firstName, contact.lastName].filter(Boolean).join(" "),
    email: email.value,
    message: nachricht,
    summary: true,
    app: APP_NAME,
    shop: contact.shop,
    shopId: contact.shopId,
    userId: contact.userId,
    lang: "de",
  };

  // eslint-disable-next-line no-undef
  const endpoint = process.env.SUPPORT_ENDPOINT;
  // eslint-disable-next-line no-undef
  const token = process.env.SUPPORT_APP_TOKEN;
  if (!endpoint) return { errorKey: "endpointMissing" };

  try {
    const antwort = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "X-App-Token": token } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });
    if (!antwort.ok) {
      const detail = await antwort.json().catch(() => ({}));
      return { errorKey: "sendFailed", detail: detail?.error ?? `HTTP ${antwort.status}` };
    }
  } catch (error) {
    return { errorKey: "sendFailed", detail: error?.message ?? "" };
  }

  /*
    Erst nach erfolgreichem Versand vermerken - und nur Anzahlen. Name, E-Mail
    und Nachricht bleiben im Helpdesk; eine zweite Kopie hier braeuchte niemand
    und muesste bei jeder Auskunft mitbeantwortet werden.
  */
  await withShop(session.shop, (tx) =>
    tx.inquiry.create({
      data: { shop: session.shop, appsDetected: erkannt, appsReported: apps.length },
    }),
  );

  return { success: true };
};

const QUELLEN = {
  script: "Skript im Shop",
  theme: "Block im Theme",
  versand: "Versanddienst",
  fulfillment: "Fulfillment-Dienst",
  rabatt: "Rabatt",
  metafeld: "Metafeld",
};

const FEHLER = {
  emailMissing: "Bitte eine E-Mail-Adresse für Rückfragen eintragen.",
  emailInvalid: "Diese E-Mail-Adresse sieht nicht gültig aus. Beispiel: name@firma.de",
  emailLong: "Die E-Mail-Adresse ist zu lang.",
  messageLong: `Die Nachricht darf höchstens ${MESSAGE_MAX} Zeichen haben.`,
  endpointMissing: "Der Versand ist nicht eingerichtet (SUPPORT_ENDPOINT fehlt).",
  sendFailed: "Konnte nicht gesendet werden. Bitte erneut versuchen oder an support@infinitecodes.de schreiben.",
};

const feldStil = {
  width: "100%", padding: "8px 10px", border: "1px solid #e1e3e5",
  borderRadius: "8px", fontSize: "14px", font: "inherit",
};
const gesperrtStil = { ...feldStil, background: "#f6f6f7", color: "#6d7175", cursor: "not-allowed" };
const labelStil = { display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" };

// eslint-disable-next-line react/prop-types -- reiner Anzeigebaustein
function GesperrtesFeld({ label, value }) {
  return (
    <div style={{ flex: 1, minWidth: "180px" }}>
      <label style={labelStil}>{label}</label>
      <input type="text" value={value || "—"} readOnly tabIndex={-1} style={gesperrtStil} />
    </div>
  );
}

export default function Index() {
  const { contact, detected, lastSentAt } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const sendet = navigation.state === "submitting";

  const [nachricht, setNachricht] = useState("");
  /*
    Leer, nicht mit der Shop-Kontaktadresse vorbelegt. Die ist oft ein
    Sammelpostfach wie info@ oder die private Adresse des Inhabers - beides
    selten die Stelle, an der eine Antwort ankommen soll. Wer sie will, tippt
    sie; das Feld schlaegt sie nicht vor.
  */
  const [email, setEmail] = useState("");

  const rest = MESSAGE_MAX - nachricht.length;

  if (actionData?.success) {
    return (
      <s-page heading="Anfrage gesendet">
        <s-card>
          <s-stack gap="base">
            <s-banner tone="success" heading="Danke – wir haben deine Anfrage erhalten.">
              <s-paragraph>
                Wir melden uns per E-Mail an {email}. In der Regel innerhalb von 24–48 Stunden.
              </s-paragraph>
            </s-banner>
          </s-stack>
        </s-card>
      </s-page>
    );
  }

  return (
    <s-page heading="Welche Apps zahlst du gerade?" size="large">
      <s-card>
        <s-stack gap="base">
          <s-paragraph>
            infiniteHelper sieht nach, welche Apps in deinem Shop Spuren hinterlassen
            haben, und schickt uns die Liste zusammen mit deiner Nachricht. Daraus
            sagen wir dir, was sich durch eine einzige eigene App ersetzen ließe.
          </s-paragraph>

          {lastSentAt ? (
            <s-banner tone="info">
              <s-paragraph>
                Du hast am {new Date(lastSentAt).toLocaleDateString("de-DE")} schon
                einmal angefragt. Eine weitere Anfrage ist kein Problem – schreib
                gern dazu, was sich geändert hat.
              </s-paragraph>
            </s-banner>
          ) : null}

          {actionData?.errorKey ? (
            <s-banner tone="critical" heading={FEHLER[actionData.errorKey] ?? "Es ist etwas schiefgegangen."}>
              {actionData.detail ? <s-paragraph>{actionData.detail}</s-paragraph> : null}
            </s-banner>
          ) : null}
        </s-stack>
      </s-card>

      <Form method="post">
        <input type="hidden" name="detectedCount" value={detected.length} />

        <div style={{ marginTop: "16px" }}>
          <s-card>
            <s-stack gap="base">
              <s-heading>Gefundene Apps ({detected.length})</s-heading>
              <s-text color="subdued">
                Shopify erlaubt keiner App, die installierten Apps aufzulisten. Diese
                Liste stammt aus Spuren – Skripten, Theme-Blöcken, Versanddiensten,
                Rabatten und Metafeldern. Sie ist deshalb <strong>unvollständig</strong>:
                Apps, die nur im Hintergrund mit Shopify sprechen, tauchen hier nicht
                auf. Nimm heraus, was nicht stimmt, und trage unten nach, was fehlt.
              </s-text>

              {detected.length === 0 ? (
                <s-text color="subdued">
                  Keine Spuren gefunden. Das heißt nicht, dass du keine Apps hast –
                  trag sie unten einfach selbst ein.
                </s-text>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {detected.map((app) => (
                    <label
                      key={app.name}
                      style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "8px 10px", border: "1px solid #e1e3e5", borderRadius: "8px",
                      }}
                    >
                      <input type="checkbox" name="app" value={app.name} defaultChecked />
                      <span style={{ fontWeight: 600, fontSize: "14px" }}>{app.name}</span>
                      <span style={{ fontSize: "12px", color: "#6d7175", marginLeft: "auto" }}>
                        {app.quellen.map((q) => QUELLEN[q] ?? q).join(" · ")}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              <div>
                <label style={labelStil} htmlFor="ownApps">
                  Weitere Apps, die hier fehlen
                </label>
                <textarea
                  id="ownApps"
                  name="ownApps"
                  rows={3}
                  placeholder="Eine pro Zeile oder mit Komma getrennt"
                  style={{ ...feldStil, resize: "vertical" }}
                />
              </div>
            </s-stack>
          </s-card>
        </div>

        <div style={{ marginTop: "16px" }}>
          <s-card>
            <s-stack gap="base">
              <s-heading>Deine Daten</s-heading>
              <s-text color="subdued">
                Die grauen Felder kommen automatisch aus deinem Shop und lassen sich
                nicht ändern – sie ordnen deine Anfrage eindeutig zu.
              </s-text>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <GesperrtesFeld label="Vorname" value={contact.firstName} />
                <GesperrtesFeld label="Nachname" value={contact.lastName} />
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <GesperrtesFeld label="Shop" value={contact.shop} />
                <GesperrtesFeld label="Shop-ID" value={contact.shopId} />
                <GesperrtesFeld label="Shopify-Benutzer-ID" value={contact.userId} />
              </div>

              <div>
                <label style={labelStil} htmlFor="email">E-Mail für Rückfragen</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  maxLength={120}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="An welche Adresse sollen wir antworten?"
                  style={feldStil}
                />
              </div>

              <div>
                <label style={labelStil} htmlFor="message">Deine Nachricht</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  maxLength={MESSAGE_MAX}
                  value={nachricht}
                  onChange={(e) => setNachricht(e.target.value)}
                  placeholder="Was stört dich an deinem heutigen App-Stapel?"
                  style={{ ...feldStil, resize: "vertical" }}
                />
                {/*
                  Zaehler statt stummer Begrenzung: maxLength hindert am Tippen,
                  ohne zu sagen warum. Ab 30 Zeichen Rest faellt er auf, vorher
                  bleibt er unauffaellig.
                */}
                <div style={{ textAlign: "right", fontSize: "12px", marginTop: "4px",
                              color: rest <= 30 ? "#b91c1c" : "#6d7175" }}>
                  {rest} von {MESSAGE_MAX} Zeichen übrig
                </div>
              </div>

              {/*
                Vor dem Knopf, nicht danach: Was rausgeht, soll man lesen
                koennen, bevor man es abschickt.
              */}
              <s-text color="subdued">
                Mit dem Senden erhalten wir die oben gezeigten Angaben, deine
                Nachricht und die ausgewählte App-Liste, um dir zu antworten.
                Einzelheiten in der{" "}
                <a href="/app/datenschutz" style={{ color: "#2c6ecb" }}>
                  Datenschutzerklärung
                </a>
                . Wir sind dafür Verantwortlicher im Sinne der DSGVO – es findet
                keine Auftragsverarbeitung statt.
              </s-text>

              <div>
                <s-button variant="primary" type="submit" {...(sendet ? { loading: true } : {})}>
                  Anfrage senden
                </s-button>
              </div>
            </s-stack>
          </s-card>
        </div>
      </Form>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};

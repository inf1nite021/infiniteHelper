// app/routes/app._index.jsx
import { useState } from "react";
import { Form, useActionData, useLoaderData, useNavigation } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { withShop } from "../db.server";
import { detectApps } from "../lib/detect.server";
import { loadShopContact, parseEmail, parseMessage } from "../lib/shopContact.server";
import { MESSAGE_MAX } from "../lib/limits";
import { useLang } from "../i18n";

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
  const apps = [
    ...new Set(formData.getAll("app").map((w) => w.toString().trim()).filter(Boolean)),
  ];
  const erkannt = Number.parseInt(formData.get("detectedCount"), 10) || 0;

  /*
    Die Sprache der Oberflaeche mitschicken, statt "de" anzunehmen.
    Geprueft am 15.08.2026 in kontakt-api/validate.js: Der Endpunkt nimmt jedes
    zweistellige Kleinbuchstaben-Kuerzel und faellt sonst auf "de" zurueck. Ein
    Haendler, der die App auf Franzoesisch bedient, bekam bisher ein als
    deutsch gekennzeichnetes Ticket - und damit vermutlich eine deutsche
    Antwort.
  */
  const SPRACHEN = ["de", "en", "es", "fr", "pt"];
  const roh = (formData.get("lang") ?? "").toString();
  const sprache = SPRACHEN.includes(roh) ? roh : "de";

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

    Die Liste wird gedeckelt: Ueber 4000 Zeichen weist der Endpunkt alles ab
    (SUMMARY_MAX), und die Nachricht traegt die Liste huckepack. Ohne Deckel
    scheiterte eine Anfrage mit sehr vielen Eintraegen an einer Fehlermeldung,
    die dem Haendler nichts sagt - die Grenze ist fuer ihn nirgends sichtbar.
    120 Eintraege zu je hoechstens 80 Zeichen bleiben mit Abstand darunter.
  */
  const APP_LISTE_MAX = 120;
  const gemeldet = apps.slice(0, APP_LISTE_MAX);
  const abgeschnitten = apps.length - gemeldet.length;

  const appListe = gemeldet.length ? gemeldet.map((a) => `• ${a}`).join("\n") : "(keine angegeben)";
  const nachricht = [
    message.value || "(keine Nachricht)",
    "",
    `Gefundene Apps – ${erkannt} erkannt, ${apps.length} gemeldet:`,
    appListe,
    ...(abgeschnitten > 0 ? [`… und ${abgeschnitten} weitere, hier gekürzt.`] : []),
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
    lang: sprache,
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
  const { t, lang } = useLang();
  const { contact, detected, lastSentAt } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const sendet = navigation.state === "submitting";

  /*
    Selbst ergaenzte Apps liegen im Zustand und werden unter die erkannten
    gemischt. Sie tragen dasselbe Kaestchen und denselben Feldnamen, also
    kommen sie ohne Sonderbehandlung beim Versand an.
  */
  const [eigene, setEigene] = useState([]);
  const [neueApp, setNeueApp] = useState("");

  const alleApps = [
    ...detected,
    ...eigene.map((name) => ({ name, quellen: ["selbst"] })),
  ];

  const einfuegen = () => {
    const name = neueApp.trim();
    if (!name) return;
    // Doppelte stillschweigend schlucken, gross/klein egal - der Haendler
    // soll nicht ueber eine Fehlermeldung stolpern, weil er etwas zweimal
    // eintraegt, das schon in der Liste steht.
    const bekannt = alleApps.some((a) => a.name.toLowerCase() === name.toLowerCase());
    if (!bekannt) setEigene((v) => [...v, name]);
    setNeueApp("");
  };

  /*
    Die Liste als Text, eine Zeile je App mit ihren Fundstellen. Bewusst
    nicht als Datei zum Herunterladen: In der eingebetteten App liegt ein
    Download hinter zwei Sandbox-Regeln, die Zwischenablage nicht.
  */
  const [kopiert, setKopiert] = useState(false);
  const kopieren = async () => {
    const text = alleApps
      .map((a) => `${a.name} (${a.quellen.map((q) => t.quellen[q] ?? q).join(", ")})`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const feld = document.createElement("textarea");
      feld.value = text;
      feld.style.position = "fixed";
      feld.style.opacity = "0";
      document.body.appendChild(feld);
      feld.select();
      document.execCommand("copy");
      document.body.removeChild(feld);
    }
    setKopiert(true);
    setTimeout(() => setKopiert(false), 2000);
  };

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
      <s-page heading={t.sent.heading}>
        <s-section accessibilityLabel={t.heading}>
          <s-stack gap="base">
            <s-banner tone="success" heading={t.sent.banner}>
              <s-paragraph>
                {t.sent.body(email)}
              </s-paragraph>
            </s-banner>
          </s-stack>
        </s-section>
      </s-page>
    );
  }

  return (
    <s-page heading={t.heading} size="large">
      <s-section accessibilityLabel={t.heading}>
        <s-stack gap="base">
          <s-paragraph>
            {t.intro}
          </s-paragraph>

          {lastSentAt ? (
            <s-banner tone="info">
              <s-paragraph>
                {t.again(new Date(lastSentAt).toLocaleDateString(lang))}
              </s-paragraph>
            </s-banner>
          ) : null}

          {actionData?.errorKey ? (
            <s-banner tone="critical" heading={t.errors[actionData.errorKey] ?? t.errors.unknown}>
              {actionData.detail ? <s-paragraph>{actionData.detail}</s-paragraph> : null}
            </s-banner>
          ) : null}
        </s-stack>
      </s-section>

      <Form method="post">
        <input type="hidden" name="detectedCount" value={detected.length} />
        {/*
          Die gewaehlte Sprache mitschicken. Sie steht nur im Browser
          (localStorage), der Server kennt sie sonst nicht - und schrieb
          deshalb in jedes Ticket "de".
        */}
        <input type="hidden" name="lang" value={lang} />

        <div style={{ marginTop: "16px" }}>
          <s-section accessibilityLabel={t.heading}>
            <s-stack gap="base">
              <s-heading>{t.apps.heading(alleApps.length)}</s-heading>
              <s-text color="subdued">
                {t.apps.check}
              </s-text>

              {alleApps.length === 0 ? (
                <s-text color="subdued">
                  {t.apps.empty}
                </s-text>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {alleApps.map((app) => (
                    <label
                      key={app.name}
                      style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "8px 10px", border: "1px solid #e1e3e5", borderRadius: "8px",
                      }}
                    >
                      {/*
                        Auch die selbst ergaenzten stehen als Kaestchen in derselben
                        Liste. Damit ist das Abwaehlen zugleich das Zuruecknehmen -
                        wer sich vertippt, hakt es ab, statt einen Loeschknopf zu
                        suchen. Und der Versand liest ohnehin nur die Haken.
                      */}
                      <input type="checkbox" name="app" value={app.name} defaultChecked />
                      <span style={{ fontWeight: 600, fontSize: "14px" }}>{app.name}</span>
                      <span style={{ fontSize: "12px", color: "#6d7175", marginLeft: "auto" }}>
                        {app.quellen.map((q) => t.quellen[q] ?? q).join(" · ")}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              <div>
                <label style={labelStil} htmlFor="neueApp">
                  {t.apps.addLabel}
                </label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  {/*
                    Die Eingabetaste fuegt ein, statt das Formular abzuschicken.
                    Ohne das waere der haeufigste Griff - Name tippen, Enter -
                    genau der, der die Anfrage vorzeitig losschickt.
                  */}
                  <input
                    id="neueApp"
                    type="text"
                    value={neueApp}
                    onChange={(e) => setNeueApp(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); einfuegen(); }
                    }}
                    placeholder={t.apps.addPlaceholder}
                    maxLength={80}
                    style={{ ...feldStil, flex: 1 }}
                  />
                  {/* type="button", sonst schickt der Knopf das Formular ab. */}
                  <s-button type="button" onClick={einfuegen}>{t.apps.addButton}</s-button>
                </div>
              </div>

              {/*
                Die Liste mitnehmen, ohne etwas zu senden. Das ist der Nutzen,
                den die App auch dann hat, wenn der Haendler nie anfragt -
                eine Bestandsaufnahme seines Shops, die ihm gehoert.

                Erst die Zwischenablage-API, dann ein verstecktes Textfeld als
                Rueckfall: In einem iframe ohne Berechtigung wirft
                navigator.clipboard, und ein Knopf, der stumm nichts tut,
                waere schlimmer als einer, der altmodisch kopiert.
              */}
              {alleApps.length > 0 ? (
                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                  <s-button type="button" onClick={kopieren}>
                    {kopiert ? t.apps.copied : t.apps.copy}
                  </s-button>
                  <s-text color="subdued">{t.apps.copyHint}</s-text>
                </div>
              ) : null}

            </s-stack>
          </s-section>
        </div>

        <div style={{ marginTop: "16px" }}>
          <s-section accessibilityLabel={t.heading}>
            <s-stack gap="base">
              <s-heading>{t.data.heading}</s-heading>
              <s-text color="subdued">
                {t.data.locked}
              </s-text>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <GesperrtesFeld label={t.data.firstName} value={contact.firstName} />
                <GesperrtesFeld label={t.data.lastName} value={contact.lastName} />
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <GesperrtesFeld label={t.data.shop} value={contact.shop} />
                <GesperrtesFeld label={t.data.shopId} value={contact.shopId} />
                <GesperrtesFeld label={t.data.userId} value={contact.userId} />
              </div>

              <div>
                <label style={labelStil} htmlFor="email">{t.data.email}</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  maxLength={120}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.data.emailPlaceholder}
                  style={feldStil}
                />
              </div>

              <div>
                <label style={labelStil} htmlFor="message">{t.data.message}</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  maxLength={MESSAGE_MAX}
                  value={nachricht}
                  onChange={(e) => setNachricht(e.target.value)}
                  placeholder={t.data.messagePlaceholder}
                  style={{ ...feldStil, resize: "vertical" }}
                />
                {/*
                  Zaehler statt stummer Begrenzung: maxLength hindert am Tippen,
                  ohne zu sagen warum. Ab 30 Zeichen Rest faellt er auf, vorher
                  bleibt er unauffaellig.
                */}
                <div style={{ textAlign: "right", fontSize: "12px", marginTop: "4px",
                              color: rest <= 30 ? "#b91c1c" : "#6d7175" }}>
                  {t.data.counter(rest, MESSAGE_MAX)}
                </div>
              </div>

              {/*
                Vor dem Knopf, nicht danach: Was rausgeht, soll man lesen
                koennen, bevor man es abschickt.
              */}
              <s-text color="subdued">
                {t.consent}{" "}
                <a href="/app/datenschutz" style={{ color: "#2c6ecb" }}>
                  {t.consentLink}
                </a>
                {t.consentTail}
              </s-text>

              {/*
                Zwei Saetze, die vor dem Knopf stehen muessen, nicht in der FAQ:
                dass niemand senden muss, und was das Senden kostet. Der zweite
                zieht die Grenze, die der App Store zieht - die App ist
                unentgeltlich, ein Auftrag daraus waere ein eigener Vertrag
                ausserhalb von Shopify.
              */}
              <s-text color="subdued">{t.optional}</s-text>
              <s-text color="subdued">{t.freeNote}</s-text>

              <div>
                <s-button variant="primary" type="submit" {...(sendet ? { loading: true } : {})}>
                  {t.submit}
                </s-button>
              </div>
            </s-stack>
          </s-section>
        </div>
      </Form>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};

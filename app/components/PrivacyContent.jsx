export const h2Style = {
  fontSize: "18px",
  fontWeight: 600,
  marginTop: "36px",
  marginBottom: "8px",
};

/**
 * Datenschutzerklaerung fuer InfiniteHelper.
 *
 * DE und EN. Die Oberflaeche der App ist deutsch; Englisch kommt dazu, weil
 * Shopifys Pruefung in englischer Sprache stattfindet und der App Store
 * weltweit ausgeliefert wird. Mehr Sprachen erst, wenn auch die Oberflaeche
 * mehrsprachig wird - eine Datenschutzerklaerung in fuenf Sprachen neben einer
 * einsprachigen App waere dieselbe Ungereimtheit, die bei MarginMaster
 * aufgefallen ist.
 *
 * WICHTIG: Ziffer 2 muss die sechs Quellen der Spurenerkennung nennen. Die App
 * liest mehr Bereiche des Shops als jede andere hier, und der Haendler soll
 * das nicht erst aus der Scope-Liste bei der Installation erfahren.
 */
export const LANGS = [
  { code: "de", label: "DE" },
  { code: "en", label: "EN" },
];

export const privacyContent = {
  de: {
    title: "Datenschutzerklärung",
    sub: "InfiniteHelper · Stand 2026",
    body: (
      <>
        <h2 style={h2Style}>1. Verantwortlicher</h2>
        <p>
          Gianluca Iacona (infinitecodes)<br />
          Rolshover Straße 70<br />
          51105 Köln, Nordrhein-Westfalen<br />
          Deutschland<br />
          E-Mail: support@infinitecodes.de
        </p>

        <h2 style={h2Style}>2. Erhobene Daten</h2>
        <p>
          InfiniteHelper sucht in deinem Shop nach Spuren installierter Apps und
          schickt das Ergebnis zusammen mit deiner Anfrage an uns. Dabei werden
          folgende Daten verarbeitet:
        </p>
        <ul>
          <li>Shop-Domain, Shopify Access Token und Session-Metadaten (zur Authentifizierung)</li>
          <li>
            Spuren installierter Apps aus sechs Quellen deines Shops: eingebundene
            Skripte (deren Adresse den Anbieter nennt), App-Blöcke im aktiven
            Theme, registrierte Versanddienste, registrierte Fulfillment-Dienste,
            Rabatte aus App-Funktionen und Metafeld-Namensräume der Form
            <code> app--…</code>
          </li>
          <li>Vor- und Nachname des Shop-Inhabers, Shop-ID und Shopify-Benutzer-ID</li>
          <li>Die von dir eingetragene Antwortadresse und deine Nachricht</li>
          <li>
            Ein Vermerk über die gesendete Anfrage: Shop, Zeitpunkt und zwei
            Anzahlen (gefundene und gemeldete Apps)
          </li>
        </ul>
        <p>
          InfiniteHelper verarbeitet <strong>keine personenbezogenen Kundendaten</strong> –
          der App fehlen die Zugriffsrechte, um Kund:innen oder Bestellungen
          überhaupt zu lesen. Sie kann auch keine Produkte, Preise oder Inhalte
          deines Shops verändern; alle Rechte sind Leserechte.
        </p>

        <h2 style={h2Style}>3. Zweck und Rechtsgrundlage</h2>
        <p>
          Zweck ist die Beantwortung deiner Anfrage und die Vorbereitung eines
          Angebots. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO – vorvertragliche
          Maßnahmen, die auf deine Anfrage hin erfolgen. Ohne dein Absenden des
          Formulars verlässt kein Wert deinen Shop: Die Spurensuche läuft in der
          App, und erst der Klick auf „Anfrage senden“ übermittelt etwas an uns.
        </p>

        <h2 style={h2Style}>4. Speicherdauer</h2>
        <p>
          Name, Antwortadresse, Nachricht und die App-Liste liegen in unserem
          Helpdesk und bleiben dort, solange es zur Bearbeitung und zur Erfüllung
          gesetzlicher Aufbewahrungspflichten erforderlich ist. In der App selbst
          bleibt nur der Vermerk aus Ziffer 2 – Shop, Zeitpunkt, zwei Anzahlen.
          Er wird bei der Deinstallation gelöscht. Weder Name noch Adresse noch
          Nachricht werden in der App gespeichert.
        </p>

        <h2 style={h2Style}>5. Weitergabe an Dritte</h2>
        <p>
          InfiniteHelper liest über die Shopify Admin API; Shopify Ireland Ltd.
          agiert dabei als Auftragsverarbeiter gemäß Art. 28 DSGVO. Beim Absenden
          gehen die unter Ziffer 2 genannten Daten an unseren eigenen
          Support-Endpunkt auf infinitecodes.de und eröffnen ein Ticket in unserem
          selbst betriebenen Helpdesk; die Benachrichtigungs-E-Mail wird über
          Google Workspace (Google Ireland Limited) als unseren E-Mail-Anbieter
          versandt. Darüber hinaus werden keine Daten an Dritte weitergegeben. Die
          App ist kostenlos, Zahlungsdaten werden nicht verarbeitet.
        </p>

        <h2 style={h2Style}>6. Hosting</h2>
        <p>
          Die App wird auf Servern in Deutschland gehostet. Die Verarbeitung
          personenbezogener Daten erfolgt auf Basis eines
          Auftragsverarbeitungsvertrags mit dem Hoster.
        </p>

        <h2 style={h2Style}>7. Deine Rechte</h2>
        <p>Du hast nach DSGVO folgende Rechte:</p>
        <ul>
          <li>Auskunft über gespeicherte Daten (Art. 15)</li>
          <li>Berichtigung unrichtiger Daten (Art. 16)</li>
          <li>Löschung deiner Daten (Art. 17)</li>
          <li>Einschränkung der Verarbeitung (Art. 18)</li>
          <li>Datenübertragbarkeit (Art. 20)</li>
          <li>Widerspruch gegen die Verarbeitung (Art. 21)</li>
          <li>Beschwerde bei einer Aufsichtsbehörde (Art. 77)</li>
        </ul>
        <p>Zur Ausübung deiner Rechte: support@infinitecodes.de</p>

        <h2 style={h2Style}>8. Cookies</h2>
        <p>
          InfiniteHelper verwendet keine Tracking-Cookies. Das Speichern und
          Auslesen der technisch notwendigen Session-Cookies für die
          Shopify-Authentifizierung ist nach § 25 Abs. 2 Nr. 2 TDDDG zulässig;
          die damit verbundene Verarbeitung stützt sich auf Art. 6 Abs. 1 lit. f
          DSGVO.
        </p>
      </>
    ),
  },
  en: {
    title: "Privacy Policy",
    sub: "InfiniteHelper · As of 2026",
    body: (
      <>
        <h2 style={h2Style}>1. Data Controller</h2>
        <p>
          Gianluca Iacona (infinitecodes)<br />
          Rolshover Straße 70<br />
          51105 Cologne, North Rhine-Westphalia<br />
          Germany<br />
          Email: support@infinitecodes.de
        </p>

        <h2 style={h2Style}>2. Data Collected</h2>
        <p>
          InfiniteHelper looks for traces of installed apps in your shop and sends
          the result to us together with your enquiry. The following data is
          processed:
        </p>
        <ul>
          <li>Shop domain, Shopify access token and session metadata (for authentication)</li>
          <li>
            Traces of installed apps from six sources in your shop: embedded
            scripts (whose address names the vendor), app blocks in the active
            theme, registered carrier services, registered fulfillment services,
            discounts created by app functions, and metafield namespaces of the
            form <code>app--…</code>
          </li>
          <li>First and last name of the shop owner, shop ID and Shopify user ID</li>
          <li>The reply address you enter and your message</li>
          <li>
            A record of the enquiry sent: shop, timestamp and two counts (apps
            found and apps reported)
          </li>
        </ul>
        <p>
          InfiniteHelper processes no <strong>personal customer data</strong> – the
          app does not hold the access scopes required to read customers or orders.
          Nor can it change any products, prices or content in your shop; every
          scope it holds is read-only.
        </p>

        <h2 style={h2Style}>3. Purpose and Legal Basis</h2>
        <p>
          The purpose is to answer your enquiry and prepare an offer. The legal
          basis is Art. 6(1)(b) GDPR – pre-contractual measures taken at your
          request. Nothing leaves your shop until you submit the form: the trace
          detection runs inside the app, and only the click on “Send enquiry”
          transmits anything to us.
        </p>

        <h2 style={h2Style}>4. Retention Period</h2>
        <p>
          Name, reply address, message and the app list are held in our helpdesk
          for as long as is necessary to handle them and to meet statutory
          retention obligations. Inside the app itself only the record described in
          section 2 remains – shop, timestamp, two counts – and it is deleted when
          you uninstall. Neither name nor address nor message is stored in the app.
        </p>

        <h2 style={h2Style}>5. Disclosure to Third Parties</h2>
        <p>
          InfiniteHelper reads through the Shopify Admin API; Shopify Ireland Ltd.
          acts as a data processor under Art. 28 GDPR. On submission, the data
          listed in section 2 is sent to our own support endpoint on
          infinitecodes.de and opens a ticket in our self-hosted helpdesk; the
          notification email is dispatched via Google Workspace (Google Ireland
          Limited) as our email provider. Beyond this, no data is passed to third
          parties. The app is free of charge, so no payment data is processed.
        </p>

        <h2 style={h2Style}>6. Hosting</h2>
        <p>
          The app is hosted on servers in Germany. The processing of personal data
          is based on a data processing agreement with the hosting provider.
        </p>

        <h2 style={h2Style}>7. Your Rights</h2>
        <p>Under GDPR, you have the following rights:</p>
        <ul>
          <li>Right of access (Art. 15)</li>
          <li>Right to rectification (Art. 16)</li>
          <li>Right to erasure (Art. 17)</li>
          <li>Right to restriction of processing (Art. 18)</li>
          <li>Right to data portability (Art. 20)</li>
          <li>Right to object (Art. 21)</li>
          <li>Right to lodge a complaint with a supervisory authority (Art. 77)</li>
        </ul>
        <p>To exercise your rights: support@infinitecodes.de</p>

        <h2 style={h2Style}>8. Cookies</h2>
        <p>
          InfiniteHelper does not use tracking cookies. Storing and reading the
          technically necessary session cookies for Shopify authentication is
          permitted under Section 25(2) no. 2 TDDDG; the associated processing is
          based on Art. 6(1)(f) GDPR.
        </p>
      </>
    ),
  },
};

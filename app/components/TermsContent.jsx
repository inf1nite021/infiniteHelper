import { h2Style } from "./PrivacyContent";

/**
 * Nutzungsbedingungen fuer infiniteHelper. DE und EN, wie die
 * Datenschutzerklaerung. Massgeblich ist die deutsche Fassung (Ziffer 7).
 *
 * Bewusst KEIN Auftragsverarbeitungsvertrag. Ein AVV nach Art. 28 DSGVO
 * beschreibt, dass der Anbieter Daten IM AUFTRAG des Haendlers verarbeitet.
 * Hier ist es umgekehrt: Der Haendler schickt uns seine Kontaktdaten, damit
 * wir ihm ein Angebot machen - das ist unser eigener Zweck, wir sind
 * Verantwortlicher. Ein Vertrag, der das Gegenteil behauptet, waere schlechter
 * als keiner. Die Verarbeitung steht in der Datenschutzerklaerung.
 */
export const termsContent = {
  de: {
    title: "Nutzungsbedingungen",
    sub: "infiniteHelper · Stand 2026",
    body: (
      <>
        <p>
          Diese Nutzungsbedingungen regeln die Nutzung der Shopify-App
          infiniteHelper (die &quot;App&quot;), bereitgestellt von Gianluca Iacona,
          handelnd als infinitecodes (vormals infinitecodes solutions,
          infinitecodes-solutions.de), Rolshover Straße 70, 51105 Köln (der
          &quot;Anbieter&quot;), durch den Händler, der die App installiert (der
          &quot;Händler&quot;).
        </p>

        <h2 style={h2Style}>1. Vertragsschluss</h2>
        <p>
          Der Vertrag kommt zustande, wenn der Händler die App installiert. Mit
          der Installation nimmt der Händler diese Nutzungsbedingungen an.
        </p>

        <h2 style={h2Style}>2. Leistungsumfang</h2>
        <p>
          Die App durchsucht den Shop des Händlers nach Spuren installierter
          Apps und stellt das Ergebnis dar. Der Händler kann die Liste
          berichtigen und ergänzen und sie zusammen mit einer Nachricht als
          Anfrage an den Anbieter senden.
        </p>
        <p>
          <strong>Die Erkennung ist ausdrücklich unvollständig.</strong> Shopify
          erlaubt keiner App, die installierten Apps eines Shops aufzulisten;
          die App wertet deshalb nur Spuren aus, die manche Apps hinterlassen.
          Eine App, die ausschließlich die Admin-API nutzt, erscheint nicht. Der
          Anbieter schuldet weder Vollständigkeit noch Richtigkeit der
          erkannten Liste – sie ist ein Vorschlag, den der Händler prüft.
        </p>
        <p>
          Alle Zugriffsrechte der App sind Leserechte. Sie verändert nichts im
          Shop. Der Anbieter schuldet keine bestimmte Verfügbarkeit und ist auf
          die Shopify-Plattform angewiesen, deren Störungen außerhalb seines
          Einflussbereichs liegen.
        </p>

        <h2 style={h2Style}>3. Entgelte</h2>
        <p>
          Die App wird unentgeltlich bereitgestellt. Es fallen keine Entgelte an,
          und eine Abrechnung über Shopify findet nicht statt. Zahlungsdaten
          werden nicht verarbeitet. Aus einer Anfrage entsteht keine
          Zahlungspflicht; ein etwaiges Angebot des Anbieters ist freibleibend,
          und ein Auftrag kommt erst durch gesonderte Vereinbarung zustande.
        </p>

        <h2 style={h2Style}>4. Pflichten des Händlers</h2>
        <p>
          Der Händler stellt sicher, dass er zur Anfrage berechtigt ist und dass
          die von ihm angegebene Antwortadresse ihm zugeordnet ist. Er darf die
          App nicht rechtswidrig nutzen oder umgehen.
        </p>

        <h2 style={h2Style}>5. Datenschutz</h2>
        <p>
          Welche Daten die App verarbeitet, wozu und wie lange, steht in der
          Datenschutzerklärung. Der Anbieter verarbeitet die Anfrage zu eigenen
          Zwecken – der Beantwortung und der Vorbereitung eines Angebots – und
          ist dafür Verantwortlicher im Sinne der DSGVO. Eine Auftragsverarbeitung
          nach Art. 28 DSGVO findet nicht statt; ein
          Auftragsverarbeitungsvertrag ist deshalb nicht Bestandteil dieser
          Bedingungen.
        </p>

        <h2 style={h2Style}>6. Haftung</h2>
        <p>
          Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit
          sowie für Schäden aus der Verletzung des Lebens, des Körpers oder der
          Gesundheit. Bei einfacher Fahrlässigkeit haftet er nur bei Verletzung
          einer wesentlichen Vertragspflicht und nur begrenzt auf den
          vorhersehbaren, vertragstypischen Schaden. Für Entscheidungen, die der
          Händler auf Grundlage der erkannten App-Liste trifft, haftet der
          Anbieter nicht – siehe Ziffer 2. Die Haftung nach dem
          Produkthaftungsgesetz bleibt unberührt.
        </p>

        <h2 style={h2Style}>7. Laufzeit, Kündigung, Schlussbestimmungen</h2>
        <p>
          Der Vertrag läuft, solange die App installiert ist. Der Händler kann
          ihn jederzeit durch Deinstallation beenden; die in der App gespeicherten
          Daten werden dabei gelöscht. Es gilt deutsches Recht unter Ausschluss
          des UN-Kaufrechts. Ist der Händler Kaufmann im Sinne des HGB, ist
          Gerichtsstand Köln. Bei Abweichungen zwischen der deutschen und der
          englischen Fassung ist die deutsche Fassung maßgeblich.
        </p>
      </>
    ),
  },
  en: {
    title: "Terms of Use",
    sub: "infiniteHelper · As of 2026",
    body: (
      <>
        <p>
          These Terms of Use govern the use of the Shopify app infiniteHelper
          (the &quot;App&quot;), provided by Gianluca Iacona, trading as
          infinitecodes (formerly infinitecodes solutions,
          infinitecodes-solutions.de), Rolshover Straße 70, 51105 Cologne,
          Germany (the &quot;Provider&quot;), to the merchant who installs the App
          (the &quot;Merchant&quot;).
        </p>

        <h2 style={h2Style}>1. Conclusion of Contract</h2>
        <p>
          The contract is concluded when the Merchant installs the App. By
          installing it, the Merchant accepts these Terms of Use.
        </p>

        <h2 style={h2Style}>2. Scope of Services</h2>
        <p>
          The App searches the Merchant&apos;s shop for traces of installed apps
          and presents the result. The Merchant can correct and extend the list
          and send it, together with a message, as an enquiry to the Provider.
        </p>
        <p>
          <strong>The detection is expressly incomplete.</strong> Shopify does not
          allow any app to list the installed apps of a shop; the App therefore
          only evaluates traces that some apps leave behind. An app that uses the
          Admin API exclusively does not appear. The Provider owes neither
          completeness nor correctness of the detected list – it is a suggestion
          for the Merchant to review.
        </p>
        <p>
          All of the App&apos;s access scopes are read-only. It changes nothing in
          the shop. The Provider owes no particular availability and depends on
          the Shopify platform, whose outages are outside its control.
        </p>

        <h2 style={h2Style}>3. Fees</h2>
        <p>
          The App is provided free of charge. No fees apply and no billing takes
          place through Shopify. No payment data is processed. An enquiry creates
          no payment obligation; any offer by the Provider is without engagement,
          and an order comes about only through a separate agreement.
        </p>

        <h2 style={h2Style}>4. Merchant Obligations</h2>
        <p>
          The Merchant ensures that they are entitled to make the enquiry and that
          the reply address they provide belongs to them. The Merchant may not use
          or circumvent the App unlawfully.
        </p>

        <h2 style={h2Style}>5. Data Protection</h2>
        <p>
          Which data the App processes, for what purpose and for how long is set
          out in the Privacy Policy. The Provider processes the enquiry for its own
          purposes – answering it and preparing an offer – and is the controller
          for that within the meaning of the GDPR. No processing on behalf of the
          Merchant under Art. 28 GDPR takes place; a data processing agreement is
          therefore not part of these Terms.
        </p>

        <h2 style={h2Style}>6. Liability</h2>
        <p>
          The Provider is liable without limitation for intent and gross
          negligence, and for damage arising from injury to life, body or health.
          In cases of ordinary negligence it is liable only for breach of a
          material contractual obligation and only up to the foreseeable damage
          typical of the contract. The Provider is not liable for decisions the
          Merchant makes on the basis of the detected app list – see section 2.
          Liability under the German Product Liability Act remains unaffected.
        </p>

        <h2 style={h2Style}>7. Term, Termination, Final Provisions</h2>
        <p>
          The contract runs for as long as the App is installed. The Merchant may
          end it at any time by uninstalling; the data stored in the App is deleted
          in the process. German law applies, excluding the UN Convention on
          Contracts for the International Sale of Goods. If the Merchant is a
          merchant within the meaning of the German Commercial Code, the place of
          jurisdiction is Cologne. In case of discrepancies between the English and
          German versions, the German version prevails.
        </p>
      </>
    ),
  },
};

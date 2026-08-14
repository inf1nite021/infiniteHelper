import { useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { privacyContent } from "../components/PrivacyContent";
import { termsContent } from "../components/TermsContent";
import { contractLang, useLang } from "../i18n";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Datenschutz() {
  /*
    Kein eigener Umschalter: Im Adminbereich gilt die Sprache aus dem App-Nav.
    Zwei Umschalter auf einer Seite waeren eine Einladung, sie gegeneinander
    zu stellen. Die oeffentliche Seite unter /privacy hat einen eigenen - dort
    gibt es kein App-Nav.

    Die Datenschutzerklaerung folgt der Sprachwahl, die Nutzungsbedingungen
    nicht: Die gibt es nur auf EN und DE.
  */
  const { lang } = useLang();
  const c = privacyContent[lang] ?? privacyContent.en;
  const t = termsContent[contractLang(lang)];
  const stil = { maxWidth: 720, fontFamily: "system-ui, -apple-system, sans-serif", color: "#202223", lineHeight: 1.7 };

  return (
    <s-page heading={c.title}>
      <div style={stil}>{c.body}</div>
      <div style={{ ...stil, marginTop: "48px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>{t.title}</h1>
        {t.body}
        <p style={{ marginTop: 48, color: "#6d7175", fontSize: 13 }}>© 2026 infinitecodes</p>
      </div>
    </s-page>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => boundary.headers(headersArgs);

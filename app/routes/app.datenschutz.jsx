import { useState } from "react";
import { useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { LANGS, privacyContent } from "../components/PrivacyContent";
import { termsContent } from "../components/TermsContent";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Datenschutz() {
  const [lang, setLang] = useState("de");
  const c = privacyContent[lang];
  const t = termsContent[lang];
  const stil = { maxWidth: 720, fontFamily: "system-ui, -apple-system, sans-serif", color: "#202223", lineHeight: 1.7 };

  return (
    <s-page heading={c.title}>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginBottom: 16 }}>
        {LANGS.map((l) => (
          <s-button key={l.code} onClick={() => setLang(l.code)} {...(lang === l.code ? { variant: "primary" } : {})}>
            {l.label}
          </s-button>
        ))}
      </div>
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

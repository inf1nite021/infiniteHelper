import { useState } from "react";
import { LANGS, privacyContent } from "../components/PrivacyContent";
import { termsContent } from "../components/TermsContent";
import { contractLang } from "../i18n";

/*
  Oeffentliche Seite: Shopify verlangt fuer die Einreichung eine ohne Anmeldung
  erreichbare Datenschutzerklaerung. Deshalb ausserhalb von /app, ohne
  authenticate.admin - und ohne Polaris, das es hier nicht gibt.
*/
const knopf = (aktiv) => ({
  background: aktiv ? "#2596be" : "transparent",
  color: aktiv ? "#fff" : "#6d7175",
  border: `1px solid ${aktiv ? "#2596be" : "#e1e3e5"}`,
  borderRadius: 6, padding: "4px 10px", fontSize: 12, fontWeight: 600,
  cursor: "pointer", fontFamily: "inherit",
});

export default function PrivacyPolicy() {
  const [lang, setLang] = useState("de");
  const c = privacyContent[lang];
  /* Die Nutzungsbedingungen gibt es nur auf EN und DE. */
  const t = termsContent[contractLang(lang)];

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px", fontFamily: "system-ui, -apple-system, sans-serif", color: "#202223", lineHeight: 1.7 }}>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginBottom: 24 }}>
        {LANGS.map((l) => (
          <button key={l.code} onClick={() => setLang(l.code)} style={knopf(lang === l.code)}>
            {l.label}
          </button>
        ))}
      </div>

      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{c.title}</h1>
      <p style={{ color: "#6d7175", marginBottom: 40, fontSize: 14 }}>{c.sub}</p>
      {c.body}

      <h1 style={{ fontSize: 28, fontWeight: 700, margin: "56px 0 4px" }}>{t.title}</h1>
      <p style={{ color: "#6d7175", marginBottom: 40, fontSize: 14 }}>{t.sub}</p>
      {t.body}

      <p style={{ marginTop: 48, color: "#6d7175", fontSize: 13 }}>© 2026 infinitecodes</p>
    </div>
  );
}

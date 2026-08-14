import { redirect } from "react-router";

// Oeffentliche Startseite unter der App-Domain. Ruft Shopify die App auf, ist
// der shop-Parameter gesetzt und wir leiten direkt in die eingebettete App
// weiter. Ohne Parameter landet hier, wer die Domain direkt aufruft - dafuer
// die kurze Visitenkarte unten (gleiches Muster wie DiscountComposer).
export const loader = async ({ request }) => {
  const url = new URL(request.url);
  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }
  return null;
};

export default function Index() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f6f6f7", fontFamily: "system-ui, -apple-system, sans-serif", padding: "24px" }}>
      <div style={{ background: "#fff", border: "1px solid #e1e3e5", borderRadius: "12px", padding: "48px 40px", maxWidth: "440px", width: "100%", textAlign: "center" }}>

        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", borderRadius: "16px", background: "#f0f4ff", marginBottom: "24px" }}>
          <span style={{ fontSize: "32px" }}>📊</span>
        </div>

        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#202223", margin: "0 0 8px" }}>
          InfiniteHelper
        </h1>
        <p style={{ color: "#6d7175", margin: "0 0 32px", lineHeight: 1.5 }}>
          Behält die Preise deiner Wettbewerber im Blick und passt deine eigenen
          automatisch an - bis zur selbst gesetzten Preisuntergrenze, nie darunter.
        </p>

        <p style={{ color: "#6d7175", lineHeight: 1.5 }}>
          Diese App wird ausschließlich über den{" "}
          <a href="https://apps.shopify.com" style={{ color: "#2596be" }}>Shopify App Store</a>{" "}
          installiert.
        </p>

        <p style={{ marginTop: "32px", fontSize: "12px", color: "#8c9196" }}>
          <a href="/privacy" style={{ color: "#6d7175", textDecoration: "underline" }}>Datenschutz</a>
          {" · "}
          <a href="/dpa" style={{ color: "#6d7175", textDecoration: "underline" }}>AVV</a>
          {" · "}
          <a href="/help" style={{ color: "#6d7175", textDecoration: "underline" }}>Hilfe</a>
        </p>
      </div>
    </div>
  );
}

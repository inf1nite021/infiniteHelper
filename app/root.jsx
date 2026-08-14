import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        {/*
          Polaris setzt keine Dokumentschrift - es stylt ausschliesslich im
          Schattenbaum seiner eigenen Komponenten. Alles, was wir daneben selbst
          auszeichnen (Karten, Schaltflaechen, Tabellen), erbt deshalb vom body,
          und der stand ohne diese Regel auf dem Serifen-Standard des Browsers:
          im Test Times New Roman. Der Inter-Webfont darueber war geladen, wurde
          aber ausserhalb der Polaris-Komponenten nie benutzt.
        */}
        <style
          dangerouslySetInnerHTML={{
            __html:
              'html,body{font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif}',
          }}
        />
        <Meta />
        <Links />
        <script src="https://cdn.shopify.com/shopifycloud/polaris.js"></script>

      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

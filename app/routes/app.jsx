import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { authenticate } from "../shopify.server";
import { LangProvider, LangToggleButton, useLang } from "../i18n";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  // eslint-disable-next-line no-undef
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

/*
  Navigation und Sprachumschalter liegen in einer eigenen Komponente, weil
  useLang nur unterhalb des LangProvider gilt - in App selbst waere der
  Kontext noch nicht gesetzt.
*/
function Rahmen() {
  const { t } = useLang();

  return (
    <>
      {/*
        Genau ein s-app-nav. App Bridge stellt nur eine Navigationsleiste dar;
        laegen mehrere Bloecke nebeneinander, bliebe allein der letzte uebrig
        und alle Links davor waeren nicht erreichbar.
      */}
      <s-app-nav>
        <s-link href="/app">{t.nav.main}</s-link>
        <s-link href="/app/datenschutz">{t.nav.privacy}</s-link>
      </s-app-nav>
      <LangToggleButton />
      <Outlet />
    </>
  );
}

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <AppProvider embedded apiKey={apiKey}>
      <LangProvider>
        <Rahmen />
      </LangProvider>
    </AppProvider>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};

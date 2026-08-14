import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  // eslint-disable-next-line no-undef
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <AppProvider embedded apiKey={apiKey}>
      {/*
        Genau ein s-app-nav. App Bridge stellt nur eine Navigationsleiste dar;
        laegen mehrere Bloecke nebeneinander, bliebe allein der letzte uebrig
        und alle Links davor waeren nicht erreichbar.

        Die Leiste fehlte anfangs, weil die App nur eine Seite hatte. Mit der
        Datenschutzseite kam eine zweite dazu - und war von innen ueberhaupt
        nicht zu erreichen, ausser ueber den Verweis im Hinweistext ueber dem
        Absende-Knopf.
      */}
      <s-app-nav>
        <s-link href="/app">Apps erfassen</s-link>
        <s-link href="/app/datenschutz">Datenschutz</s-link>
      </s-app-nav>
      <Outlet />
    </AppProvider>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};

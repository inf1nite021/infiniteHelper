import { redirect } from "react-router";

/*
  Frueher stand hier das Anmeldeformular aus der Shopify-Vorlage: ein Feld
  "Shop domain" mit dem Platzhalter example.myshopify.com. Das verstoesst
  gegen Anforderung 2.3.1 des App Store ("Initiate installation from a
  Shopify-owned surface") - eine App darf die myshopify-Adresse nicht
  abfragen. Die Vorlage meint damit Custom- und Unlisted-Apps; infiniteHelper
  laeuft mit AppDistribution.AppStore und bekommt den Shop ohnehin ueber
  Managed Install, das Formular war also ohne Funktion.

  Die Route bleibt bestehen, statt geloescht zu werden. In der Bibliothek
  leitet validateShopAndHostParams auf genau diesen Pfad um, wenn shop oder
  host fehlen (auth.loginPath = authPathPrefix + "/login"). Ein 404 waere dort
  eine Sackgasse - untersagt durch Anforderung 2.3.3. Die Route ist Vorsorge,
  keine Notwendigkeit: Die eingebettete Strategie antwortet vorher mit 410.

  Ziel ist die oeffentliche Startseite. Eine Schleife entsteht nicht - die
  Umleitung traegt keine Parameter, und ohne shop-Parameter zeigt die
  Startseite ihre Visitenkarte, statt nach /app zu leiten.

  Kein authenticate.admin hier: Die Bibliothek erkennt einen solchen Aufruf
  vom Anmeldepfad aus und antwortet mit 500 statt mit einer Umleitung.

  Uebernommen aus MarginMaster (Commit 514bf3b), damit die Apps an dieser
  Stelle nicht auseinanderlaufen.
*/
export const loader = async () => {
  return redirect("/");
};

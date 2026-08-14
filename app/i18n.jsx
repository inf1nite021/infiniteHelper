import { createContext, useContext, useEffect, useState } from "react";

/**
 * Sprachen der Oberflaeche: de, en, es, fr, pt - dieselben fuenf wie in
 * Selfix, DiscountComposer und MarginMaster, mit derselben Mechanik. Wer
 * zwischen den Apps wechselt, soll nicht umdenken muessen.
 *
 * Die Nutzungsbedingungen gehen diesen Weg NICHT mit: Sie liegen nur auf EN
 * und DE, weil jede weitere Fassung ein weiterer rechtsverbindlicher Text
 * waere. Die Datenschutzerklaerung dagegen gibt es in allen fuenf - sie ist
 * eine Information, kein Vertrag. Fuer die Vertragssprache siehe
 * contractLang() am Ende dieser Datei.
 */

const de = {
  nav: { main: "Apps erfassen", privacy: "Datenschutz" },
  heading: "Welche Apps sind zurzeit in Verwendung?",
  intro:
    "infiniteHelper sieht nach, welche Apps in deinem Shop installiert sind und schickt uns die Liste zusammen mit deiner Nachricht. Daraus sagen wir dir, was sich durch eine einzige eigene App ersetzen ließe.",
  again: (datum) =>
    `Du hast am ${datum} schon einmal angefragt. Eine weitere Anfrage ist kein Problem – schreib gern dazu, was sich geändert hat.`,
  apps: {
    heading: (n) => `Gefundene Apps (${n})`,
    check: "infiniteHelper hat folgende Apps erkannt. Bitte überprüfe die Liste.",
    empty: "Noch nichts erkannt – trag deine Apps unten selbst ein.",
    addLabel: "Fehlt eine App? Namen eintragen und einfügen",
    addPlaceholder: "z. B. Klaviyo",
    addButton: "Einfügen",
  },
  quellen: {
    script: "Skript im Shop",
    theme: "Block im Theme",
    versand: "Versanddienst",
    fulfillment: "Fulfillment-Dienst",
    rabatt: "Rabatt",
    metafeld: "Metafeld",
    selbst: "selbst ergänzt",
  },
  data: {
    heading: "Deine Daten",
    locked:
      "Die grauen Felder kommen automatisch aus deinem Shop und lassen sich nicht ändern – sie ordnen deine Anfrage eindeutig zu.",
    firstName: "Vorname",
    lastName: "Nachname",
    shop: "Shop",
    shopId: "Shop-ID",
    userId: "Shopify-Benutzer-ID",
    email: "E-Mail für Rückfragen",
    emailPlaceholder: "An welche Adresse sollen wir antworten?",
    message: "Deine Nachricht",
    messagePlaceholder: "Was stört dich an deinem heutigen App-Stapel?",
    counter: (rest, max) => `${rest} von ${max} Zeichen übrig`,
  },
  consent:
    "Mit dem Senden erhalten wir die oben gezeigten Angaben, deine Nachricht und die ausgewählte App-Liste, um dir zu antworten. Einzelheiten in der",
  consentLink: "Datenschutzerklärung",
  consentTail:
    ". Wir sind dafür Verantwortlicher im Sinne der DSGVO – es findet keine Auftragsverarbeitung statt.",
  submit: "Anfrage senden",
  sent: {
    heading: "Anfrage gesendet",
    banner: "Danke – wir haben deine Anfrage erhalten.",
    body: (mail) => `Wir melden uns per E-Mail an ${mail}. In der Regel innerhalb von 24–48 Stunden.`,
  },
  errors: {
    emailMissing: "Bitte eine E-Mail-Adresse für Rückfragen eintragen.",
    emailInvalid: "Diese E-Mail-Adresse sieht nicht gültig aus. Beispiel: name@firma.de",
    emailLong: "Die E-Mail-Adresse ist zu lang.",
    messageLong: "Die Nachricht ist zu lang.",
    endpointMissing: "Der Versand ist nicht eingerichtet (SUPPORT_ENDPOINT fehlt).",
    sendFailed:
      "Konnte nicht gesendet werden. Bitte erneut versuchen oder an support@infinitecodes.de schreiben.",
    unknown: "Es ist etwas schiefgegangen.",
  },
};

const en = {
  nav: { main: "Collect apps", privacy: "Privacy" },
  heading: "Which apps are you currently using?",
  intro:
    "infiniteHelper checks which apps are installed in your shop and sends us the list together with your message. From that we tell you what a single custom app could replace.",
  again: (datum) =>
    `You already sent an enquiry on ${datum}. Another one is no problem – just tell us what has changed.`,
  apps: {
    heading: (n) => `Apps found (${n})`,
    check: "infiniteHelper detected the following apps. Please check the list.",
    empty: "Nothing detected yet – add your apps below.",
    addLabel: "Is an app missing? Enter its name and add it",
    addPlaceholder: "e.g. Klaviyo",
    addButton: "Add",
  },
  quellen: {
    script: "Script in the shop",
    theme: "Block in the theme",
    versand: "Carrier service",
    fulfillment: "Fulfillment service",
    rabatt: "Discount",
    metafeld: "Metafield",
    selbst: "added by you",
  },
  data: {
    heading: "Your details",
    locked:
      "The grey fields come from your shop automatically and cannot be changed – they identify your enquiry unambiguously.",
    firstName: "First name",
    lastName: "Last name",
    shop: "Shop",
    shopId: "Shop ID",
    userId: "Shopify user ID",
    email: "Email for our reply",
    emailPlaceholder: "Which address should we reply to?",
    message: "Your message",
    messagePlaceholder: "What bothers you about your current app stack?",
    counter: (rest, max) => `${rest} of ${max} characters left`,
  },
  consent:
    "On sending, we receive the details shown above, your message and the selected app list in order to reply to you. Details in the",
  consentLink: "privacy policy",
  consentTail:
    ". We are the controller for this within the meaning of the GDPR – no processing on your behalf takes place.",
  submit: "Send enquiry",
  sent: {
    heading: "Enquiry sent",
    banner: "Thank you – we have received your enquiry.",
    body: (mail) => `We will reply by email to ${mail}, usually within 24–48 hours.`,
  },
  errors: {
    emailMissing: "Please enter an email address for our reply.",
    emailInvalid: "This email address does not look valid. Example: name@company.com",
    emailLong: "The email address is too long.",
    messageLong: "The message is too long.",
    endpointMissing: "Sending is not configured (SUPPORT_ENDPOINT missing).",
    sendFailed: "Could not be sent. Please try again or write to support@infinitecodes.de.",
    unknown: "Something went wrong.",
  },
};

const es = {
  nav: { main: "Registrar apps", privacy: "Privacidad" },
  heading: "¿Qué apps utilizas actualmente?",
  intro:
    "infiniteHelper comprueba qué apps están instaladas en tu tienda y nos envía la lista junto con tu mensaje. A partir de ahí te decimos qué podría sustituir una sola app propia.",
  again: (datum) =>
    `Ya enviaste una consulta el ${datum}. Otra no es problema: cuéntanos qué ha cambiado.`,
  apps: {
    heading: (n) => `Apps encontradas (${n})`,
    check: "infiniteHelper ha detectado las siguientes apps. Revisa la lista, por favor.",
    empty: "Todavía no se ha detectado nada: añade tus apps abajo.",
    addLabel: "¿Falta alguna app? Escribe su nombre y añádela",
    addPlaceholder: "p. ej. Klaviyo",
    addButton: "Añadir",
  },
  quellen: {
    script: "Script en la tienda",
    theme: "Bloque en el tema",
    versand: "Servicio de envío",
    fulfillment: "Servicio de fulfillment",
    rabatt: "Descuento",
    metafeld: "Metacampo",
    selbst: "añadida por ti",
  },
  data: {
    heading: "Tus datos",
    locked:
      "Los campos grises provienen automáticamente de tu tienda y no se pueden cambiar: identifican tu consulta de forma inequívoca.",
    firstName: "Nombre",
    lastName: "Apellidos",
    shop: "Tienda",
    shopId: "ID de tienda",
    userId: "ID de usuario de Shopify",
    email: "Correo para nuestra respuesta",
    emailPlaceholder: "¿A qué dirección respondemos?",
    message: "Tu mensaje",
    messagePlaceholder: "¿Qué te molesta de tu conjunto de apps actual?",
    counter: (rest, max) => `Quedan ${rest} de ${max} caracteres`,
  },
  consent:
    "Al enviar recibimos los datos mostrados arriba, tu mensaje y la lista de apps seleccionada para poder responderte. Detalles en la",
  consentLink: "política de privacidad",
  consentTail:
    ". Somos responsables del tratamiento en el sentido del RGPD: no hay encargo de tratamiento.",
  submit: "Enviar consulta",
  sent: {
    heading: "Consulta enviada",
    banner: "Gracias: hemos recibido tu consulta.",
    body: (mail) => `Te responderemos por correo a ${mail}, normalmente en 24–48 horas.`,
  },
  errors: {
    emailMissing: "Introduce una dirección de correo para nuestra respuesta.",
    emailInvalid: "Esta dirección de correo no parece válida. Ejemplo: nombre@empresa.com",
    emailLong: "La dirección de correo es demasiado larga.",
    messageLong: "El mensaje es demasiado largo.",
    endpointMissing: "El envío no está configurado (falta SUPPORT_ENDPOINT).",
    sendFailed: "No se pudo enviar. Inténtalo de nuevo o escribe a support@infinitecodes.de.",
    unknown: "Algo ha salido mal.",
  },
};

const fr = {
  nav: { main: "Recenser les apps", privacy: "Confidentialité" },
  heading: "Quelles apps utilisez-vous actuellement ?",
  intro:
    "infiniteHelper regarde quelles apps sont installées dans votre boutique et nous envoie la liste avec votre message. Nous vous disons ensuite ce qu’une seule app sur mesure pourrait remplacer.",
  again: (datum) =>
    `Vous avez déjà envoyé une demande le ${datum}. Une autre ne pose aucun problème – dites-nous ce qui a changé.`,
  apps: {
    heading: (n) => `Apps trouvées (${n})`,
    check: "infiniteHelper a détecté les apps suivantes. Merci de vérifier la liste.",
    empty: "Rien de détecté pour l’instant – ajoutez vos apps ci-dessous.",
    addLabel: "Une app manque ? Saisissez son nom et ajoutez-la",
    addPlaceholder: "p. ex. Klaviyo",
    addButton: "Ajouter",
  },
  quellen: {
    script: "Script dans la boutique",
    theme: "Bloc dans le thème",
    versand: "Service de transport",
    fulfillment: "Service de fulfillment",
    rabatt: "Remise",
    metafeld: "Métachamp",
    selbst: "ajoutée par vous",
  },
  data: {
    heading: "Vos données",
    locked:
      "Les champs grisés proviennent automatiquement de votre boutique et ne peuvent pas être modifiés : ils identifient votre demande sans ambiguïté.",
    firstName: "Prénom",
    lastName: "Nom",
    shop: "Boutique",
    shopId: "ID de boutique",
    userId: "ID utilisateur Shopify",
    email: "E-mail pour notre réponse",
    emailPlaceholder: "À quelle adresse devons-nous répondre ?",
    message: "Votre message",
    messagePlaceholder: "Qu’est-ce qui vous gêne dans votre pile d’apps actuelle ?",
    counter: (rest, max) => `${rest} caractères restants sur ${max}`,
  },
  consent:
    "En envoyant, nous recevons les informations affichées ci-dessus, votre message et la liste d’apps sélectionnée afin de vous répondre. Détails dans la",
  consentLink: "politique de confidentialité",
  consentTail:
    ". Nous en sommes le responsable de traitement au sens du RGPD – il n’y a pas de sous-traitance.",
  submit: "Envoyer la demande",
  sent: {
    heading: "Demande envoyée",
    banner: "Merci – nous avons bien reçu votre demande.",
    body: (mail) => `Nous répondrons par e-mail à ${mail}, en général sous 24 à 48 heures.`,
  },
  errors: {
    emailMissing: "Merci d’indiquer une adresse e-mail pour notre réponse.",
    emailInvalid: "Cette adresse e-mail ne semble pas valide. Exemple : nom@entreprise.fr",
    emailLong: "L’adresse e-mail est trop longue.",
    messageLong: "Le message est trop long.",
    endpointMissing: "L’envoi n’est pas configuré (SUPPORT_ENDPOINT manquant).",
    sendFailed: "Envoi impossible. Réessayez ou écrivez à support@infinitecodes.de.",
    unknown: "Quelque chose s’est mal passé.",
  },
};

const pt = {
  nav: { main: "Registar apps", privacy: "Privacidade" },
  heading: "Que apps utiliza atualmente?",
  intro:
    "O infiniteHelper verifica que apps estão instaladas na sua loja e envia-nos a lista juntamente com a sua mensagem. A partir daí dizemos-lhe o que uma única app própria poderia substituir.",
  again: (datum) =>
    `Já enviou um pedido em ${datum}. Outro não é problema – diga-nos o que mudou.`,
  apps: {
    heading: (n) => `Apps encontradas (${n})`,
    check: "O infiniteHelper detetou as seguintes apps. Verifique a lista, por favor.",
    empty: "Ainda não foi detetado nada – acrescente as suas apps abaixo.",
    addLabel: "Falta alguma app? Escreva o nome e acrescente",
    addPlaceholder: "por ex. Klaviyo",
    addButton: "Acrescentar",
  },
  quellen: {
    script: "Script na loja",
    theme: "Bloco no tema",
    versand: "Serviço de envio",
    fulfillment: "Serviço de fulfillment",
    rabatt: "Desconto",
    metafeld: "Metacampo",
    selbst: "acrescentada por si",
  },
  data: {
    heading: "Os seus dados",
    locked:
      "Os campos cinzentos vêm automaticamente da sua loja e não podem ser alterados: identificam o seu pedido de forma inequívoca.",
    firstName: "Nome próprio",
    lastName: "Apelido",
    shop: "Loja",
    shopId: "ID da loja",
    userId: "ID de utilizador Shopify",
    email: "E-mail para a nossa resposta",
    emailPlaceholder: "Para que endereço devemos responder?",
    message: "A sua mensagem",
    messagePlaceholder: "O que o incomoda no seu conjunto de apps atual?",
    counter: (rest, max) => `Faltam ${rest} de ${max} caracteres`,
  },
  consent:
    "Ao enviar, recebemos os dados apresentados acima, a sua mensagem e a lista de apps selecionada para lhe podermos responder. Detalhes na",
  consentLink: "política de privacidade",
  consentTail:
    ". Somos responsáveis pelo tratamento nos termos do RGPD – não há subcontratação.",
  submit: "Enviar pedido",
  sent: {
    heading: "Pedido enviado",
    banner: "Obrigado – recebemos o seu pedido.",
    body: (mail) => `Responderemos por e-mail para ${mail}, normalmente em 24–48 horas.`,
  },
  errors: {
    emailMissing: "Indique um endereço de e-mail para a nossa resposta.",
    emailInvalid: "Este endereço de e-mail não parece válido. Exemplo: nome@empresa.pt",
    emailLong: "O endereço de e-mail é demasiado longo.",
    messageLong: "A mensagem é demasiado longa.",
    endpointMissing: "O envio não está configurado (falta SUPPORT_ENDPOINT).",
    sendFailed: "Não foi possível enviar. Tente novamente ou escreva para support@infinitecodes.de.",
    unknown: "Algo correu mal.",
  },
};

const TRANSLATIONS = { de, en, es, fr, pt };

const LANG_OPTIONS = [
  { code: "de", label: "Deutsch" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "pt", label: "Português" },
];

const LangCtx = createContext({ lang: "de", t: de, setLang: () => {} });

// eslint-disable-next-line react/prop-types -- reiner Durchreicher, keine Datenprops
export function LangProvider({ children }) {
  /*
    Erst nach dem Aufbau aus dem Speicher lesen, nicht schon beim ersten
    Rendern: Der Server kennt localStorage nicht, und eine dort abweichende
    Startsprache liesse die Seite beim Andocken neu aufbauen.
  */
  const [lang, setLangState] = useState("de");

  useEffect(() => {
    const gespeichert = localStorage.getItem("ihl_lang");
    if (gespeichert && gespeichert in TRANSLATIONS) setLangState(gespeichert);
  }, []);

  const setLang = (naechste) => {
    setLangState(naechste);
    localStorage.setItem("ihl_lang", naechste);
  };

  return (
    <LangCtx.Provider value={{ lang, t: TRANSLATIONS[lang] ?? de, setLang }}>
      {children}
    </LangCtx.Provider>
  );
}

export function useLang() {
  return useContext(LangCtx);
}

/**
 * Fuer die Nutzungsbedingungen: Es gibt sie nur auf EN und DE. Alles ausser
 * Deutsch bekommt die englische Fassung - lieber ein Text, den der Haendler
 * versteht, als einer in einer Sprache, die er womoeglich nicht spricht.
 */
export function contractLang(lang) {
  return lang === "de" ? "de" : "en";
}

export function LangToggleButton() {
  const { lang, setLang } = useLang();
  const aktuell = LANG_OPTIONS.find((l) => l.code === lang);
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 16px 0" }}>
      <s-button commandFor="ihl-lang-menu">{aktuell?.label ?? lang.toUpperCase()}</s-button>
      <s-menu id="ihl-lang-menu">
        {LANG_OPTIONS.map((l) => (
          <s-button key={l.code} onClick={() => setLang(l.code)}>
            {l.label}
          </s-button>
        ))}
      </s-menu>
    </div>
  );
}

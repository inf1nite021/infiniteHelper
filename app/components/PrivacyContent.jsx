export const h2Style = {
  fontSize: "18px",
  fontWeight: 600,
  marginTop: "36px",
  marginBottom: "8px",
};

/**
 * Datenschutzerklaerung fuer infiniteHelper.
 *
 * Fuenf Sprachen, dieselben wie in Selfix, DiscountComposer und MarginMaster.
 * Anfangs lagen hier nur DE und EN, solange die Oberflaeche einsprachig war -
 * eine Datenschutzerklaerung in fuenf Sprachen neben einer deutschen App waere
 * dieselbe Ungereimtheit gewesen, die bei MarginMaster aufgefallen ist. Seit
 * die Oberflaeche fuenfsprachig ist, zieht sie nach.
 *
 * Die Nutzungsbedingungen bleiben bei EN und DE: Das ist ein Vertragstext,
 * und jede weitere Fassung ist ein weiterer rechtsverbindlicher Text.
 *
 * WICHTIG: Ziffer 2 muss die sechs Quellen der Spurenerkennung nennen. Die App
 * liest mehr Bereiche des Shops als jede andere hier, und der Haendler soll
 * das nicht erst aus der Scope-Liste bei der Installation erfahren.
 */
export const LANGS = [
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
  { code: "es", label: "ES" },
  { code: "fr", label: "FR" },
  { code: "pt", label: "PT" },
];

export const privacyContent = {
  de: {
    title: "Datenschutzerklärung",
    sub: "infiniteHelper · Stand 2026",
    body: (
      <>
        <h2 style={h2Style}>1. Verantwortlicher</h2>
        <p>
          Gianluca Iacona (infinitecodes)<br />
          Rolshover Straße 70<br />
          51105 Köln, Nordrhein-Westfalen<br />
          Deutschland<br />
          E-Mail: support@infinitecodes.de
        </p>

        <h2 style={h2Style}>2. Erhobene Daten</h2>
        <p>
          infiniteHelper sucht in deinem Shop nach Spuren installierter Apps und
          schickt das Ergebnis zusammen mit deiner Anfrage an uns. Dabei werden
          folgende Daten verarbeitet:
        </p>
        <ul>
          <li>Shop-Domain, Shopify Access Token und Session-Metadaten (zur Authentifizierung)</li>
          <li>
            Spuren installierter Apps aus sechs Quellen deines Shops: eingebundene
            Skripte (deren Adresse den Anbieter nennt), App-Blöcke im aktiven
            Theme, registrierte Versanddienste, registrierte Fulfillment-Dienste,
            Rabatte aus App-Funktionen und Metafeld-Namensräume der Form
            <code> app--…</code>
          </li>
          <li>Vor- und Nachname des Shop-Inhabers, Shop-ID und Shopify-Benutzer-ID</li>
          <li>Die von dir eingetragene Antwortadresse und deine Nachricht</li>
          <li>
            Ein Vermerk über die gesendete Anfrage: Shop, Zeitpunkt und zwei
            Anzahlen (gefundene und gemeldete Apps)
          </li>
        </ul>
        <p>
          infiniteHelper verarbeitet <strong>keine personenbezogenen Kundendaten</strong> –
          der App fehlen die Zugriffsrechte, um Kund:innen oder Bestellungen
          überhaupt zu lesen. Sie kann auch keine Produkte, Preise oder Inhalte
          deines Shops verändern; alle Rechte sind Leserechte.
        </p>

        <h2 style={h2Style}>3. Zweck und Rechtsgrundlage</h2>
        <p>
          Zweck ist die Beantwortung deiner Anfrage und die Vorbereitung eines
          Angebots. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO – vorvertragliche
          Maßnahmen, die auf deine Anfrage hin erfolgen. Ohne dein Absenden des
          Formulars verlässt kein Wert deinen Shop: Die Spurensuche läuft in der
          App, und erst der Klick auf „Anfrage senden“ übermittelt etwas an uns.
        </p>

        <h2 style={h2Style}>4. Speicherdauer</h2>
        <p>
          Name, Antwortadresse, Nachricht und die App-Liste liegen in unserem
          Helpdesk und bleiben dort, solange es zur Bearbeitung und zur Erfüllung
          gesetzlicher Aufbewahrungspflichten erforderlich ist. In der App selbst
          bleibt nur der Vermerk aus Ziffer 2 – Shop, Zeitpunkt, zwei Anzahlen.
          Er wird bei der Deinstallation gelöscht. Weder Name noch Adresse noch
          Nachricht werden in der App gespeichert.
        </p>

        <h2 style={h2Style}>5. Weitergabe an Dritte</h2>
        <p>
          infiniteHelper liest über die Shopify Admin API; Shopify Ireland Ltd.
          agiert dabei als Auftragsverarbeiter gemäß Art. 28 DSGVO. Beim Absenden
          gehen die unter Ziffer 2 genannten Daten an unseren eigenen
          Support-Endpunkt auf infinitecodes.de und eröffnen ein Ticket in unserem
          selbst betriebenen Helpdesk; die Benachrichtigungs-E-Mail wird über
          Google Workspace (Google Ireland Limited) als unseren E-Mail-Anbieter
          versandt. Darüber hinaus werden keine Daten an Dritte weitergegeben. Die
          App ist kostenlos, Zahlungsdaten werden nicht verarbeitet.
        </p>

        <h2 style={h2Style}>6. Hosting</h2>
        <p>
          Die App wird auf Servern in Deutschland gehostet. Die Verarbeitung
          personenbezogener Daten erfolgt auf Basis eines
          Auftragsverarbeitungsvertrags mit dem Hoster.
        </p>

        <h2 style={h2Style}>7. Deine Rechte</h2>
        <p>Du hast nach DSGVO folgende Rechte:</p>
        <ul>
          <li>Auskunft über gespeicherte Daten (Art. 15)</li>
          <li>Berichtigung unrichtiger Daten (Art. 16)</li>
          <li>Löschung deiner Daten (Art. 17)</li>
          <li>Einschränkung der Verarbeitung (Art. 18)</li>
          <li>Datenübertragbarkeit (Art. 20)</li>
          <li>Widerspruch gegen die Verarbeitung (Art. 21)</li>
          <li>Beschwerde bei einer Aufsichtsbehörde (Art. 77)</li>
        </ul>
        <p>Zur Ausübung deiner Rechte: support@infinitecodes.de</p>

        <h2 style={h2Style}>8. Cookies</h2>
        <p>
          infiniteHelper verwendet keine Tracking-Cookies. Das Speichern und
          Auslesen der technisch notwendigen Session-Cookies für die
          Shopify-Authentifizierung ist nach § 25 Abs. 2 Nr. 2 TDDDG zulässig;
          die damit verbundene Verarbeitung stützt sich auf Art. 6 Abs. 1 lit. f
          DSGVO.
        </p>
      </>
    ),
  },
  en: {
    title: "Privacy Policy",
    sub: "infiniteHelper · As of 2026",
    body: (
      <>
        <h2 style={h2Style}>1. Data Controller</h2>
        <p>
          Gianluca Iacona (infinitecodes)<br />
          Rolshover Straße 70<br />
          51105 Cologne, North Rhine-Westphalia<br />
          Germany<br />
          Email: support@infinitecodes.de
        </p>

        <h2 style={h2Style}>2. Data Collected</h2>
        <p>
          infiniteHelper looks for traces of installed apps in your shop and sends
          the result to us together with your enquiry. The following data is
          processed:
        </p>
        <ul>
          <li>Shop domain, Shopify access token and session metadata (for authentication)</li>
          <li>
            Traces of installed apps from six sources in your shop: embedded
            scripts (whose address names the vendor), app blocks in the active
            theme, registered carrier services, registered fulfillment services,
            discounts created by app functions, and metafield namespaces of the
            form <code>app--…</code>
          </li>
          <li>First and last name of the shop owner, shop ID and Shopify user ID</li>
          <li>The reply address you enter and your message</li>
          <li>
            A record of the enquiry sent: shop, timestamp and two counts (apps
            found and apps reported)
          </li>
        </ul>
        <p>
          infiniteHelper processes no <strong>personal customer data</strong> – the
          app does not hold the access scopes required to read customers or orders.
          Nor can it change any products, prices or content in your shop; every
          scope it holds is read-only.
        </p>

        <h2 style={h2Style}>3. Purpose and Legal Basis</h2>
        <p>
          The purpose is to answer your enquiry and prepare an offer. The legal
          basis is Art. 6(1)(b) GDPR – pre-contractual measures taken at your
          request. Nothing leaves your shop until you submit the form: the trace
          detection runs inside the app, and only the click on “Send enquiry”
          transmits anything to us.
        </p>

        <h2 style={h2Style}>4. Retention Period</h2>
        <p>
          Name, reply address, message and the app list are held in our helpdesk
          for as long as is necessary to handle them and to meet statutory
          retention obligations. Inside the app itself only the record described in
          section 2 remains – shop, timestamp, two counts – and it is deleted when
          you uninstall. Neither name nor address nor message is stored in the app.
        </p>

        <h2 style={h2Style}>5. Disclosure to Third Parties</h2>
        <p>
          infiniteHelper reads through the Shopify Admin API; Shopify Ireland Ltd.
          acts as a data processor under Art. 28 GDPR. On submission, the data
          listed in section 2 is sent to our own support endpoint on
          infinitecodes.de and opens a ticket in our self-hosted helpdesk; the
          notification email is dispatched via Google Workspace (Google Ireland
          Limited) as our email provider. Beyond this, no data is passed to third
          parties. The app is free of charge, so no payment data is processed.
        </p>

        <h2 style={h2Style}>6. Hosting</h2>
        <p>
          The app is hosted on servers in Germany. The processing of personal data
          is based on a data processing agreement with the hosting provider.
        </p>

        <h2 style={h2Style}>7. Your Rights</h2>
        <p>Under GDPR, you have the following rights:</p>
        <ul>
          <li>Right of access (Art. 15)</li>
          <li>Right to rectification (Art. 16)</li>
          <li>Right to erasure (Art. 17)</li>
          <li>Right to restriction of processing (Art. 18)</li>
          <li>Right to data portability (Art. 20)</li>
          <li>Right to object (Art. 21)</li>
          <li>Right to lodge a complaint with a supervisory authority (Art. 77)</li>
        </ul>
        <p>To exercise your rights: support@infinitecodes.de</p>

        <h2 style={h2Style}>8. Cookies</h2>
        <p>
          infiniteHelper does not use tracking cookies. Storing and reading the
          technically necessary session cookies for Shopify authentication is
          permitted under Section 25(2) no. 2 TDDDG; the associated processing is
          based on Art. 6(1)(f) GDPR.
        </p>
      </>
    ),
  },
  es: {
    title: "Política de Privacidad",
    sub: "infiniteHelper · Actualizado en 2026",
    body: (
      <>
        <h2 style={h2Style}>1. Responsable del tratamiento</h2>
        <p>
          Gianluca Iacona (infinitecodes)<br />
          Rolshover Straße 70<br />
          51105 Colonia, Renania del Norte-Westfalia<br />
          Alemania<br />
          Correo electrónico: support@infinitecodes.de
        </p>

        <h2 style={h2Style}>2. Datos recopilados</h2>
        <p>
          infiniteHelper busca en tu tienda rastros de apps instaladas y nos envía
          el resultado junto con tu consulta. Se procesan los siguientes datos:
        </p>
        <ul>
          <li>Dominio de la tienda, token de acceso de Shopify y metadatos de sesión (para la autenticación)</li>
          <li>
            Rastros de apps instaladas procedentes de seis fuentes de tu tienda:
            scripts incrustados (cuya dirección nombra al proveedor), bloques de app
            en el tema activo, servicios de envío registrados, servicios de
            fulfillment registrados, descuentos creados por funciones de app y
            espacios de nombres de metacampos con la forma <code>app--…</code>
          </li>
          <li>Nombre y apellidos del propietario de la tienda, ID de tienda e ID de usuario de Shopify</li>
          <li>La dirección de respuesta que introduzcas y tu mensaje</li>
          <li>
            Un registro de la consulta enviada: tienda, fecha y dos recuentos (apps
            encontradas y apps comunicadas)
          </li>
        </ul>
        <p>
          infiniteHelper no procesa <strong>datos personales de clientes</strong>: la
          app no dispone de los permisos necesarios para leer clientes o pedidos.
          Tampoco puede modificar productos, precios ni contenidos de tu tienda;
          todos sus permisos son de solo lectura.
        </p>

        <h2 style={h2Style}>3. Finalidad y base jurídica</h2>
        <p>
          La finalidad es responder a tu consulta y preparar una oferta. La base
          jurídica es el Art. 6, apartado 1, letra b) del RGPD: medidas
          precontractuales adoptadas a petición tuya. Nada sale de tu tienda hasta
          que envías el formulario: la detección se ejecuta dentro de la app, y solo
          el clic en «Enviar consulta» transmite algo.
        </p>

        <h2 style={h2Style}>4. Período de conservación</h2>
        <p>
          El nombre, la dirección de respuesta, el mensaje y la lista de apps se
          conservan en nuestro helpdesk mientras sea necesario para tramitarlos y
          para cumplir las obligaciones legales de conservación. Dentro de la app
          solo queda el registro del apartado 2: tienda, fecha y dos recuentos. Se
          elimina al desinstalar. Ni el nombre ni la dirección ni el mensaje se
          guardan en la app.
        </p>

        <h2 style={h2Style}>5. Divulgación a terceros</h2>
        <p>
          infiniteHelper lee a través de la API de administración de Shopify; la
          Shopify Ireland Ltd. actúa como encargada del tratamiento conforme al Art.
          28 del RGPD. Al enviar, los datos indicados en el apartado 2 se transmiten
          a nuestro propio punto de soporte en infinitecodes.de y abren un ticket en
          nuestro helpdesk autoalojado; el correo de notificación se envía a través
          de Google Workspace (Google Ireland Limited), nuestro proveedor de correo.
          Más allá de esto, no se ceden datos a terceros. La app es gratuita, por lo
          que no se procesan datos de pago.
        </p>

        <h2 style={h2Style}>6. Alojamiento</h2>
        <p>
          La app se aloja en servidores en Alemania. El tratamiento de datos
          personales se basa en un acuerdo de tratamiento con el proveedor de
          alojamiento.
        </p>

        <h2 style={h2Style}>7. Sus derechos</h2>
        <p>Conforme al RGPD, usted tiene los siguientes derechos:</p>
        <ul>
          <li>Derecho de acceso (Art. 15)</li>
          <li>Derecho de rectificación (Art. 16)</li>
          <li>Derecho de supresión (Art. 17)</li>
          <li>Derecho a la limitación del tratamiento (Art. 18)</li>
          <li>Derecho a la portabilidad de los datos (Art. 20)</li>
          <li>Derecho de oposición (Art. 21)</li>
          <li>Derecho a presentar una reclamación ante una autoridad de control (Art. 77)</li>
        </ul>
        <p>Para ejercer sus derechos: support@infinitecodes.de</p>

        <h2 style={h2Style}>8. Cookies</h2>
        <p>
          infiniteHelper no utiliza cookies de seguimiento. El almacenamiento y la
          lectura de las cookies de sesión técnicamente necesarias para la
          autenticación de Shopify están permitidos conforme al § 25, apartado 2,
          n.º 2 de la TDDDG alemana; el tratamiento asociado se basa en el Art. 6,
          apartado 1, letra f) del RGPD.
        </p>
      </>
    ),
  },
  fr: {
    title: "Politique de Confidentialité",
    sub: "infiniteHelper · Mise à jour 2026",
    body: (
      <>
        <h2 style={h2Style}>1. Responsable du traitement</h2>
        <p>
          Gianluca Iacona (infinitecodes)<br />
          Rolshover Straße 70<br />
          51105 Cologne, Rhénanie-du-Nord-Westphalie<br />
          Allemagne<br />
          E-mail : support@infinitecodes.de
        </p>

        <h2 style={h2Style}>2. Données collectées</h2>
        <p>
          infiniteHelper recherche dans votre boutique les traces d&apos;apps
          installées et nous envoie le résultat avec votre demande. Les données
          suivantes sont traitées :
        </p>
        <ul>
          <li>Domaine de la boutique, jeton d&apos;accès Shopify et métadonnées de session (pour l&apos;authentification)</li>
          <li>
            Traces d&apos;apps installées provenant de six sources de votre
            boutique : scripts intégrés (dont l&apos;adresse nomme le fournisseur),
            blocs d&apos;app dans le thème actif, services de transport enregistrés,
            services de fulfillment enregistrés, remises issues de fonctions d&apos;app
            et espaces de noms de métachamps de la forme <code>app--…</code>
          </li>
          <li>Prénom et nom du propriétaire de la boutique, ID de boutique et ID utilisateur Shopify</li>
          <li>L&apos;adresse de réponse que vous saisissez et votre message</li>
          <li>
            Une trace de la demande envoyée : boutique, date et deux décomptes (apps
            trouvées et apps signalées)
          </li>
        </ul>
        <p>
          infiniteHelper ne traite aucune <strong>donnée personnelle de client</strong> :
          l&apos;app ne dispose pas des autorisations nécessaires pour lire les
          client(e)s ou les commandes. Elle ne peut pas non plus modifier les
          produits, les prix ou les contenus de votre boutique ; toutes ses
          autorisations sont en lecture seule.
        </p>

        <h2 style={h2Style}>3. Finalité et base juridique</h2>
        <p>
          La finalité est de répondre à votre demande et de préparer une offre. La
          base juridique est l&apos;art. 6, paragraphe 1, point b) du RGPD : mesures
          précontractuelles prises à votre demande. Rien ne quitte votre boutique
          tant que vous n&apos;envoyez pas le formulaire : la détection s&apos;exécute
          dans l&apos;app, et seul le clic sur « Envoyer la demande » transmet
          quelque chose.
        </p>

        <h2 style={h2Style}>4. Durée de conservation</h2>
        <p>
          Le nom, l&apos;adresse de réponse, le message et la liste d&apos;apps sont
          conservés dans notre helpdesk aussi longtemps que nécessaire pour les
          traiter et pour respecter les obligations légales de conservation. Dans
          l&apos;app elle-même, seule la trace décrite au point 2 subsiste : boutique,
          date et deux décomptes. Elle est supprimée lors de la désinstallation. Ni
          le nom, ni l&apos;adresse, ni le message ne sont stockés dans l&apos;app.
        </p>

        <h2 style={h2Style}>5. Transmission à des tiers</h2>
        <p>
          infiniteHelper lit via l&apos;API Admin Shopify ; Shopify Ireland Ltd. agit
          en tant que sous-traitant conformément à l&apos;art. 28 du RGPD. À
          l&apos;envoi, les données indiquées au point 2 sont transmises à notre
          propre point de support sur infinitecodes.de et ouvrent un ticket dans
          notre helpdesk auto-hébergé ; l&apos;e-mail de notification est envoyé via
          Google Workspace (Google Ireland Limited), notre fournisseur de
          messagerie. Au-delà de cela, aucune donnée n&apos;est transmise à des
          tiers. L&apos;app est gratuite, aucune donnée de paiement n&apos;est
          traitée.
        </p>

        <h2 style={h2Style}>6. Hébergement</h2>
        <p>
          L&apos;app est hébergée sur des serveurs en Allemagne. Le traitement des
          données personnelles repose sur un accord de traitement conclu avec
          l&apos;hébergeur.
        </p>

        <h2 style={h2Style}>7. Vos droits</h2>
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul>
          <li>Droit d&apos;accès (art. 15)</li>
          <li>Droit de rectification (art. 16)</li>
          <li>Droit à l&apos;effacement (art. 17)</li>
          <li>Droit à la limitation du traitement (art. 18)</li>
          <li>Droit à la portabilité des données (art. 20)</li>
          <li>Droit d&apos;opposition (art. 21)</li>
          <li>Droit d&apos;introduire une réclamation auprès d&apos;une autorité de contrôle (art. 77)</li>
        </ul>
        <p>Pour exercer vos droits : support@infinitecodes.de</p>

        <h2 style={h2Style}>8. Cookies</h2>
        <p>
          infiniteHelper n&apos;utilise pas de cookies de suivi. Le stockage et la
          lecture des cookies de session techniquement nécessaires à
          l&apos;authentification Shopify sont autorisés en vertu du § 25,
          paragraphe 2, n° 2 de la TDDDG allemande ; le traitement associé repose
          sur l&apos;art. 6, paragraphe 1, point f) du RGPD.
        </p>
      </>
    ),
  },
  pt: {
    title: "Política de Privacidade",
    sub: "infiniteHelper · Atualizado em 2026",
    body: (
      <>
        <h2 style={h2Style}>1. Responsável pelo tratamento</h2>
        <p>
          Gianluca Iacona (infinitecodes)<br />
          Rolshover Straße 70<br />
          51105 Colónia, Renânia do Norte-Vestfália<br />
          Alemanha<br />
          E-mail: support@infinitecodes.de
        </p>

        <h2 style={h2Style}>2. Dados recolhidos</h2>
        <p>
          O infiniteHelper procura na sua loja rastos de apps instaladas e envia-nos
          o resultado juntamente com o seu pedido. São tratados os seguintes dados:
        </p>
        <ul>
          <li>Domínio da loja, token de acesso do Shopify e metadados de sessão (para autenticação)</li>
          <li>
            Rastos de apps instaladas provenientes de seis fontes da sua loja:
            scripts integrados (cujo endereço identifica o fornecedor), blocos de app
            no tema ativo, serviços de envio registados, serviços de fulfillment
            registados, descontos criados por funções de app e espaços de nomes de
            metacampos com a forma <code>app--…</code>
          </li>
          <li>Nome próprio e apelido do proprietário da loja, ID da loja e ID de utilizador Shopify</li>
          <li>O endereço de resposta que indicar e a sua mensagem</li>
          <li>
            Um registo do pedido enviado: loja, data e duas contagens (apps
            encontradas e apps comunicadas)
          </li>
        </ul>
        <p>
          O infiniteHelper não trata <strong>dados pessoais de clientes</strong>: a app
          não dispõe das permissões necessárias para ler clientes ou encomendas.
          Também não pode alterar produtos, preços ou conteúdos da sua loja; todas as
          suas permissões são de leitura.
        </p>

        <h2 style={h2Style}>3. Finalidade e base legal</h2>
        <p>
          A finalidade é responder ao seu pedido e preparar uma proposta. A base
          legal é o art. 6.º, n.º 1, alínea b) do RGPD: diligências pré-contratuais
          a seu pedido. Nada sai da sua loja enquanto não enviar o formulário: a
          deteção corre dentro da app, e só o clique em «Enviar pedido» transmite
          alguma coisa.
        </p>

        <h2 style={h2Style}>4. Prazo de retenção</h2>
        <p>
          O nome, o endereço de resposta, a mensagem e a lista de apps ficam no nosso
          helpdesk enquanto for necessário para os tratar e para cumprir as
          obrigações legais de conservação. Na própria app fica apenas o registo do
          ponto 2: loja, data e duas contagens. É eliminado ao desinstalar. Nem o
          nome, nem o endereço, nem a mensagem são guardados na app.
        </p>

        <h2 style={h2Style}>5. Divulgação a terceiros</h2>
        <p>
          O infiniteHelper lê através da API de Admin do Shopify; a Shopify Ireland
          Ltd. atua como subcontratante nos termos do art. 28.º do RGPD. Ao enviar,
          os dados indicados no ponto 2 são transmitidos ao nosso próprio ponto de
          suporte em infinitecodes.de e abrem um ticket no nosso helpdesk
          autoalojado; o e-mail de notificação é enviado através do Google Workspace
          (Google Ireland Limited), o nosso fornecedor de e-mail. Para além disto,
          não são transmitidos dados a terceiros. A app é gratuita, pelo que não são
          tratados dados de pagamento.
        </p>

        <h2 style={h2Style}>6. Alojamento</h2>
        <p>
          A app é alojada em servidores na Alemanha. O tratamento de dados pessoais
          baseia-se num acordo de tratamento com o fornecedor de alojamento.
        </p>

        <h2 style={h2Style}>7. Os seus direitos</h2>
        <p>Nos termos do RGPD, tem os seguintes direitos:</p>
        <ul>
          <li>Direito de acesso (art. 15.º)</li>
          <li>Direito de retificação (art. 16.º)</li>
          <li>Direito ao apagamento (art. 17.º)</li>
          <li>Direito à limitação do tratamento (art. 18.º)</li>
          <li>Direito à portabilidade dos dados (art. 20.º)</li>
          <li>Direito de oposição (art. 21.º)</li>
          <li>Direito de apresentar reclamação junto de uma autoridade de controlo (art. 77.º)</li>
        </ul>
        <p>Para exercer os seus direitos: support@infinitecodes.de</p>

        <h2 style={h2Style}>8. Cookies</h2>
        <p>
          O infiniteHelper não utiliza cookies de rastreamento. O armazenamento e a
          leitura dos cookies de sessão tecnicamente necessários para a autenticação
          do Shopify são permitidos nos termos do § 25.º, n.º 2, ponto 2 da TDDDG
          alemã; o tratamento associado baseia-se no art. 6.º, n.º 1, alínea f) do
          RGPD.
        </p>
      </>
    ),
  },
};

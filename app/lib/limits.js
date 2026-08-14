/**
 * Grenzwerte, die Server und Oberflaeche gemeinsam brauchen.
 *
 * Bewusst ohne .server im Namen: Die Oberflaeche zeigt den Zeichenzaehler, der
 * Server prueft dieselbe Zahl. Staende sie im Servermodul, zoege der Build es
 * ins Browser-Buendel - React Router bricht dann ab, und zwar zu Recht.
 * Staende sie an zwei Stellen, liefen Anzeige und Pruefung irgendwann
 * auseinander.
 */
export const MESSAGE_MAX = 250;

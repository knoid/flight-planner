export default function fetchNOTAMs() {
  return fetch('//ais.anac.gov.ar/notam').then((res) => res.text());
}

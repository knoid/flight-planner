export default function fetchNOTAMs() {
  return fetch('http://ais.anac.gov.ar/notam').then((res) => res.text());
}

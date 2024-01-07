import { LatLng, Map } from 'leaflet';

function latLngURL(latLng: LatLng) {
  const { lat, lng } = latLng;
  return `@${lat.toFixed(7)},${lng.toFixed(7)}`;
}

export function detailsURL(map: Map, latLng: LatLng) {
  return mapURL(map, 'details', latLngURL(latLng));
}

export default function mapURL(map: Map, ...paths: string[]) {
  return ['', 'map', `${latLngURL(map.getCenter())},z${map.getZoom()}`, ...paths].join('/');
}

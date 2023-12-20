import { LatLng } from 'leaflet';

import POI, { POIProps } from './POI';

interface Point {
  type: 'Point';
  coordinates: [number, number];
}

export interface ReportingPointProps extends POIProps {
  airports: string[];
  geometry: Point;
}

export default class ReportingPoint extends POI {
  airports!: string[];
  geometry!: Point;

  static fromJSON(json: ReportingPointProps) {
    return Object.assign(new ReportingPoint(), json);
  }

  latLng() {
    const [longitude, latitude] = this.geometry.coordinates;
    return new LatLng(latitude, longitude);
  }
}

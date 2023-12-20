import POI, { POIProps } from './POI';

interface Polygon {
  type: 'Polygon';
  coordinates: [[[number, number]]];
}

export interface AirspaceProps extends POIProps {
  geometry: Polygon;
}

export default class Airspace extends POI {
  geometry!: Polygon;

  getIdentifier() {
    return this.name;
  }

  getLabel() {
    return this.name;
  }

  static fromJSON(json: AirspaceProps) {
    return Object.assign(new Airspace(), json);
  }
}

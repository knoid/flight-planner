import { Point } from 'geojson';
import { LatLng } from 'leaflet';

import POI, { POIProps } from './POI';

export interface PointPOIProps extends POIProps {
  geometry: Point;
}

export default abstract class PointPOI extends POI implements PointPOIProps {
  geometry!: Point;

  latLng() {
    const [longitude, latitude] = this.geometry.coordinates;
    return new LatLng(latitude, longitude);
  }
}

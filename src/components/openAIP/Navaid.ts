import POI, { POIProps } from './POI';

export interface NavaidProps extends POIProps {}

export default class Navaid extends POI implements NavaidProps {
  static fromJSON(json: NavaidProps) {
    return Object.assign(new Navaid(), json);
  }
}

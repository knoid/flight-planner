import PointPOI, { PointPOIProps } from './PointPOI';

enum NavaidType {
  DME,
  TACAN,
  NDB,
  VOR,
  VORDME,
  VORTAC,
  DVOR,
  DVORDME,
  DVORTAC,
}

export interface NavaidProps extends PointPOIProps {
  type: NavaidType;
}

export default class Navaid extends PointPOI implements NavaidProps {
  type!: NavaidType;

  static fromJSON(json: NavaidProps) {
    return Object.assign(new Navaid(), json);
  }
}

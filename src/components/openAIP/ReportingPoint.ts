import PointPOI, { PointPOIProps } from './PointPOI';

export interface ReportingPointProps extends PointPOIProps {
  airports: string[];
}

export default class ReportingPoint extends PointPOI implements ReportingPointProps {
  airports!: string[];

  static fromJSON(json: ReportingPointProps) {
    return Object.assign(new ReportingPoint(), json);
  }
}

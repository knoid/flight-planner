import { WorldMagneticModel } from '../../WorldMagneticModel';
import * as math from '../math';
import { POI } from '../POIsContext';

export interface Leg {
  key: string;
  readonly poi: POI;
  wind: string;
}

interface Partial {
  course: number;
  distance: number;
  /** Estimated time of arrival in hours. */
  eta: Date | null;
  /** Estimated time enroute in hours. */
  ete: number;
  groundSpeed: number;
  heading: number;
  lat: number;
  lon: number;
  leg: Leg;
}

const h2m = 60 * 60 * 1000;

export default function legsToPartials(legs: Leg[], cruiseSpeed: number, initialTime: Date | null, wmm: WorldMagneticModel) {
  return legs.reduce((partials, leg) => {
    const lat = math.toRadians(leg.poi.lat);
    const lon = math.toRadians(leg.poi.lon);
    if (partials.length === 0) {
      return [
        {
          course: -1,
          distance: 0,
          eta: initialTime,
          ete: -1,
          groundSpeed: -1,
          heading: -1,
          lat,
          lon,
          leg,
        },
      ];
    }

    const previousPartial = partials[partials.length - 1];
    const lastPOI = previousPartial.leg.poi;
    const lastETA = previousPartial.eta;
    const [windDirection, windSpeed = 0] = leg.wind.split('/').map(Number);
    const { course, distance } = math.courseDistance(
      math.toRadians(lastPOI.lat),
      math.toRadians(lastPOI.lon),
      lat,
      lon
    );
    const heading = math.heading(course, cruiseSpeed, windDirection, windSpeed);
    const groundSpeed =
      heading > -1
        ? math.groundSpeed(cruiseSpeed, heading, windDirection, windSpeed)
        : -1;
    const now = new Date();
    const declination = wmm.declination(
      1500 / 3,
      leg.poi.lat,
      leg.poi.lon,
      now.getFullYear() + now.getMonth() / 12
    );
    const ete = groundSpeed
      ? (math.toDegrees(distance) / groundSpeed) * 60
      : -1;
    return [
      ...partials,
      {
        course: course - declination,
        distance,
        eta:
          groundSpeed && lastETA
            ? new Date(lastETA.getTime() + ete * h2m)
            : null,
        ete: groundSpeed ? (math.toDegrees(distance) / groundSpeed) * 60 : -1,
        groundSpeed,
        heading: heading > 0 ? heading - declination : heading,
        lat,
        lon,
        leg,
      },
    ];
  }, [] as Partial[]);
}

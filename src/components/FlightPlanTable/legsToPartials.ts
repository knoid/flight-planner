import { WorldMagneticModel } from '../../WorldMagneticModel';
import * as math from '../math';
import { POI } from '../POIsContext';

export interface Leg {
  altitude: string;
  code: string;
  key: string;
  notes?: string;
  readonly poi?: POI;
  wind: string;
}

export interface Partial {
  course: number;
  distance: number;
  /** Estimated time of arrival in hours. */
  eta: Date | null;
  /** Estimated time enroute in hours. */
  ete: number;
  groundSpeed: number;
  heading: number;
  leg: Leg;
  remainingFuel: number;
  tripFuel: number;
}

const defaultAltitudeKm = math.toKilometers('2000');
const hour = 60 * 60 * 1000;
const now = new Date();
const yearFloat = now.getFullYear() + now.getMonth() / 12;

export default function legsToPartials(
  legs: Leg[],
  cruiseSpeed: number,
  fuelCapacity: number,
  fuelFlow: number,
  startTime: Date | null,
  wmm: WorldMagneticModel
) {
  return legs.reduce((partials, leg) => {
    const empty = {
      course: -1,
      distance: 0,
      eta: startTime,
      ete: -1,
      groundSpeed: -1,
      heading: -1,
      leg,
      remainingFuel: fuelCapacity,
      tripFuel: 0,
    };

    if (!leg.poi || partials.length === 0) {
      return [...partials, empty];
    }

    const last = partials[partials.length - 1];
    if (!last.leg.poi) {
      return [...partials, empty];
    }

    const altitudeKm = math.toKilometers(leg.altitude) || defaultAltitudeKm;
    const declination = wmm.declination(altitudeKm, leg.poi.coords, yearFloat);
    const [windSourceDeg, windSpeed = 0] = leg.wind.split('/').map(Number);
    const windSource = math.toRadians(windSourceDeg) + declination;
    const distance = math.distance(last.leg.poi.coords, leg.poi.coords);
    const course = math.course(distance, last.leg.poi.coords, leg.poi.coords);
    const heading = math.heading(course, cruiseSpeed, windSource, windSpeed);
    const groundSpeed =
      heading > -1 ? math.groundSpeed(cruiseSpeed, heading, windSource, windSpeed) : -1;
    const ete = groundSpeed ? (math.toDegrees(distance) / groundSpeed) * 60 : -1;
    const tripFuel = fuelFlow > 0 ? fuelFlow * ete : fuelFlow;
    return [
      ...partials,
      {
        course: course - declination,
        distance,
        eta: groundSpeed > -1 && last.eta ? new Date(last.eta.getTime() + ete * hour) : null,
        ete,
        groundSpeed,
        heading: heading > 0 ? heading - declination : heading,
        leg,
        remainingFuel: last.remainingFuel > 0 ? last.remainingFuel - tripFuel : -1,
        tripFuel,
      },
    ];
  }, [] as Partial[]);
}

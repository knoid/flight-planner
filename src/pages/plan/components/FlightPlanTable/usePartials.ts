import { useContext } from 'react';

import * as math from '../../../../components/math';
import type { Airport, ReportingPoint } from '../../../../components/openAIP';
import POIsContext from '../../../../components/POIsContext';
import { useStore } from '../../../../components/store';
import type { Leg } from '../../../../components/store/constants';
import type { Coords } from '../../../../types';
import timeToDate from '../../../../utils/timeToDate';
import type { WorldMagneticModel } from '../../../../utils/WorldMagneticModel';

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

function toRadians(poi: Airport | ReportingPoint) {
  return poi.geometry.coordinates.toReversed().map(math.toRadians) as Coords;
}

export default function usePartials(wmm: WorldMagneticModel) {
  const {
    cruiseSpeed,
    fuel: { capacity: fuelCapacity, flow: fuelFlow },
    legs,
    startTime: savedStartTime,
  } = useStore();
  const { airports, reportingPoints } = useContext(POIsContext);
  const startTime = savedStartTime ? timeToDate(savedStartTime) : null;

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

    const poi = airports.get(leg._id) || reportingPoints.get(leg._id);
    if (!poi || partials.length === 0) {
      return [...partials, empty];
    }

    const last = partials[partials.length - 1];
    const lastPoi = airports.get(last.leg._id) || reportingPoints.get(last.leg._id);
    if (!lastPoi) {
      return [...partials, empty];
    }

    const from = toRadians(lastPoi);
    const to = toRadians(poi);
    const altitudeKm = math.toKilometers(leg.altitude) || defaultAltitudeKm;
    const declination = wmm.declination(altitudeKm, to, yearFloat);
    const [windSourceDeg, windSpeed = 0] = leg.wind.split('/').map(Number);
    const windSource = math.toRadians(windSourceDeg) + declination;
    const distance = math.distance(from, to);
    const course = math.course(distance, from, to);
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

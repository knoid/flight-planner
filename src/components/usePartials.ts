import { useContext } from 'react';

import type { Coords } from '../types';
import reverse from '../utils/reverse';
import type { WorldMagneticModel } from '../utils/WorldMagneticModel';
import * as math from './math';
import type { PointPOI } from './openAIP';
import POIsContext from './POIsContext';
import { useStore } from './store';

export interface Partial {
  course: number;
  distance: number;
  /** Estimated time enroute in hours. */
  ete: number;
  groundSpeed: number;
  heading: number;
  tripFuel: number;
}

const now = new Date();
const yearFloat = now.getFullYear() + now.getMonth() / 12;
export const initialValues = {
  course: -1,
  distance: 0,
  ete: -1,
  groundSpeed: -1,
  heading: -1,
  tripFuel: 0,
} as const;

function toRadians(poi: PointPOI) {
  return reverse(poi.geometry.coordinates).map(math.toRadians) as Coords;
}

export default function usePartials(wmm: WorldMagneticModel) {
  const {
    altitude,
    cruiseSpeed,
    fuel: { flow: fuelFlow },
    legs,
  } = useStore();
  const {
    airports: [airports],
    reportingPoints: [reportingPoints],
  } = useContext(POIsContext);

  return legs.reduce((partials, leg) => {
    const empty = { ...initialValues };

    const poi = airports.get(leg._id) || reportingPoints.get(leg._id);
    if (!poi || partials.length === 0) {
      return [...partials, empty];
    }

    const lastLeg = legs[partials.length - 1];
    const lastPoi = airports.get(lastLeg._id) || reportingPoints.get(lastLeg._id);
    if (!lastPoi) {
      return [...partials, empty];
    }

    const from = toRadians(lastPoi);
    const to = toRadians(poi);
    const altitudeKm = math.toKilometers(altitude);
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
        ete,
        groundSpeed,
        heading: heading > 0 ? heading - declination : heading,
        tripFuel,
      },
    ];
  }, [] as Partial[]);
}

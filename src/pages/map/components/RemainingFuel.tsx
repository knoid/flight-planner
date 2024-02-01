import { useContext } from 'react';
import { Circle } from 'react-leaflet';

import * as math from '../../../components/math';
import POIsContext from '../../../components/POIsContext';
import { useStore } from '../../../components/store';
import { WorldMagneticModel } from '../../../utils/WorldMagneticModel';
import usePartials from '../../plan/components/FlightPlanTable/usePartials';

const nm2m = 1852;
const wmm = new WorldMagneticModel();

export default function RemainingFuel() {
  const { cruiseSpeed, fuel, legs } = useStore();
  const partials = usePartials(wmm);
  const {
    airports: [airports],
    reportingPoints: [reportingPoints],
  } = useContext(POIsContext);

  function fuelToMeters(remainingFuel: number) {
    return (remainingFuel / fuel.flow) * cruiseSpeed * nm2m;
  }
  const totalFuel = math.sum(...partials.map((partial) => partial.tripFuel));
  const remainingFuel = fuel.capacity - totalFuel;

  if (partials.length > 0) {
    const leg = legs[partials.length - 1];
    const lastPOI = airports.get(leg._id) || reportingPoints.get(leg._id);
    const lastCoords = lastPOI?.latLng();
    const remainingRadius = fuelToMeters(remainingFuel - fuel.reserve);
    const reserveRadius = fuelToMeters(remainingFuel);
    if (lastCoords) {
      return (
        <>
          {reserveRadius > 0 && (
            <Circle center={lastCoords} color="yellow" radius={reserveRadius} />
          )}
          {remainingRadius > 0 && <Circle center={lastCoords} radius={remainingRadius} />}
        </>
      );
    }
  }
  return null;
}

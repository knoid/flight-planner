import { Circle } from 'react-leaflet';

import { useLegs } from '../../../components/LegsContext';
import { useStore } from '../../../components/store';
import timeToDate from '../../../utils/timeToDate';
import { WorldMagneticModel } from '../../../utils/WorldMagneticModel';
import legsToPartials from '../../plan/components/FlightPlanTable/legsToPartials';

const nm2m = 1852;
const wmm = new WorldMagneticModel();

export default function RemainingFuel() {
  const [legs] = useLegs();
  const { cruiseSpeed, fuel, startTime: savedStartTime } = useStore();
  const startTime = savedStartTime ? timeToDate(savedStartTime) : null;
  const partials = legsToPartials(legs, cruiseSpeed, fuel.capacity, fuel.flow, startTime, wmm);

  function fuelToMeters(remainingFuel: number) {
    return (remainingFuel / fuel.flow) * cruiseSpeed * nm2m;
  }

  if (partials.length > 0) {
    const lastPartial = partials[partials.length - 1];
    const lastCoords = lastPartial.leg.poi?.coordinates;
    const remainingRadius = fuelToMeters(lastPartial.remainingFuel - fuel.reserve);
    const reserveRadius = fuelToMeters(lastPartial.remainingFuel);
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

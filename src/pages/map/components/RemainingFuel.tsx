import { useContext } from 'react';
import { Circle } from 'react-leaflet';

import POIsContext from '../../../components/POIsContext';
import { useStore } from '../../../components/store';
import { WorldMagneticModel } from '../../../utils/WorldMagneticModel';
import usePartials from '../../plan/components/FlightPlanTable/usePartials';

const nm2m = 1852;
const wmm = new WorldMagneticModel();

export default function RemainingFuel() {
  const { cruiseSpeed, fuel } = useStore();
  const partials = usePartials(wmm);
  const { airports, reportingPoints } = useContext(POIsContext);

  function fuelToMeters(remainingFuel: number) {
    return (remainingFuel / fuel.flow) * cruiseSpeed * nm2m;
  }

  if (partials.length > 0) {
    const lastPartial = partials[partials.length - 1];
    const lastPOI = airports.get(lastPartial.leg._id) || reportingPoints.get(lastPartial.leg._id);
    const lastCoords = lastPOI?.latLng();
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

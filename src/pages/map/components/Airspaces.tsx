import { useContext } from 'react';
import { useMap } from 'react-leaflet';

import { AirspaceMarker } from '../../../components/map';
import { Airspace, AirspaceType, Limit, LimitUnit } from '../../../components/openAIP';
import POIsContext from '../../../components/POIsContext';
import SelectedPOIs from './SelectedPOIs';

const altitudeFactor = { [LimitUnit.Feet]: 1, [LimitUnit.FlightLevel]: 1000, [LimitUnit.Meter]: 3 };
function altitudeNumber(altitude: Limit) {
  return altitude.value * altitudeFactor[altitude.unit];
}

interface AirspacesProps {
  altitude: number;
}

export default function Airspaces({ altitude }: AirspacesProps) {
  const { airspaces } = useContext(POIsContext);
  const { clickedAirspace } = useContext(SelectedPOIs);
  const map = useMap();

  const bounds = map.getBounds();
  return (
    <>
      {[...airspaces.values()]
        .filter((poi): poi is Airspace => (poi && bounds.intersects(poi.bounds())) || false)
        .filter(
          ({ lowerLimit, type, upperLimit }) =>
            type !== AirspaceType.FIR &&
            altitudeNumber(lowerLimit) <= altitude &&
            altitude <= altitudeNumber(upperLimit),
        )
        .map((poi) => (
          <AirspaceMarker
            airspace={poi}
            eventHandlers={{ click: () => clickedAirspace(poi) }}
            interactive={true}
            key={poi._id}
          />
        ))}
    </>
  );
}

import { LatLng } from 'leaflet';
import { useContext } from 'react';
import { Polygon, useMap } from 'react-leaflet';

import { Airspace, AirspaceType, Limit, LimitUnit } from '../../../components/openAIP';
import POIsContext from '../../../components/POIsContext';

const colors = [
  'blue',
  'brown',
  'green',
  'grey',
  'orange',
  'pink',
  'purple',
  'red',
  'turquoise',
  'yellow',
];

const altitudeFactor = { [LimitUnit.Feet]: 1, [LimitUnit.FlightLevel]: 1000, [LimitUnit.Meter]: 3 };
function altitudeNumber(altitude: Limit) {
  return altitude.value * altitudeFactor[altitude.unit];
}

interface AirspacesProps {
  altitude: number;
}

export default function Airspaces({ altitude }: AirspacesProps) {
  const { airspaces } = useContext(POIsContext);
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
        .map((poi) =>
          poi.geometry.coordinates.map((coords, index) => (
            <Polygon
              dashArray={[5, 15]}
              fill={true}
              fillColor={colors[poi.type % colors.length]}
              key={`${poi._id}-${index}`}
              pathOptions={{ color: colors[poi.type % colors.length] }}
              positions={coords.slice(1).map(([lng, lat]) => new LatLng(lat, lng))}
              weight={1.5}
            />
          )),
        )}
    </>
  );
}

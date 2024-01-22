import { LatLng } from 'leaflet';
import { Polygon, PolygonProps } from 'react-leaflet';

import { Airspace } from '../openAIP';

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

interface AirspaceMarkerProps extends Partial<PolygonProps> {
  airspace: Airspace;
}

export default function AirspaceMarker({ airspace, ...polygonProps }: AirspaceMarkerProps) {
  return (
    <>
      {airspace.geometry.coordinates.map((coords, index) => (
        <Polygon
          dashArray={[5, 15]}
          fill={true}
          fillColor={colors[airspace.type % colors.length]}
          key={`${airspace._id}-${index}`}
          pathOptions={{ color: colors[airspace.type % colors.length] }}
          positions={coords.slice(1).map(([lng, lat]) => new LatLng(lat, lng))}
          weight={1.5}
          {...polygonProps}
        />
      ))}
    </>
  );
}

import { GeoJSON, GeoJSONProps } from 'react-leaflet';

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

interface AirspaceMarkerProps extends Partial<GeoJSONProps> {
  airspace: Airspace;
}

export default function AirspaceMarker({ airspace, ...geoJsonProps }: AirspaceMarkerProps) {
  return (
    <GeoJSON
      data={airspace.geometry}
      style={{
        color: colors[airspace.type % colors.length],
        dashArray: [5, 15],
        fill: true,
        fillColor: colors[airspace.type % colors.length],
        weight: 1.5,
      }}
      {...geoJsonProps}
    />
  );
}

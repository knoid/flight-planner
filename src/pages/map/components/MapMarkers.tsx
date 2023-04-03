import { LocalAirport as LocalAirportIcon } from '@mui/icons-material';
import { Paper, styled } from '@mui/material';
import { LatLngBounds } from 'leaflet';
import { useContext, useEffect } from 'react';
import { Marker, Polyline, Popup, useMap } from 'react-leaflet';

import { useLegs } from '../../../components/LegsContext';
import * as math from '../../../components/math';
import POIsContext from '../../../components/POIsContext';
import { Coords } from '../../../types';
import DivIcon from './DivIcon';

const defaultBounds = new LatLngBounds(
  [-43.97361132750201, -72.95147269963724],
  [-27.08690394764455, -54.34688571064547],
);

const PointOnMap = styled('div')({
  aspectRatio: '1',
  position: 'absolute',
  textAlign: 'center',
  transform: 'translate(-50%, -50%)',
  width: 19,
});

// const Helipad = styled(PointOnMap)({
//   border: '1px solid black',
//   borderRadius: '50%',
// });
const AirportIcon = PointOnMap.withComponent(LocalAirportIcon);
const WaypointNumber = PointOnMap.withComponent(Paper);

export default function MapMarkers() {
  const [legs] = useLegs();
  const { loading, options } = useContext(POIsContext);
  const map = useMap();
  const loaded = !loading && (legs.length === 0 || !!legs.find((leg) => leg.poi));

  const left = Math.min(...legs.map((leg) => leg.poi?.coordinates[0] || NaN));
  const top = Math.max(...legs.map((leg) => leg.poi?.coordinates[1] || NaN));
  const right = Math.max(...legs.map((leg) => leg.poi?.coordinates[0] || NaN));
  const bottom = Math.min(...legs.map((leg) => leg.poi?.coordinates[1] || NaN));
  const points = legs
    .map((leg) => leg.poi?.coordinates)
    .filter((coordinates): coordinates is Coords => !!coordinates);

  useEffect(() => {
    if (loaded) {
      const bounds =
        points.length > 0 ? new LatLngBounds([left, top], [right, bottom]) : defaultBounds;
      map.fitBounds(bounds);
    }
  }, [bottom, left, loaded, map, points.length, right, top]);

  return (
    <>
      <Polyline positions={points} />
      {options
        .filter((poi) => poi.type === 'airport')
        .map((poi) => (
          <Marker key={poi.identifiers.local} position={poi.coordinates}>
            <DivIcon>
              <AirportIcon />
            </DivIcon>
            <Popup>{poi.identifiers.local}</Popup>
          </Marker>
        ))}
      {legs.map((leg, index) => {
        const poi = leg.poi;
        if (!poi) {
          return null;
        }
        return (
          <Marker key={leg.key} position={poi.coordinates}>
            <DivIcon>
              <WaypointNumber>{index + 1}</WaypointNumber>
            </DivIcon>
            <Popup>{poi.identifiers.local}</Popup>
          </Marker>
        );
      })}
    </>
  );
}

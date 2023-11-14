import { useContext, useEffect } from 'react';
import { Marker, Polyline, Popup, useMapEvent } from 'react-leaflet';

import { AirportIcon, DivIcon, WaypointIcon } from '../../../components/map';
import { Airport, ReportingPoint } from '../../../components/openAIP';
import POIsContext from '../../../components/POIsContext';
import { useStore } from '../../../components/store';
import WaypointMarker from './WaypointMarker';

export default function MapMarkers() {
  const { legs } = useStore();
  const { airports, reportingPoints, setLatLngBounds } = useContext(POIsContext);
  const map = useMapEvent('moveend', () => {
    setLatLngBounds(map.getBounds());
  });
  useEffect(() => {
    setLatLngBounds(map.getBounds());
  }, []);
  const points = legs
    .map((leg) => airports.get(leg._id) || reportingPoints.get(leg._id))
    .filter((poi): poi is Airport | ReportingPoint => !!poi)
    .map((poi) => poi.latLng());

  const bounds = map.getBounds();
  return (
    <>
      <Polyline positions={points} />
      {[...airports.values()]
        .filter((poi): poi is Airport => (poi && bounds.contains(poi.latLng())) || false)
        .map((poi) => (
          <Marker key={poi._id} position={poi.latLng()} zIndexOffset={1}>
            <DivIcon>
              <AirportIcon />
            </DivIcon>
            <Popup>{poi.getIdentifier()}</Popup>
          </Marker>
        ))}
      {[...reportingPoints.values()]
        .filter((poi): poi is ReportingPoint => (poi && bounds.contains(poi.latLng())) || false)
        .map((poi) => (
          <Marker key={poi._id} position={poi.latLng()} zIndexOffset={2}>
            <DivIcon>
              <WaypointIcon />
            </DivIcon>
            <Popup>{poi.getIdentifier()}</Popup>
          </Marker>
        ))}
      {legs.map((leg, index) => (
        <WaypointMarker key={leg.key} leg={leg} index={index} zIndexOffset={3} />
      ))}
    </>
  );
}

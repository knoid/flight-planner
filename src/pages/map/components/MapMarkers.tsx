import { useContext, useEffect } from 'react';
import { Marker, Polyline, Popup, useMapEvent } from 'react-leaflet';

import { AirportIcon, DivIcon, WaypointIcon, WaypointNumber } from '../../../components/map';
import { Airport, ReportingPoint } from '../../../components/openAIP';
import POIsContext from '../../../components/POIsContext';
import { useStore } from '../../../components/store';

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
    .map((leg) => airports.get(leg._id))
    .filter((airport): airport is Airport => !!airport)
    .map((airport) => airport.latLng());

  const bounds = map.getBounds();
  return (
    <>
      <Polyline positions={points} />
      {[...airports.values()]
        .filter((poi): poi is Airport => (poi && bounds.contains(poi.latLng())) || false)
        .map((poi) => (
          <Marker key={poi._id} position={poi.latLng()}>
            <DivIcon>
              <AirportIcon />
            </DivIcon>
            <Popup>{poi.name}</Popup>
          </Marker>
        ))}
      {[...reportingPoints.values()]
        .filter((poi): poi is ReportingPoint => (poi && bounds.contains(poi.latLng())) || false)
        .map((poi) => (
          <Marker key={poi._id} position={poi.latLng()}>
            <DivIcon>
              <WaypointIcon />
            </DivIcon>
            <Popup>{poi.name}</Popup>
          </Marker>
        ))}
      {legs.map((leg, index) => {
        const poi = airports.get(leg._id);
        if (!poi) {
          return null;
        }
        return (
          <Marker key={leg._id} position={poi.latLng()}>
            <DivIcon>
              <WaypointNumber>{index + 1}</WaypointNumber>
            </DivIcon>
            <Popup>{poi.icaoCode || poi.iataCode || poi.altIdentifier || poi.name}</Popup>
          </Marker>
        );
      })}
    </>
  );
}

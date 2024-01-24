import { Point } from 'leaflet';
import { useContext, useEffect } from 'react';
import { Marker, Polyline, useMapEvent } from 'react-leaflet';

import { AirportIcon, DivIcon, WaypointIcon } from '../../../components/map';
import { Airport, ReportingPoint } from '../../../components/openAIP';
import POIsContext from '../../../components/POIsContext';
import { useStore } from '../../../components/store';
import SelectedPOIs from './SelectedPOIs';
import WaypointMarker from './WaypointMarker';

const airportIconSize = new Point(19, 24);
const waypointIconSize = new Point(10, 10);

export default function MapMarkers() {
  const { legs } = useStore();
  const {
    airports: [airports],
    reportingPoints: [reportingPoints],
    setLatLngBounds,
  } = useContext(POIsContext);
  const { clickedAirport, clickedReportingPoint } = useContext(SelectedPOIs);
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
          <Marker
            eventHandlers={{
              click: () => clickedAirport(poi),
            }}
            key={poi._id}
            position={poi.latLng()}
            zIndexOffset={1}
          >
            <DivIcon iconSize={airportIconSize}>
              <AirportIcon />
            </DivIcon>
          </Marker>
        ))}
      {[...reportingPoints.values()]
        .filter((poi): poi is ReportingPoint => (poi && bounds.contains(poi.latLng())) || false)
        .map((poi) => (
          <Marker
            eventHandlers={{
              click: () => clickedReportingPoint(poi),
            }}
            key={poi._id}
            position={poi.latLng()}
            zIndexOffset={2}
          >
            <DivIcon iconSize={waypointIconSize}>
              <WaypointIcon />
            </DivIcon>
          </Marker>
        ))}
      {legs.map((leg, index) => (
        <WaypointMarker key={leg.key} leg={leg} index={index} zIndexOffset={3} />
      ))}
    </>
  );
}

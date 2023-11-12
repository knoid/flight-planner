import { LatLng } from 'leaflet';
import { useMapEvents } from 'react-leaflet';

import { MapContainer } from '../../components/map';
import { useStore } from '../../components/store';
import MapMarkers from './components/MapMarkers';
import RemainingFuel from './components/RemainingFuel';
import ToggleRemainingFuel from './components/ToggleRemainingFuel';
import ZoomControls from './components/ZoomControls';

let center = new LatLng(0, 0);
let zoom = 2;

function SaveLocation() {
  const map = useMapEvents({
    moveend() {
      center = map.getCenter();
    },
    zoomlevelschange() {
      zoom = map.getZoom();
    },
  });
  return null;
}

export const Component = function MapPage() {
  const { showReminderOnMap, toggleReminderOnMap } = useStore();
  return (
    <>
      <MapContainer center={center} zoom={zoom} zoomControl={false}>
        <MapMarkers />
        {showReminderOnMap && <RemainingFuel />}
        <SaveLocation />
        <ZoomControls />
      </MapContainer>
      <ToggleRemainingFuel selected={showReminderOnMap} onChange={toggleReminderOnMap} />
    </>
  );
};

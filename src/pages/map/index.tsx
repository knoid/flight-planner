import 'leaflet/dist/leaflet.css';

import { MapContainer, TileLayer } from 'react-leaflet';

import { useStore } from '../../components/store';
import MapMarkers from './components/MapMarkers';
import RemainingFuel from './components/RemainingFuel';
import ToggleRemainingFuel from './components/ToggleRemainingFuel';
import ZoomControls from './components/ZoomControls';

export const Component = function MapPage() {
  const { showReminderOnMap, toggleReminderOnMap } = useStore();
  return (
    <>
      <MapContainer zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapMarkers />
        {showReminderOnMap && <RemainingFuel />}
        <ZoomControls />
      </MapContainer>
      <ToggleRemainingFuel selected={showReminderOnMap} onChange={toggleReminderOnMap} />
    </>
  );
};

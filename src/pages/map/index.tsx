import { MapContainer } from '../../components/map';
import { useStore } from '../../components/store';
import MapMarkers from './components/MapMarkers';
import RemainingFuel from './components/RemainingFuel';
import ToggleRemainingFuel from './components/ToggleRemainingFuel';
import ZoomControls from './components/ZoomControls';

export const Component = function MapPage() {
  const { showReminderOnMap, toggleReminderOnMap } = useStore();
  return (
    <>
      <MapContainer center={[0, 0]} zoom={2} zoomControl={false}>
        <MapMarkers />
        {showReminderOnMap && <RemainingFuel />}
        <ZoomControls />
      </MapContainer>
      <ToggleRemainingFuel selected={showReminderOnMap} onChange={toggleReminderOnMap} />
    </>
  );
};

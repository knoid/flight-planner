import 'leaflet/dist/leaflet.css';

import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { IconButton, Paper, styled } from '@mui/material';
import { MapContainer, TileLayer } from 'react-leaflet';

import { useStore } from '../../components/store';
import MapMarkers from './components/MapMarkers';
import RemainingFuel from './components/RemainingFuel';
import ToggleRemainingFuel from './components/ToggleRemainingFuel';
import ZoomControls from './components/ZoomControls';

const RoundPaper = styled(Paper)({
  borderRadius: '50%',
  display: 'inline-block',
  left: '1em',
  position: 'absolute',
  top: '1em',
  zIndex: 1000,
});

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
      <RoundPaper>
        <IconButton href="/">
          <ArrowBackIcon />
        </IconButton>
      </RoundPaper>
      <ToggleRemainingFuel selected={showReminderOnMap} onChange={toggleReminderOnMap} />
    </>
  );
};

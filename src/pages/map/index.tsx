import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { IconButton, Paper, styled } from '@mui/material';
import { MapContainer, TileLayer } from 'react-leaflet';
import MapMarkers from './components/MapMarkers';
import ZoomControls from './components/ZoomControls';
import 'leaflet/dist/leaflet.css';

const RoundPaper = styled(Paper)({
  borderRadius: '50%',
  display: 'inline-block',
  left: '1em',
  position: 'absolute',
  top: '1em',
  zIndex: 1000,
});

export default function MapPage() {
  return (
    <>
      <MapContainer zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapMarkers />
        <ZoomControls />
      </MapContainer>
      <RoundPaper>
        <IconButton href="/">
          <ArrowBackIcon />
        </IconButton>
      </RoundPaper>
    </>
  );
}

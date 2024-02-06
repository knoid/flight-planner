import { LatLng, Map } from 'leaflet';
import { useEffect, useRef } from 'react';
import { Pane, useMapEvents } from 'react-leaflet';
import { useMatch, useNavigate } from 'react-router-dom';

import { MapContainer } from '../../components/map';
import { useStore } from '../../components/store';
import Airspaces from './components/Airspaces';
import AirspaceSlider from './components/AirspaceSlider';
import Details from './components/Details';
import MapMarkers from './components/MapMarkers';
import mapURL from './components/mapURL';
import RemainingFuel from './components/RemainingFuel';
import { SelectedPOIsProvider } from './components/SelectedPOIs';
import ToggleRemainingFuel from './components/ToggleRemainingFuel';
import ZoomControls from './components/ZoomControls';

function SaveLocation() {
  const { setCenter, setZoom } = useStore();
  const navigate = useNavigate();

  const map = useMapEvents({
    moveend() {
      setCenter(map.getCenter());
      navigate(mapURL(map), { replace: true });
    },
    zoomend() {
      setZoom(map.getZoom());
      navigate(mapURL(map), { replace: true });
    },
  });

  useEffect(() => {
    setCenter(map.getCenter());
    setZoom(map.getZoom());
    navigate(mapURL(map), { replace: true });
  }, []);

  return null;
}

function useCenterZoomLocation() {
  const pathMatch = useMatch({ end: false, path: '/map/:latLngZoom' });
  const { center, zoom } = useStore();
  const init = { center, zoom };
  if (!pathMatch || !pathMatch.params.latLngZoom) {
    return init;
  }

  const latLngZoom = pathMatch.params.latLngZoom.match(
    /^@(-?\d+\.\d{1,7}),(-?\d+\.\d{1,7}),z(\d+)$/,
  );
  if (!latLngZoom) {
    return init;
  }

  const [lat, lng, urlZoom] = latLngZoom.slice(1).map(Number);
  return { center: new LatLng(lat, lng), zoom: urlZoom };
}

export const Component = function MapPage() {
  const { altitude, setAltitude, showReminderOnMap, toggleReminderOnMap } = useStore();
  const { center, zoom } = useCenterZoomLocation();
  const mapRef = useRef<Map>(null);
  const paneRef = useRef<HTMLElement>(null);

  return (
    <SelectedPOIsProvider pane={paneRef}>
      <Details />
      <MapContainer
        center={center}
        doubleClickZoom={false}
        ref={mapRef}
        zoom={zoom}
        zoomControl={false}
      >
        <Pane name="clickable" ref={paneRef}>
          <Airspaces altitude={altitude} />
          <MapMarkers />
        </Pane>
        {showReminderOnMap && <RemainingFuel />}
        <SaveLocation />
        <ZoomControls />
      </MapContainer>
      <AirspaceSlider
        value={altitude}
        onChange={(_event, values) => {
          const value = Array.isArray(values) ? values[0] : values;
          setAltitude(value);
        }}
      />
      <ToggleRemainingFuel selected={showReminderOnMap} onChange={toggleReminderOnMap} />
    </SelectedPOIsProvider>
  );
};

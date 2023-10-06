import 'leaflet/dist/leaflet.css';

import { Map } from 'leaflet';
import { forwardRef, Ref } from 'react';
import { MapContainer as LeafMapContainer, MapContainerProps, TileLayer } from 'react-leaflet';

export const MapContainer = forwardRef(function MapContainer(
  { children, ...props }: MapContainerProps,
  ref: Ref<Map>,
) {
  return (
    <LeafMapContainer {...props} ref={ref}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </LeafMapContainer>
  );
});

import 'leaflet/dist/leaflet.css';

import { Map } from 'leaflet';
import { ForwardedRef, forwardRef } from 'react';
import { MapContainer as LeafMapContainer, MapContainerProps, TileLayer } from 'react-leaflet';

export const MapContainer = forwardRef(function MapContainer(
  { children, ...props }: MapContainerProps,
  ref: ForwardedRef<Map>,
) {
  return (
    <LeafMapContainer {...props} ref={ref}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </LeafMapContainer>
  );
});

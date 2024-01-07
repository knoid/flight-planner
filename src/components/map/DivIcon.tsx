import { useLeafletContext } from '@react-leaflet/core';
import { DivIcon as LeafletDivIcon, DomUtil, Marker, PointExpression } from 'leaflet';
import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface DivIconProps {
  children: ReactNode;
  iconSize?: PointExpression;
}

export default function DivIcon({ children, iconSize = [0, 0] }: DivIconProps) {
  const element = DomUtil.create('div');
  const divIcon = new LeafletDivIcon({ className: '', html: element, iconSize });
  const portal = createPortal(children, element);

  const { overlayContainer } = useLeafletContext();
  const marker = overlayContainer as Marker;
  marker.setIcon(divIcon);

  useEffect(() => {
    return () => DomUtil.remove(element);
  });

  return portal;
}

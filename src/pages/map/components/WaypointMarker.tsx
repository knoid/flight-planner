import { Marker } from 'react-leaflet';

import { DivIcon, WaypointNumber } from '../../../components/map';
import { useAirport, useReportingPoint } from '../../../components/POIsContext';
import { Leg } from '../../../components/store/constants';

interface WaypointMarkerProps {
  index: number;
  leg: Leg;
  zIndexOffset?: number;
}

export default function WaypointMarker({ index, leg, zIndexOffset }: WaypointMarkerProps) {
  const airport = useAirport(leg._id);
  const reportingPoint = useReportingPoint(leg._id);
  const poi = airport || reportingPoint;
  if (!poi) {
    return null;
  }
  return (
    <Marker interactive={false} key={leg._id} position={poi.latLng()} zIndexOffset={zIndexOffset}>
      <DivIcon>
        <WaypointNumber>{index + 1}</WaypointNumber>
      </DivIcon>
    </Marker>
  );
}

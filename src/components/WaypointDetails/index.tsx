import { Box, Typography } from '@mui/material';
import { Marker } from 'react-leaflet';

import { AirportIcon, AirspaceMarker, DivIcon, MapContainer, WaypointIcon } from '../map';
import { Airport, Airspace, FrequencyType, Limit, LimitUnit, ReportingPoint } from '../openAIP';
import AirportDetails from './AirportDetails';
import Labelled from './Labelled';
import PointPOI from './PointPOI';

function AirspaceLimit(limit: Limit) {
  if (!limit.value) {
    return '*';
  }

  return (
    <>
      {limit.unit === LimitUnit.FlightLevel && 'FL'}
      {`${limit.value}`.padStart(3, '0')}
      {limit.unit === LimitUnit.Feet && 'ft'}
    </>
  );
}

export interface WaypointDetailsProps {
  airport?: Airport;
  airspace?: Airspace;
  expanded?: boolean;
  reportingPoint?: ReportingPoint;
}

export default function WaypointDetails({
  airport,
  airspace,
  expanded,
  reportingPoint,
}: WaypointDetailsProps) {
  const poi = airport || reportingPoint;
  return (
    <>
      <Box sx={{ width: 120 }}>
        {(poi || airspace) && (
          <MapContainer
            attributionControl={false}
            bounds={airspace?.bounds()}
            boxZoom={false}
            center={poi?.latLng()}
            doubleClickZoom={false}
            dragging={false}
            key={expanded ? 1 : 2}
            keyboard={false}
            scrollWheelZoom={false}
            trackResize={false}
            zoom={12}
            zoomControl={false}
          >
            {airspace && <AirspaceMarker airspace={airspace} />}
            {poi && (
              <Marker interactive={false} position={poi.latLng()}>
                <DivIcon>{airport ? <AirportIcon /> : <WaypointIcon />}</DivIcon>
              </Marker>
            )}
          </MapContainer>
        )}
      </Box>
      <Box sx={(theme) => ({ flexGrow: 1, padding: theme.spacing(1, 2, 2) })}>
        {airport && <AirportDetails airport={airport} />}
        {airspace && (
          <>
            <AirspaceLimit {...airspace.lowerLimit} />-<AirspaceLimit {...airspace.upperLimit} />
            {airspace.frequencies && airspace.frequencies.length > 0 && (
              <>
                <Typography variant="subtitle1">Radios</Typography>
                {airspace.frequencies
                  ?.sort((a, b) => FrequencyType[a.type].localeCompare(FrequencyType[b.type]))
                  .map(({ _id, name, remarks, type, value }) => (
                    <Labelled key={_id} type={name || FrequencyType[type]}>
                      {value} {remarks}
                    </Labelled>
                  ))}
              </>
            )}
          </>
        )}
        {poi && <PointPOI poi={poi} />}
      </Box>
    </>
  );
}

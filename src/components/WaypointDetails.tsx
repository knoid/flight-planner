import { Box, Typography } from '@mui/material';
import { LatLng } from 'leaflet';
import { Marker } from 'react-leaflet';

import { useI18nContext } from '../i18n/i18n-react';
import Labelled from './Labelled';
import { AirportIcon, AirspaceMarker, DivIcon, MapContainer, WaypointIcon } from './map';
import { Composite, FrequencyType, Limit, LimitUnit } from './openAIP';
import { useAirport, useAirspace, useReportingPoint } from './POIsContext';

type CardinalDirections = 'W' | 'S' | 'E' | 'N';

/**
 * Converts decimal degrees to degrees minutes and seconds.
 * https://stackoverflow.com/a/5786281
 */
function convertDDToDMS(D: number, lng: boolean) {
  return {
    dir: (D < 0 ? (lng ? 'W' : 'S') : lng ? 'E' : 'N') as CardinalDirections,
    deg: 0 | (D < 0 ? (D = -D) : D),
    min: 0 | (((D += 1e-9) % 1) * 60),
    sec: (0 | (((D * 60) % 1) * 6000)) / 100,
  };
}

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
  expanded?: boolean;
  id: string;
}

export default function WaypointDetails({ expanded, id }: WaypointDetailsProps) {
  const airport = useAirport(id);
  const airspace = useAirspace(id);
  const reportingPoint = useReportingPoint(id);
  const poi = airport || reportingPoint;
  const latLng = poi?.latLng() || new LatLng(0, 0);
  const { LL } = useI18nContext();
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
        {airport && (
          <>
            <Typography variant="subtitle1">Radios</Typography>
            {airport?.frequencies
              ?.sort((a, b) => FrequencyType[a.type].localeCompare(FrequencyType[b.type]))
              .map(({ _id, name, remarks, type, value }) => (
                <Labelled key={_id} type={name || FrequencyType[type]}>
                  {value} {remarks}
                </Labelled>
              ))}
            <Typography variant="subtitle1">Runways</Typography>
            {airport?.runways?.map((runway) => (
              <Typography key={runway._id}>
                {runway.designator} {Composite[runway.surface.mainComposite]}
              </Typography>
            ))}
          </>
        )}
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
        {poi && (
          <>
            <Typography variant="subtitle1">Coordinates</Typography>
            <div>
              <Typography variant="caption">GPS</Typography>{' '}
              {[latLng.lat, latLng.lng].map((n) => n.toFixed(4)).join(', ')}
            </div>
            <div>
              <Typography variant="caption">DMS</Typography>{' '}
              {[latLng.lat, latLng.lng]
                .map((n, index) => {
                  const { dir, deg, min, sec } = convertDDToDMS(n, index > 0);
                  return (
                    [deg + 'º', `${min}`.padStart(2, '0') + "'", sec + '"'].join('') +
                    LL.cardinalDirections[dir]()
                  );
                })
                .join(' ')}
            </div>
          </>
        )}
      </Box>
    </>
  );
}

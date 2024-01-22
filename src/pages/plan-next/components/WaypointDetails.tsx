import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  Box,
  styled,
  Typography,
} from '@mui/material';
import { LatLng } from 'leaflet';
import { Marker } from 'react-leaflet';

import { AirportIcon, DivIcon, MapContainer, WaypointIcon } from '../../../components/map';
import { Composite, FrequencyType } from '../../../components/openAIP';
import { useAirport, useReportingPoint } from '../../../components/POIsContext';
import { Leg } from '../../../components/store/constants';
import { useI18nContext } from '../../../i18n/i18n-react';
import Labelled from './Labelled';

const Identifier = styled('span')({ fontFamily: 'monospace' });

interface WaypointDetailsProps extends Pick<AccordionProps, 'expanded' | 'onChange'> {
  index: number;
  leg: Leg;
}

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

export default function WaypointDetails({ expanded, index, leg, onChange }: WaypointDetailsProps) {
  const airport = useAirport(leg._id);
  const reportingPoint = useReportingPoint(leg._id);
  const poi = airport || reportingPoint;
  const latLng = poi?.latLng() || new LatLng(0, 0);
  const { LL } = useI18nContext();

  return (
    <Accordion expanded={expanded} onChange={onChange}>
      <AccordionSummary
        aria-controls={`${leg.key}-content`}
        expandIcon={<ExpandMoreIcon />}
        id={leg.key}
      >
        <Typography>
          {index + 1}. <Identifier>{poi?.getIdentifier()}</Identifier>
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ display: 'flex', padding: 0 }}>
        <Box sx={{ width: 120 }}>
          {poi && (
            <MapContainer
              attributionControl={false}
              boxZoom={false}
              center={poi.latLng()}
              doubleClickZoom={false}
              dragging={false}
              key={expanded ? 1 : 2}
              keyboard={false}
              scrollWheelZoom={false}
              trackResize={false}
              zoom={12}
              zoomControl={false}
            >
              <Marker interactive={false} position={poi.latLng()}>
                <DivIcon>{airport ? <AirportIcon /> : <WaypointIcon />}</DivIcon>
              </Marker>
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
      </AccordionDetails>
    </Accordion>
  );
}

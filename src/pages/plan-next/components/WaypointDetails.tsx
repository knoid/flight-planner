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
import { Marker } from 'react-leaflet';

import { AirportIcon, DivIcon, MapContainer, WaypointIcon } from '../../../components/map';
import { Composite, FrequencyType } from '../../../components/openAIP';
import { useAirport, useReportingPoint } from '../../../components/POIsContext';
import { Leg } from '../../../components/store/constants';
import Labelled from './Labelled';

const Identifier = styled('span')({ fontFamily: 'monospace' });

interface WaypointDetailsProps extends Pick<AccordionProps, 'expanded' | 'onChange'> {
  index: number;
  leg: Leg;
}

export default function WaypointDetails({ expanded, index, leg, onChange }: WaypointDetailsProps) {
  const airport = useAirport(leg._id);
  const reportingPoint = useReportingPoint(leg._id);
  const poi = airport || reportingPoint;

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
              <Typography>Radios</Typography>
              {airport?.frequencies
                ?.sort((a, b) => FrequencyType[a.type].localeCompare(FrequencyType[b.type]))
                .map(({ _id, name, remarks, type, value }) => (
                  <Labelled key={_id} type={name || FrequencyType[type]}>
                    {value} {remarks}
                  </Labelled>
                ))}
              <Typography>Runways</Typography>
              {airport?.runways?.map((runway) => (
                <Typography key={runway._id}>
                  {runway.designator} {Composite[runway.surface.mainComposite]}
                </Typography>
              ))}
            </>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

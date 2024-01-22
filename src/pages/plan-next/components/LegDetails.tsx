import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  styled,
  Typography,
} from '@mui/material';

import { useAirport, useReportingPoint } from '../../../components/POIsContext';
import { Leg } from '../../../components/store/constants';
import WaypointDetails from '../../../components/WaypointDetails';

const Identifier = styled('span')({ fontFamily: 'monospace' });

interface LegDetailsProps extends Pick<AccordionProps, 'expanded' | 'onChange'> {
  index: number;
  leg: Leg;
}

export default function LegDetails({ expanded, index, leg, onChange }: LegDetailsProps) {
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
        <WaypointDetails id={leg._id} expanded={expanded} />
      </AccordionDetails>
    </Accordion>
  );
}

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  DragIndicator as DragIndicatorIcon,
  ExpandMore as ExpandMoreIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  IconButton,
  styled,
  Tooltip,
  Typography,
} from '@mui/material';
import { MouseEvent } from 'react';

import { useNotam } from '../../../components/Notam';
import { useAirport, useReportingPoint } from '../../../components/POIsContext';
import { Leg } from '../../../components/store/constants';
import WaypointDetails from '../../../components/WaypointDetails';
import { useI18nContext } from '../../../i18n/i18n-react';

const Identifier = styled('span')({ fontFamily: 'monospace' });

function stopPropagation(event: MouseEvent) {
  event.stopPropagation();
}

interface LegDetailsProps extends Pick<AccordionProps, 'onChange'> {
  expanded: string | false;
  index: number;
  leg: Leg;
}

export default function LegDetails({ expanded, index, leg, onChange }: LegDetailsProps) {
  const airport = useAirport(leg._id);
  const { hasNOTAM } = useNotam(airport?.altIdentifier || airport?.iataCode);
  const reportingPoint = useReportingPoint(leg._id);
  const poi = airport || reportingPoint;
  const { LL } = useI18nContext();
  const { attributes, listeners, setActivatorNodeRef, setNodeRef, transform, transition } =
    useSortable({ id: leg.key, data: { label: poi?.getLabel() } });
  const style = {
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
  };
  const isExpanded = expanded === leg.key;

  return (
    <Accordion
      expanded={isExpanded}
      onChange={onChange}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <AccordionSummary
        aria-controls={`${leg.key}-content`}
        expandIcon={<ExpandMoreIcon />}
        id={leg.key}
      >
        {!expanded && (
          <IconButton
            ref={setActivatorNodeRef}
            sx={{ margin: -1, marginRight: 0, touchAction: 'none' }}
            aria-label={LL.dragLeg()}
            {...listeners}
          >
            <DragIndicatorIcon />
          </IconButton>
        )}
        <Typography>
          {index + 1}. <Identifier>{poi?.getIdentifier()}</Identifier>
          {hasNOTAM && (
            <Tooltip title="check NOTAMs">
              <IconButton
                href="https://ais.anac.gov.ar/notam"
                onClick={stopPropagation}
                rel="noreferrer"
                size="small"
                sx={{ my: -1 }}
                target="_blank"
              >
                <OpenInNewIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          )}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ display: 'flex', padding: 0 }}>
        <WaypointDetails airport={airport} expanded={isExpanded} reportingPoint={reportingPoint} />
      </AccordionDetails>
    </Accordion>
  );
}

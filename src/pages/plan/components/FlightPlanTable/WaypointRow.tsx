import { alpha, darken, lighten, styled, TableRow } from '@mui/material';
import { useCallback, useState } from 'react';

import * as math from '../../../../components/math';
import { useAirport, useReportingPoint } from '../../../../components/POIsContext';
import { useStore } from '../../../../components/store';
import { Leg } from '../../../../components/store/constants';
import timeToDate from '../../../../utils/timeToDate';
import { TableCell } from '../Table';
import AltitudeInput from '../TextFields/AltitudeInput';
import TimeInput from '../TextFields/TimeInput';
import WindInput from '../TextFields/WindInput';
import AddNotesCell from './AddNotesCell';
import { CommonCells, CommonCellsProps, formatDistance, formatDuration, pad2 } from './common';
import NotesRow from './NotesRow';
import { Partial } from './usePartials';

export const FillInCell = styled(TableCell)(({ theme }) => {
  const borderColor =
    theme.palette.mode === 'light'
      ? lighten(alpha(theme.palette.divider, 1), 0.88)
      : darken(alpha(theme.palette.divider, 1), 0.68);
  return {
    borderLeft: `1px solid ${borderColor}`,
    color: borderColor,
    textAlign: 'center',
    '& + &': {
      borderRight: `1px solid ${borderColor}`,
    },
  };
});

const VisuallyHidden = styled('span')({
  visibility: 'hidden',
});

function formatDegrees(radians: number) {
  const degrees = math.remainder(math.toDegrees(radians), 360);
  return Math.round(degrees).toString().padStart(3, '0');
}

function formatTime(date: Date) {
  const hours = pad2(date.getHours());
  const minutes = pad2(date.getMinutes());
  return `${hours}:${minutes}`;
}

const hour = 60 * 60 * 1000;

interface TableRowProps extends Omit<CommonCellsProps, 'poi'> {
  hasAltitude?: boolean;
  leg: Leg;
  onAltitudeChange: (index: number, value: string) => void;
  onAltitudeCopyDown: (index: number) => void;
  onNotesChange: (index: number, value?: string) => void;
  onWindChange: (index: number, value: string) => void;
  onWindCopyDown: (index: number) => void;
  totals: Partial;
}

export default function WaypointRow({
  hasAltitude,
  leg,
  onAltitudeChange: onAltitudeChangeProp,
  onAltitudeCopyDown: onAltitudeCopyDownProp,
  onNotesChange: onNotesChangeProp,
  onWindChange: onWindChangeProp,
  onWindCopyDown: onWindCopyDownProp,
  totals,
  ...commonCellsProps
}: TableRowProps) {
  const { index, partial } = commonCellsProps;
  const { fuel, startTime: savedStartTime } = useStore();
  const remainingFuel = fuel.capacity - totals.tripFuel;
  const airport = useAirport(leg._id);
  const reportingPoint = useReportingPoint(leg._id);

  const [open, setOpen] = useState(typeof leg.notes === 'string');
  function toggleNotes() {
    setOpen((open) => !open);
  }

  const onAltitudeChange = useCallback(
    (value: string) => onAltitudeChangeProp(index, value),
    [index],
  );
  const onAltitudeCopyDown = useCallback(() => onAltitudeCopyDownProp(index), [index]);
  const onNotesChange = useCallback((value?: string) => onNotesChangeProp(index, value), [index]);
  const onWindChange = useCallback((value: string) => onWindChangeProp(index, value), [index]);
  const onWindCopyDown = useCallback(() => onWindCopyDownProp(index), [index]);

  if (index > 0) {
    const hasRem = fuel.capacity >= 0;
    const inReserve = hasRem && remainingFuel <= fuel.reserve;
    const noFuel = hasRem && remainingFuel <= 0;
    const startTime = savedStartTime ? timeToDate(savedStartTime) : null;
    const eta = startTime ? new Date(startTime.getTime() + totals.ete * hour) : null;
    return (
      <>
        <TableRow>
          <CommonCells poi={airport || reportingPoint} {...commonCellsProps} />
          <TableCell align="right">
            {partial.distance > 0 ? formatDistance(partial.distance) : ''}
          </TableCell>
          <TableCell hideInPrint={!hasAltitude}>
            <AltitudeInput
              aria-describedby="altitude-label"
              onChange={onAltitudeChange}
              onCopyDown={onAltitudeCopyDown}
              value={leg.altitude}
            />
          </TableCell>
          <TableCell align="center">
            {partial.course > -1 ? formatDegrees(partial.course) : ''}
          </TableCell>
          <TableCell padding="none">
            <WindInput
              aria-describedby="wind-label"
              onCopyDown={onWindCopyDown}
              onChange={onWindChange}
              value={leg.wind}
            />
          </TableCell>
          <TableCell align="center">
            {partial.heading > -1 ? formatDegrees(partial.heading) : ''}
          </TableCell>
          <TableCell>{partial.groundSpeed > -1 ? Math.round(partial.groundSpeed) : ''}</TableCell>
          <TableCell align="center">{partial.ete > 0 ? formatDuration(partial.ete) : ''}</TableCell>
          <FillInCell>{eta ? formatTime(eta) : ''}</FillInCell>
          <FillInCell />
          <TableCell>{partial.tripFuel !== -1 ? partial.tripFuel.toFixed(2) : ''}</TableCell>
          <TableCell color={noFuel ? 'error' : inReserve ? 'warning' : undefined}>
            {hasRem ? remainingFuel.toFixed(2) : ''}
          </TableCell>
          <AddNotesCell onClick={toggleNotes} open={open} />
        </TableRow>
        <NotesRow onChange={onNotesChange} value={leg.notes || ''} open={open} />
      </>
    );
  }

  return (
    <>
      <TableRow>
        <CommonCells poi={airport} {...commonCellsProps} />
        <TableCell colSpan={6} />
        <TableCell hideInPrint={!hasAltitude} />
        <FillInCell>
          <TimeInput />
        </FillInCell>
        <FillInCell>
          <VisuallyHidden>
            <TimeInput />
          </VisuallyHidden>
        </FillInCell>
        <TableCell />
        <TableCell>{remainingFuel !== -1 ? remainingFuel.toFixed(2) : ''}</TableCell>
        <AddNotesCell onClick={toggleNotes} open={open} />
      </TableRow>
      <NotesRow onChange={onNotesChange} open={open} value={leg.notes || ''} />
    </>
  );
}

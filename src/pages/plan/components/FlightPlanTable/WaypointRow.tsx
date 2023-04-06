import { alpha, darken, lighten, styled, TableRow } from '@mui/material';
import { useState } from 'react';

import * as math from '../../../../components/math';
import { useStore } from '../../../../components/store';
import { TableCell } from '../Table';
import AltitudeInput from '../TextFields/AltitudeInput';
import TimeInput from '../TextFields/TimeInput';
import WindInput from '../TextFields/WindInput';
import useWaypoint from '../useWaypoint';
import AddNotesCell from './AddNotesCell';
import { CommonCells, CommonCellsProps, formatDistance, formatDuration, pad2 } from './common';
import NotesRow from './NotesRow';

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

interface TableRowProps extends Omit<CommonCellsProps, 'airport'> {
  hasAltitude?: boolean;
  onAltitudeChange: (value: string) => void;
  onAltitudeCopyDown: () => void;
  onNotesChange: (value?: string) => void;
  onWindChange: (value: string) => void;
  onWindCopyDown: () => void;
}

export default function WaypointRow({
  hasAltitude,
  onAltitudeChange,
  onAltitudeCopyDown,
  onNotesChange,
  onWindChange,
  onWindCopyDown,
  ...commonCellsProps
}: TableRowProps) {
  const { index, partial } = commonCellsProps;
  const { fuel } = useStore();
  const airport = useWaypoint(partial.leg);

  const [open, setOpen] = useState(typeof partial.leg.notes === 'string');
  function toggleNotes() {
    setOpen((open) => !open);
  }

  if (index > 0) {
    const hasRem = partial.remainingFuel !== -1;
    const inReserve = hasRem && partial.remainingFuel <= fuel.reserve;
    const noFuel = hasRem && partial.remainingFuel <= 0;
    return (
      <>
        <TableRow>
          <CommonCells airport={airport} {...commonCellsProps} />
          <TableCell align="right">
            {partial.distance > 0 ? formatDistance(partial.distance) : ''}
          </TableCell>
          <TableCell hideInPrint={!hasAltitude}>
            <AltitudeInput
              aria-describedby="altitude-label"
              onChange={onAltitudeChange}
              onCopyDown={onAltitudeCopyDown}
              value={partial.leg.altitude}
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
              value={partial.leg.wind}
            />
          </TableCell>
          <TableCell align="center">
            {partial.heading > -1 ? formatDegrees(partial.heading) : ''}
          </TableCell>
          <TableCell>{partial.groundSpeed > -1 ? Math.round(partial.groundSpeed) : ''}</TableCell>
          <TableCell align="center">{partial.ete > 0 ? formatDuration(partial.ete) : ''}</TableCell>
          <FillInCell>{partial.eta ? formatTime(partial.eta) : ''}</FillInCell>
          <FillInCell />
          <TableCell>{partial.tripFuel !== -1 ? partial.tripFuel.toFixed(2) : ''}</TableCell>
          <TableCell color={noFuel ? 'error' : inReserve ? 'warning' : undefined}>
            {hasRem ? partial.remainingFuel.toFixed(2) : ''}
          </TableCell>
          <AddNotesCell onClick={toggleNotes} open={open} />
        </TableRow>
        <NotesRow onChange={onNotesChange} value={partial.leg.notes || ''} open={open} />
      </>
    );
  }

  return (
    <>
      <TableRow>
        <CommonCells airport={airport} {...commonCellsProps} />
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
        <TableCell>
          {partial.remainingFuel !== -1 ? partial.remainingFuel.toFixed(2) : ''}
        </TableCell>
        <AddNotesCell onClick={toggleNotes} open={open} />
      </TableRow>
      <NotesRow onChange={onNotesChange} open={open} value={partial.leg.notes || ''} />
    </>
  );
}
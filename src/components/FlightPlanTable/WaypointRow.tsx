import { Functions } from '@mui/icons-material';
import { alpha, darken, lighten, styled, TableRow } from '@mui/material';
import { useState } from 'react';
import * as math from '../math';
import TimeInput from '../TextFields/TimeInput';
import WindInput from '../TextFields/WindInput';
import AddNotesCell from './AddNotesCell';
import { CommonCells, CommonCellsProps, formatDuration, pad2 } from './common';
import NotesRow from './NotesRow';
import TableCell, { TableCellProps } from './TableCell';
import useWaypoint from './useWaypoint';

export const FillInCell = styled(TableCell)<TableCellProps>(({ theme }) => {
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

const SumIcon = styled(Functions)({
  verticalAlign: 'bottom',
  marginLeft: -24,
});

const VisuallyHidden = styled('span')({
  visibility: 'hidden',
});

function formatDegrees(radians: number) {
  return Math.round(math.toDegrees(radians)).toString().padStart(3, '0');
}

function formatTime(date: Date) {
  const hours = pad2(date.getHours());
  const minutes = pad2(date.getMinutes());
  return `${hours}:${minutes}`;
}

interface TableRowProps extends Omit<CommonCellsProps, 'metadata'> {
  onETAChange: (value: string) => void;
  onNotesChange: (value?: string) => void;
  onWindChange: (value: string) => void;
  onWindCopyDown: () => void;
  totalTime: number;
}
export default function WaypointRow({
  onETAChange,
  onNotesChange,
  onWindChange,
  onWindCopyDown,
  totalTime,
  ...commonCellsProps
}: TableRowProps) {
  const { index, partial } = commonCellsProps;
  const { code } = partial.leg;
  const metadata = useWaypoint(code);

  const [open, setOpen] = useState(typeof partial.leg.notes === 'string');
  function toggleNotes() {
    setOpen((open) => !open);
  }

  if (index > 0) {
    return (
      <>
        <TableRow>
          <CommonCells metadata={metadata} {...commonCellsProps} />
          <TableCell align="right">
            {partial.distance > 0 ? (math.toDegrees(partial.distance) * 60).toFixed(1) : ''}
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
          <TableCell>{partial.ete > 0 ? formatDuration(partial.ete) : ''}</TableCell>
          <FillInCell>{partial.eta ? formatTime(partial.eta) : ''}</FillInCell>
          <FillInCell />
          <TableCell>{partial.tripFuel !== -1 ? partial.tripFuel.toFixed(2) : ''}</TableCell>
          <TableCell
            color={partial.remainingFuel !== -1 && partial.remainingFuel <= 0 ? 'error' : undefined}
          >
            {partial.remainingFuel !== -1 ? partial.remainingFuel.toFixed(2) : ''}
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
        <CommonCells metadata={metadata} {...commonCellsProps} />
        <TableCell colSpan={5} />
        <TableCell>
          <SumIcon aria-label="sum" />
          {formatDuration(totalTime)}
        </TableCell>
        <FillInCell>
          <TimeInput onChange={onETAChange} />
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

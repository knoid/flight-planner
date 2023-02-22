import { Functions } from '@mui/icons-material';
import { alpha, darken, lighten, styled, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import cachedFetch from '../cachedFetch';
import * as math from '../math';
import TimeInput from '../TextFields/TimeInput';
import WindInput from '../TextFields/WindInput';
import AddNotesCell from './AddNotesCell';
import { CommonCells, CommonCellsProps, formatDuration, Metadata, pad2 } from './common';
import NotesRow from './NotesRow';
import TableCell, { TableCellProps } from './TableCell';

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

const km2nm = 1 / 1.852;

interface MadhelDetailsResponse {
  metadata: {
    localization: {
      distance_reference: string;
      direction_reference: string;
    };
  };
}

interface FrequenciesResponse {
  ATIS?: number;
  COM?: number;
}

interface TableRowProps extends Omit<CommonCellsProps, 'metadata'> {
  onETAChange: (value: string) => void;
  onNotesChange: (value?: string) => void;
  onWindChange: (value: string) => void;
  onWindCopyDown: () => void;
  totalTime: number;
}

function isOK(
  response: PromiseSettledResult<Response>
): response is PromiseFulfilledResult<Response> {
  return (
    response.status === 'fulfilled' &&
    response.value.ok &&
    (response.value.headers.get('Content-Type')?.includes('json') || false)
  );
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
  const [metadata, setMetadata] = useState<Metadata | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      const [madhelResponse, frequenciesResponse] = await Promise.allSettled([
        cachedFetch(`https://datos.anac.gob.ar/madhel/api/v2/airports/${code}/?format=json`),
        fetch(`data/AR/${code}.json`),
      ]);

      if (active) {
        const result: Metadata = {};
        if (isOK(madhelResponse)) {
          const madhelResult: MadhelDetailsResponse = await madhelResponse.value.json();
          result.distanceReference =
            Number(madhelResult.metadata.localization.distance_reference) * km2nm;
          result.directionReference =
            madhelResult.metadata.localization.direction_reference.replace(/O$/u, 'W');
        }

        if (isOK(frequenciesResponse)) {
          const frequenciesResult: FrequenciesResponse = await frequenciesResponse.value.json();
          Object.assign(result, frequenciesResult);
        }
        setMetadata(result);
      }
    })();

    return () => {
      active = false;
    };
  }, [code]);

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

import { styled } from '@mui/material';
import ControlButtons from './ControlButtons';
import { Partial } from './legsToPartials';
import TableCell, { TableCellProps } from './TableCell';

export function pad2(num: number) {
  return num.toString().padStart(2, '0');
}

export function formatDuration(hours: number) {
  const minutes = hours * 60;
  return `${Math.floor(minutes / 60)}:${pad2(Math.round(minutes % 60))}`;
}

const NoWrapTableCell = styled(TableCell)<TableCellProps>({
  whiteSpace: 'nowrap',
});

export interface Metadata {
  frequencies: {
    COM?: number;
    GND?: number;
    TWR?: number;
    VOR?: number;
  };
  reference?: {
    distance: number;
    direction: string;
  };
}

export interface CommonCellsProps {
  disableDown: boolean;
  disableUp: boolean;
  index: number;
  metadata: Metadata | null;
  onMoveDown: () => void;
  onMoveUp: () => void;
  onRemove: () => void;
  partial: Partial;
}

export function CommonCells({
  disableDown,
  disableUp,
  index,
  metadata,
  onMoveDown,
  onMoveUp,
  onRemove,
  partial,
}: CommonCellsProps) {
  const freq = metadata?.frequencies || {};
  return (
    <>
      <TableCell align="right" padding="none">
        <ControlButtons
          disableDown={disableDown}
          disableUp={disableUp}
          onMoveDown={onMoveDown}
          onMoveUp={onMoveUp}
          onRemove={onRemove}
        />
      </TableCell>
      <TableCell>{index + 1}.</TableCell>
      <TableCell>{partial.leg.code}</TableCell>
      {metadata ? (
        <>
          <TableCell>{freq.COM ? freq.COM.toFixed(2) : ''}</TableCell>
          <TableCell>{freq.TWR ? freq.TWR.toFixed(2) : ''}</TableCell>
          <TableCell>{freq.GND ? freq.GND.toFixed(2) : ''}</TableCell>
          <NoWrapTableCell align="center">
            {metadata.reference && Math.round(metadata.reference.distance) + ' ' + metadata.reference.direction}
          </NoWrapTableCell>
        </>
      ) : (
        <TableCell colSpan={4} />
      )}
    </>
  );
}

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
  whiteSpace: 'nowrap'
})

export interface Metadata {
  COM?: number;
  distanceReference?: number;
  directionReference?: string;
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
          {/* <TableCell>{partial.leg.poi.GND?.toFixed(2)}</TableCell> */}
          <TableCell>{metadata.COM ? metadata.COM.toFixed(2) : ''}</TableCell>
          {/* <TableCell>{partial.leg.poi.VOR?.toFixed(2)}</TableCell> */}
          <NoWrapTableCell align="center">
            {metadata.distanceReference ? Math.round(metadata.distanceReference) : ''}{' '}
            {metadata.directionReference}
          </NoWrapTableCell>
        </>
      ) : (
        <TableCell colSpan={2} />
      )}
    </>
  );
}

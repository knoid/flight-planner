import { Map } from '@mui/icons-material';
import { IconButton, styled } from '@mui/material';
import HideOnPrint from '../HideOnPrint';
import * as math from '../math';
import { useStore } from '../store';
import { TableCell } from '../Table';
import ControlButtons from './ControlButtons';
import Frequency from './Frequency';
import { Partial } from './legsToPartials';

export function pad2(num: number) {
  return num.toString().padStart(2, '0');
}

export function formatDistance(distance: number) {
  return (math.toDegrees(distance) * 60).toFixed(1);
}

export function formatDuration(hours: number) {
  const minutes = hours * 60;
  return `${Math.floor(minutes / 60)}:${pad2(Math.round(minutes % 60))}`;
}

const Grid = styled('div')({
  display: 'inline-grid',
  gap: '10px',
  gridAutoFlow: 'column',
});

const NoWrapTableCell = styled(TableCell)({
  whiteSpace: 'nowrap',
});

export interface Metadata {
  frequencies: {
    APP?: number;
    ATIS?: number;
    CLRD?: number;
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
  const { includeFrequencies } = useStore();
  const frequencies = Object.entries(metadata?.frequencies || {}).sort(([a], [b]) =>
    b.localeCompare(a)
  );
  const ref = metadata?.reference;
  const { poi } = partial.leg;
  let googleMapsUrl;
  if (poi) {
    const coords = poi.coords.map(math.toDegrees).join(',');
    if (poi.type === 'airport') {
      // https://developers.google.com/maps/documentation/urls/get-started#map-action
      const qs = new URLSearchParams({
        api: '1',
        basemap: 'satellite',
        center: coords,
        map_action: 'map',
      });
      googleMapsUrl = `https://www.google.com/maps/@?${qs.toString()}`;
    } else if (poi.type === 'waypoint') {
      // https://developers.google.com/maps/documentation/urls/get-started#search-action
      const qs = new URLSearchParams({
        api: '1',
        query: coords,
      });
      googleMapsUrl = `https://www.google.com/maps/search/?${qs.toString()}`;
    }
  }
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
          {includeFrequencies && (
            <TableCell>
              <Grid>
                {frequencies.map(([name, freq]) => (
                  <Frequency key={name} name={name} frequency={freq} />
                ))}
              </Grid>
            </TableCell>
          )}
          <NoWrapTableCell align="center">
            {ref && Math.round(ref.distance) + ' ' + ref.direction}
            {googleMapsUrl && (
              <HideOnPrint component="span">
                <IconButton
                  href={googleMapsUrl}
                  size="small"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Map />
                </IconButton>
              </HideOnPrint>
            )}
          </NoWrapTableCell>
        </>
      ) : (
        <TableCell colSpan={2} />
      )}
    </>
  );
}

import { Map } from '@mui/icons-material';
import { IconButton, styled } from '@mui/material';
import { useCallback } from 'react';
import { LocalizedString } from 'typesafe-i18n';

import * as math from '../../../../components/math';
import { useStore } from '../../../../components/store';
import { useI18nContext } from '../../../../i18n/i18n-react';
import HideOnPrint from '../HideOnPrint';
import { TableCell } from '../Table';
import ControlButtons from './ControlButtons';
import Labelled from './Labelled';
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

function translateCardinalDirections(
  translations: Record<'N' | 'E' | 'S' | 'W', () => LocalizedString>,
  value: string,
) {
  return value
    .replaceAll('N', translations['N'])
    .replaceAll('E', translations['E'])
    .replaceAll('S', translations['S'])
    .replaceAll('W', translations['W']);
}

const Grid = styled('div')({
  display: 'inline-grid',
  gap: '10px',
  gridAutoFlow: 'column',
});

const NoWrapTableCell = styled(TableCell)({
  whiteSpace: 'nowrap',
});

interface Frequency {
  type: string;
  frequency: number;
}

interface Runway {
  orientations: [string, string];
  type: 'asphalt' | 'concrete' | 'dirt';
}

export interface Airport {
  condition: 'private' | 'public';
  controlled: boolean;
  coordinates: [lat: number, lon: number];
  /** In feet. */
  elevation?: number;
  frequencies: Frequency[];
  identifiers: {
    iata?: string;
    icao?: string;
    local: string;
  };
  name: string;
  radio_helpers: Frequency[];
  reference?: { direction: string; distance: number };
  runways: Runway[];
  type: 'airport' | 'helipad';
}

export interface CommonCellsProps {
  airport: Airport | null;
  disableDown: boolean;
  disableUp: boolean;
  index: number;
  onMoveLeg: (direction: number, index: number) => void;
  onRemove: (index: number) => void;
  partial: Partial;
}

export function CommonCells({
  airport,
  disableDown,
  disableUp,
  index,
  onMoveLeg,
  onRemove: onRemoveProp,
  partial,
}: CommonCellsProps) {
  const { LL } = useI18nContext();
  const { includeFrequencies } = useStore();
  const frequencies = (airport?.frequencies || []).sort(({ type: a }, { type: b }) =>
    b.localeCompare(a),
  );
  const ref = airport?.reference;
  const { poi } = partial.leg;
  let googleMapsUrl;
  if (poi) {
    const coordinates = poi.coordinates.join(',');
    if (poi.type === 'airport') {
      // https://developers.google.com/maps/documentation/urls/get-started#map-action
      const qs = new URLSearchParams({
        api: '1',
        basemap: 'satellite',
        center: coordinates,
        map_action: 'map',
      });
      googleMapsUrl = `https://www.google.com/maps/@?${qs.toString()}`;
    } else if (poi.type === 'waypoint') {
      // https://developers.google.com/maps/documentation/urls/get-started#search-action
      const qs = new URLSearchParams({
        api: '1',
        query: coordinates,
      });
      googleMapsUrl = `https://www.google.com/maps/search/?${qs.toString()}`;
    }
  }

  const onMoveDown = useCallback(() => onMoveLeg(+1, index), [index]);
  const onMoveUp = useCallback(() => onMoveLeg(-1, index), [index]);
  const onRemove = useCallback(() => onRemoveProp(index), [index]);

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
      {airport ? (
        <>
          {includeFrequencies && (
            <TableCell>
              <Grid>
                {frequencies.map(({ type, frequency }) => (
                  <Labelled key={type} type={type} frequency={frequency} />
                ))}
              </Grid>
            </TableCell>
          )}
          <NoWrapTableCell align="center">
            {ref &&
              Math.round(ref.distance) +
                ' ' +
                translateCardinalDirections(LL.cardinalDirections, ref.direction)}
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
        <TableCell colSpan={1 + (includeFrequencies ? 1 : 0)} />
      )}
    </>
  );
}

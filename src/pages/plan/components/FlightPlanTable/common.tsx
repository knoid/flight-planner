import { Map } from '@mui/icons-material';
import { IconButton, styled } from '@mui/material';
import { useCallback } from 'react';

import * as math from '../../../../components/math';
import { Airport, FrequencyType, ReportingPoint } from '../../../../components/openAIP';
import { useStore } from '../../../../components/store';
import reverse from '../../../../utils/reverse';
import HideOnPrint from '../HideOnPrint';
import { TableCell } from '../Table';
import ControlButtons from './ControlButtons';
import Labelled from './Labelled';
import { Partial } from './usePartials';

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

export interface CommonCellsProps {
  disableDown: boolean;
  disableUp: boolean;
  index: number;
  onMoveLeg: (direction: number, index: number) => void;
  onRemove: (index: number) => void;
  partial: Partial;
  poi: Airport | ReportingPoint | undefined;
}

export function CommonCells({
  poi,
  disableDown,
  disableUp,
  index,
  onMoveLeg,
  onRemove: onRemoveProp,
}: CommonCellsProps) {
  const { includeFrequencies } = useStore();
  let googleMapsUrl;
  if (poi) {
    const coordinates = reverse(poi.geometry.coordinates).join(',');
    if (poi instanceof Airport) {
      // https://developers.google.com/maps/documentation/urls/get-started#map-action
      const qs = new URLSearchParams({
        api: '1',
        basemap: 'satellite',
        center: coordinates,
        map_action: 'map',
      });
      googleMapsUrl = `https://www.google.com/maps/@?${qs.toString()}`;
    } else if (poi instanceof ReportingPoint) {
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
      <TableCell>{poi?.getIdentifier()}</TableCell>
      {poi instanceof Airport ? (
        <>
          {includeFrequencies && (
            <TableCell>
              <Grid>
                {poi.frequencies?.map(({ _id, name, type, value }) => (
                  <Labelled key={_id} type={name || FrequencyType[type]} frequency={value} />
                ))}
              </Grid>
            </TableCell>
          )}
          <TableCell align="center">
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
          </TableCell>
        </>
      ) : (
        <TableCell colSpan={1 + (includeFrequencies ? 1 : 0)} />
      )}
    </>
  );
}

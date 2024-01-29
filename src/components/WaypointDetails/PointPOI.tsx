import { Typography } from '@mui/material';
import { LatLng } from 'leaflet';

import { useI18nContext } from '../../i18n/i18n-react';
import { Airport, ReportingPoint } from '../openAIP';

type CardinalDirections = 'W' | 'S' | 'E' | 'N';

/**
 * Converts decimal degrees to degrees minutes and seconds.
 * https://stackoverflow.com/a/5786281
 */
function convertDDToDMS(D: number, lng: boolean) {
  return {
    dir: (D < 0 ? (lng ? 'W' : 'S') : lng ? 'E' : 'N') as CardinalDirections,
    deg: 0 | (D < 0 ? (D = -D) : D),
    min: 0 | (((D += 1e-9) % 1) * 60),
    sec: (0 | (((D * 60) % 1) * 6000)) / 100,
  };
}

interface PointPOIProps {
  poi?: Airport | ReportingPoint;
}

export default function PointPOI({ poi }: PointPOIProps) {
  const latLng = poi?.latLng() || new LatLng(0, 0);
  const { LL } = useI18nContext();
  return (
    <>
      <Typography variant="subtitle1">{LL.coordinates()}</Typography>
      <div>
        <Typography variant="caption">GPS</Typography>{' '}
        {[latLng.lat, latLng.lng].map((n) => n.toFixed(4)).join(', ')}
      </div>
      <div>
        <Typography variant="caption">DMS</Typography>{' '}
        {[latLng.lat, latLng.lng]
          .map((n, index) => {
            const { dir, deg, min, sec } = convertDDToDMS(n, index > 0);
            return (
              [deg + 'º', `${min}`.padStart(2, '0') + "'", sec + '"'].join('') +
              LL.cardinalDirections[dir]()
            );
          })
          .join(' ')}
      </div>
    </>
  );
}

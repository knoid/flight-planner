import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

import fuelUnits from '../../../components/fuelUnits';
import * as math from '../../../components/math';
import { useStore } from '../../../components/store';
import { useI18nContext } from '../../../i18n/i18n-react';
import { formatDistance, formatDuration } from '../../plan/components/FlightPlanTable/common';
import { Partial } from '../../plan/components/FlightPlanTable/usePartials';

interface StatProps {
  children: ReactNode;
  total?: boolean;
}

function Stat({ children, total }: StatProps) {
  return (
    <Typography
      variant="body2"
      textAlign="center"
      flexGrow={1}
      fontWeight={total ? 'bold' : 'normal'}
    >
      {children}
    </Typography>
  );
}

function formatDegrees(radians: number) {
  const degrees = math.remainder(math.toDegrees(radians), 360);
  return Math.round(degrees).toString().padStart(3, '0');
}

type Addable<T> = { [key in keyof T as T[key] extends number ? key : never]: T[key] };

export interface TripStatsProps {
  partial: Addable<Partial>;
  total?: boolean;
}

export default function TripStats({ partial, total }: TripStatsProps) {
  const { LL } = useI18nContext();
  const { fuel } = useStore();
  return (
    <Box display="flex" m={1} onClick={(event) => event.preventDefault()}>
      <Stat total={total}>{total ? LL.totals() : formatDegrees(partial.course)}</Stat>
      <Stat total={total}>
        {formatDistance(partial.distance)} {LL.nauticalMiles_unit()}
      </Stat>
      <Stat total={total}>{formatDuration(partial.ete)} hs</Stat>
      <Stat total={total}>
        {partial.tripFuel.toFixed(2)} {fuelUnits.get(fuel.unit)}
      </Stat>
    </Box>
  );
}

import { Grid } from '@mui/material';

import fuelUnits from '../../../components/fuelUnits';
import * as math from '../../../components/math';
import { useStore } from '../../../components/store';
import { useI18nContext } from '../../../i18n/i18n-react';
import { formatDistance, formatDuration } from '../../plan/components/FlightPlanTable/common';
import { Partial } from '../../plan/components/FlightPlanTable/usePartials';
import Stat from './Stat';

function formatDegrees(radians: number) {
  const degrees = math.remainder(math.toDegrees(radians), 360);
  return Math.round(degrees).toString().padStart(3, '0');
}

export function pad2(num: number) {
  return num.toString().padStart(2, '0');
}

interface TripStatsProps {
  partial: Partial;
  total?: boolean;
}

export default function TripStats({ partial, total }: TripStatsProps) {
  const { LL } = useI18nContext();
  const { fuel } = useStore();
  const heading = partial.heading || partial.course;
  return (
    <Grid container my={1} onClick={(event) => event.preventDefault()}>
      <Stat total={total} />
      <Stat total={total} />
      <Stat total={total}>
        {total ? LL.totals() : heading > -1 ? `${formatDegrees(heading)}º` : ''}
      </Stat>
      <Stat total={total}>
        {formatDistance(partial.distance)} {LL.nauticalMiles_unit()}
      </Stat>
      <Stat total={total}>{partial.ete > 0 ? `${formatDuration(partial.ete)} hs` : ''}</Stat>
      <Stat total={total}>
        {partial.tripFuel.toFixed(2)} {fuelUnits.get(fuel.unit)}
      </Stat>
    </Grid>
  );
}

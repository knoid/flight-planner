import { Grid } from '@mui/material';

import fuelUnits from '../../../components/fuelUnits';
import * as math from '../../../components/math';
import { useStore } from '../../../components/store';
import { Leg } from '../../../components/store/constants';
import { useI18nContext } from '../../../i18n/i18n-react';
import { formatDistance, formatDuration } from '../../plan/components/FlightPlanTable/common';
import { Partial } from '../../plan/components/FlightPlanTable/usePartials';
import Stat from './Stat';
import WindPicker from './WindPicker';

function formatDegrees(radians: number) {
  const degrees = math.remainder(math.toDegrees(radians), 360);
  return Math.round(degrees).toString().padStart(3, '0');
}

export function pad2(num: number) {
  return num.toString().padStart(2, '0');
}

interface PartialTripProps {
  leg: Leg;
  partial: Partial;
  total?: undefined;
}

interface TotalsProps {
  leg?: undefined;
  partial: Partial;
  total: true;
}

type TripStatsProps = PartialTripProps | TotalsProps;

export default function TripStats({ leg, partial, total }: TripStatsProps) {
  const { LL } = useI18nContext();
  const { fuel, setLegs } = useStore();
  const heading = partial.heading || partial.course;

  const handleWindChange = (value: string) => {
    setLegs((legs) => [...legs.map((l) => (l === leg ? { ...l, wind: value } : l))]);
  };

  return (
    <Grid container my={1} onClick={(event) => event.preventDefault()}>
      <Stat total={total}>
        {total ? '' : <WindPicker onChange={handleWindChange} value={leg.wind} />}
      </Stat>
      <Stat total={total}>{total ? '' : heading > -1 ? `${formatDegrees(heading)}º` : ''}</Stat>
      <Stat total={total}>
        {total
          ? LL.totals()
          : partial.groundSpeed > -1
          ? `${Math.round(partial.groundSpeed)} kt`
          : ''}
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

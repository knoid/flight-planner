import { Box } from '@mui/material';
import { SyntheticEvent, useState } from 'react';

import fuelUnits from '../../components/fuelUnits';
import * as math from '../../components/math';
import { useStore } from '../../components/store';
import { useI18nContext } from '../../i18n/i18n-react';
import { WorldMagneticModel } from '../../utils/WorldMagneticModel';
import { formatDistance, formatDuration } from '../plan/components/FlightPlanTable/common';
import usePartials from '../plan/components/FlightPlanTable/usePartials';
import Total from './components/Total';
import WaypointDetails from './components/WaypointDetails';

let savedExpanded: string | false = false;
const wmm = new WorldMagneticModel();

export const Component = function PlanPage() {
  const { LL } = useI18nContext();
  const { fuel, legs } = useStore();
  const [expanded, setExpanded] = useState<string | false>(savedExpanded);
  const partials = usePartials(wmm);
  const totalFuelConsumption = math.sum(
    ...partials.map((partial) => partial.tripFuel).filter((trip) => trip > 0),
  );
  const totalTripDistance = math.sum(...partials.map((partial) => partial.distance));
  const totalTripDuration = math.sum(
    ...partials.map((partial) => partial.ete).filter((ete) => ete > 0),
  );

  const handleChange = (panel: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
    savedExpanded = isExpanded ? panel : false;
    setExpanded(savedExpanded);
  };

  return (
    <>
      <Box display="flex" m={1}>
        <Total>
          {formatDistance(totalTripDistance)} {LL.nauticalMiles_unit()}
        </Total>
        <Total>{formatDuration(totalTripDuration)} hs</Total>
        <Total>
          {totalFuelConsumption.toFixed(2)} {fuelUnits.get(fuel.unit)}
        </Total>
      </Box>
      {legs.map((leg, index) => (
        <WaypointDetails
          expanded={expanded === leg._id}
          index={index}
          key={leg.key}
          leg={leg}
          onChange={handleChange(leg._id)}
        />
      ))}
    </>
  );
};

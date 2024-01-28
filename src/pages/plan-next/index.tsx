import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box } from '@mui/material';
import { SyntheticEvent, useState } from 'react';

import fuelUnits from '../../components/fuelUnits';
import * as math from '../../components/math';
import { useStore } from '../../components/store';
import { useI18nContext } from '../../i18n/i18n-react';
import { WorldMagneticModel } from '../../utils/WorldMagneticModel';
import { formatDistance, formatDuration } from '../plan/components/FlightPlanTable/common';
import usePartials from '../plan/components/FlightPlanTable/usePartials';
import DndContext from './components/DndContext';
import LegDetails from './components/LegDetails';
import Total from './components/Total';

let savedExpanded: string | false = false;
const wmm = new WorldMagneticModel();

export const Component = function PlanPage() {
  const { LL } = useI18nContext();
  const { fuel, legs, setLegs } = useStore();
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

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLegs((legs) => {
        const oldIndex = legs.findIndex((leg) => leg.key === active.id);
        const newIndex = legs.findIndex((leg) => leg.key === over.id);
        return arrayMove(legs, oldIndex, newIndex);
      });
    }
  }

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
      <DndContext onDragEnd={onDragEnd}>
        <SortableContext items={legs.map((leg) => leg.key)} strategy={verticalListSortingStrategy}>
          {legs.map((leg, index) => (
            <LegDetails
              expanded={expanded}
              index={index}
              key={leg.key}
              leg={leg}
              onChange={handleChange(leg.key)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </>
  );
};

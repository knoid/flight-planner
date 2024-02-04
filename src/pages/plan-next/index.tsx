import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Grid } from '@mui/material';
import { Fragment, SyntheticEvent, useState } from 'react';

import { useStore } from '../../components/store';
import { WorldMagneticModel } from '../../utils/WorldMagneticModel';
import usePartials, { initialValues } from '../plan/components/FlightPlanTable/usePartials';
import DndContext from './components/DndContext';
import LegDetails from './components/LegDetails';
import TimeInput from './components/TimeInput';
import TripStats from './components/TripStats';

let savedExpanded: string | false = false;
const wmm = new WorldMagneticModel();
const partialKeys = Object.keys(initialValues) as (keyof typeof initialValues)[];

export const Component = function PlanPage() {
  const { legs, setLegs } = useStore();
  const [expanded, setExpanded] = useState<string | false>(savedExpanded);
  const partials = usePartials(wmm);
  const totals = partials.reduce(
    (total, partial) => {
      partialKeys.forEach((key) => {
        total[key] = (total[key] >= 0 ? total[key] : 0) + partial[key];
      });
      return total;
    },
    { ...initialValues },
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
      <Grid container p={1} spacing={1}>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <TimeInput />
        </Grid>
      </Grid>
      <DndContext onDragEnd={onDragEnd}>
        <SortableContext items={legs.map((leg) => leg.key)} strategy={verticalListSortingStrategy}>
          {legs.map((leg, index) => (
            <Fragment key={leg.key}>
              {index > 0 && <TripStats partial={partials[index]} />}
              <LegDetails
                expanded={expanded}
                index={index}
                leg={leg}
                onChange={handleChange(leg.key)}
              />
            </Fragment>
          ))}
          <TripStats partial={totals} total />
        </SortableContext>
      </DndContext>
    </>
  );
};

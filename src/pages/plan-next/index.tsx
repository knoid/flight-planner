import { SyntheticEvent, useState } from 'react';

import { useStore } from '../../components/store';
import WaypointDetails from './components/WaypointDetails';

let savedExpanded: string | false = false;

export const Component = function PlanPage() {
  const { legs } = useStore();
  const [expanded, setExpanded] = useState<string | false>(savedExpanded);

  const handleChange = (panel: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
    savedExpanded = isExpanded ? panel : false;
    setExpanded(savedExpanded);
  };

  return (
    <>
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

import { SyntheticEvent, useState } from 'react';

import { useStore } from '../../components/store';
import WaypointDetails from './components/WaypointDetails';

export const Component = function PlanPage() {
  const { legs } = useStore();
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
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

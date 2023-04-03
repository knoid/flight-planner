import { nanoid } from 'nanoid';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

import POIsContext, { POI } from './POIsContext';
import { useStore } from './store';

export interface Leg {
  altitude: string;
  code: string;
  key: string;
  notes?: string;
  readonly poi?: POI;
  wind: string;
}

type UseState<S> = [S, Dispatch<SetStateAction<S>>];
type ContextType = UseState<Leg[]>;

// eslint-disable-next-line @typescript-eslint/no-empty-function
const LegsContext = createContext<ContextType>([[], () => {}]);

interface LegsProviderProps {
  children: ReactNode;
}

export function LegsProvider({ children }: LegsProviderProps) {
  const { legs: savedLegs, setLegs: setSavedLegs } = useStore();
  const { options, loading } = useContext(POIsContext);

  const stateGetterSetter = useState<Leg[]>([]);
  const [legs, setLegs] = stateGetterSetter;
  useEffect(() => {
    if (loading) {
      setLegs(savedLegs.map((leg) => ({ key: `${leg.code}-${nanoid()}`, ...leg })));
    } else if (!loading && options.length > 0) {
      setLegs((legs) =>
        legs.map((leg) => ({
          ...leg,
          poi: options.find((poi) => poi.identifiers.local === leg.code),
        })),
      );
    } else {
      // error loading data
    }
  }, [loading, options]);

  useEffect(() => {
    if (!loading) {
      setSavedLegs(
        legs.map(({ altitude, code, notes, wind }) => ({ altitude, code, notes, wind })),
      );
    }
  }, [setSavedLegs, legs, loading]);

  return <LegsContext.Provider value={stateGetterSetter}>{children}</LegsContext.Provider>;
}

export function useLegs() {
  return useContext(LegsContext);
}

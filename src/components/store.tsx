import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const storageKey = 'store';
const version = 1;

interface Leg {
  code: string;
  wind: string;
  notes?: string;
}

interface State {
  cruiseSpeed: number;
  fuelCapacity: number;
  fuelFlow: number;
  legs: Leg[];
  startTime: string;
  version: number;
}

const initialState: State = {
  cruiseSpeed: -1,
  fuelCapacity: -1,
  fuelFlow: -1,
  legs: [],
  startTime: '',
  version,
};

const storedState =
  (function () {
    try {
      return JSON.parse(localStorage.getItem(storageKey)!) as State;
    } catch (error) {
      return null;
    }
  })() || initialState;

type ContextType = [State, Dispatch<SetStateAction<State>>];
const StoreContext = createContext<ContextType>([initialState, () => {}]);

interface StoreProviderProps {
  children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  const stateGetterSetter = useState(storedState);
  return <StoreContext.Provider value={stateGetterSetter}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const [state, setState] = useContext(StoreContext);

  const setCruiseSpeed = useCallback(
    (cruiseSpeed: number) => setState((state) => ({ ...state, cruiseSpeed })),
    [setState]
  );

  const setFuelCapacity = useCallback(
    (fuelCapacity: number) => setState((state) => ({ ...state, fuelCapacity })),
    [setState]
  );

  const setFuelFlow = useCallback(
    (fuelFlow: number) => setState((state) => ({ ...state, fuelFlow })),
    [setState]
  );

  const setLegs = useCallback(
    (legs: Leg[]) => setState((state) => ({ ...state, legs })),
    [setState]
  );

  const setStartTime = useCallback(
    (startTime: string) => setState((state) => ({ ...state, startTime })),
    [setState]
  );

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  return useMemo(
    () => ({
      setCruiseSpeed,
      setFuelCapacity,
      setFuelFlow,
      setLegs,
      setStartTime,
      ...state,
    }),
    [setCruiseSpeed, setFuelCapacity, setFuelFlow, setLegs, setStartTime, state]
  );
}

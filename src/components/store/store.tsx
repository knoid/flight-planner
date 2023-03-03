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
import { initialState, Leg, State, storageKey } from './constants';
import runMigrations from './runMigrations';

const storedState = {
  ...(function () {
    try {
      const data = JSON.parse(localStorage.getItem(storageKey) ?? '');
      const migratedData = runMigrations(data)
      return migratedData;
    } catch (error) {
      return initialState;
    }
  })(),
};

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

  const setMetadata = useCallback(
    (key: string, value: string) =>
      setState(({ metadata, ...state }) => ({ ...state, metadata: { ...metadata, [key]: value } })),
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
      setMetadata,
      setStartTime,
      ...state,
    }),
    [setCruiseSpeed, setFuelCapacity, setFuelFlow, setLegs, setMetadata, setStartTime, state]
  );
}

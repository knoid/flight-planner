import { LatLng } from 'leaflet';
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
      const migratedData = runMigrations(data);
      return migratedData;
    } catch (error) {
      console.error('Error migrating data', error);
      return initialState;
    }
  })(),
};

type ContextType = [State, Dispatch<SetStateAction<State>>];
// eslint-disable-next-line @typescript-eslint/no-empty-function
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

  const setAltitude = useCallback(
    (altitude: number) => setState((state) => ({ ...state, altitude })),
    [setState],
  );

  const setCenter = useCallback(
    ({ lat, lng }: LatLng) => setState((state) => ({ ...state, center: [lat, lng] })),
    [setState],
  );

  const setCruiseSpeed = useCallback(
    (cruiseSpeed: number) => setState((state) => ({ ...state, cruiseSpeed })),
    [setState],
  );

  const setFuel = useCallback(
    (value: Partial<State['fuel']>) =>
      setState(({ fuel, ...state }) => ({ ...state, fuel: { ...fuel, ...value } })),
    [setState],
  );

  const setLegs = useCallback(
    (legs: SetStateAction<Leg[]>) =>
      setState((state) => ({
        ...state,
        legs: typeof legs === 'function' ? legs(state.legs) : legs,
      })),
    [setState],
  );

  const setMetadata = useCallback(
    (key: string, value: string) =>
      setState(({ metadata, ...state }) => ({ ...state, metadata: { ...metadata, [key]: value } })),
    [setState],
  );

  const setStartTime = useCallback(
    (startTime: string) => setState((state) => ({ ...state, startTime })),
    [setState],
  );

  const setZoom = useCallback(
    (zoom: number) => setState((state) => ({ ...state, zoom })),
    [setState],
  );

  const toggleReminderOnMap = useCallback(
    () =>
      setState(({ showReminderOnMap, ...state }) => ({
        ...state,
        showReminderOnMap: !showReminderOnMap,
      })),
    [setState],
  );

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  return useMemo(
    () => ({
      setAltitude,
      setCenter,
      setCruiseSpeed,
      setFuel,
      setLegs,
      setMetadata,
      setStartTime,
      setZoom,
      toggleReminderOnMap,
      ...state,
    }),
    [setCruiseSpeed, setFuel, setLegs, setMetadata, setStartTime, state],
  );
}

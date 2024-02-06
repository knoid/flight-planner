import { nanoid } from 'nanoid';

import { initialState, State, version } from './constants';

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

type WithID<T> = T & {
  _id: string;
};

export default function runMigrations(data?: DeepPartial<State>): State {
  if (typeof data !== 'object' || typeof data.version !== 'number') {
    return initialState;
  }

  const legs = (data.legs || [])
    .filter(<T>(leg: T | undefined): leg is T => !!leg)
    .filter(<T extends { _id?: string }>(leg: T): leg is WithID<T> => !!leg._id)
    .map(({ key, wind, ...leg }) => ({
      wind: wind || '',
      key: key || nanoid(),
      ...leg,
    }));

  data.version = version;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { fuelCapacity, fuelFlow } = data as any;

  const [lat, lng] = data.center || [];
  const center = [lat || 0, lng || 0] as [number, number];

  return {
    ...initialState,
    ...data,
    center,
    fuel: {
      ...initialState.fuel,
      ...(fuelCapacity ? { capacity: Number(fuelCapacity) } : {}),
      ...(fuelFlow ? { flow: Number(fuelFlow) } : {}),
      ...data.fuel,
    },
    legs,
  };
}

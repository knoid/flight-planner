import { initialState, State, version } from './constants';

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

type WithCode<T> = T & {
  code: string;
};

export default function runMigrations(data?: DeepPartial<State>): State {
  if (typeof data !== 'object' || typeof data.version !== 'number') {
    return initialState;
  }

  const legs = (data.legs || [])
    .filter(<T>(leg: T | undefined): leg is T => !!leg)
    .filter(<T extends { code?: string }>(leg: T): leg is WithCode<T> => !!leg.code)
    .map(({ altitude, wind, ...leg }) => ({
      altitude: altitude || '',
      wind: wind || '',
      ...leg,
    }));

  data.version = version;

  const { fuelCapacity, fuelFlow } = data as any;
  return {
    ...initialState,
    ...data,
    fuel: {
      ...initialState.fuel,
      ...(fuelCapacity ? { capacity: Number(fuelCapacity) } : {}),
      ...(fuelFlow ? { flow: Number(fuelFlow) } : {}),
      ...data.fuel,
    },
    legs,
  };
}

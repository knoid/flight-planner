export const storageKey = 'store';
export const version = 1;

export interface Leg {
  code: string;
  wind: string;
  notes?: string;
}

export interface State {
  cruiseSpeed: number;
  fuelCapacity: number;
  fuelFlow: number;
  legs: Leg[];
  metadata: {
    [key: string]: string | undefined;
  };
  startTime: string;
  version: number;
}

export const initialState: State = {
  cruiseSpeed: -1,
  fuelCapacity: -1,
  fuelFlow: -1,
  legs: [],
  metadata: {},
  startTime: '',
  version,
};

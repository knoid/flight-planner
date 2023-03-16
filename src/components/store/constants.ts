export const storageKey = 'store';
export const version = 1;

export enum FuelUnit {
  GallonUS, // gals
  Liter, // lts
  Pound, // lbs
}

export interface Leg {
  altitude: string;
  code: string;
  wind: string;
  notes?: string;
}

export interface State {
  cruiseSpeed: number;
  fuel: {
    capacity: number;
    flow: number;
    unit: FuelUnit;
  };
  includeFrequencies: boolean;
  legs: Leg[];
  metadata: {
    [key: string]: string | undefined;
  };
  startTime: string;
  version: number;
}

export const initialState: State = {
  cruiseSpeed: -1,
  fuel: {
    capacity: -1,
    flow: -1,
    unit: FuelUnit.GallonUS,
  },
  includeFrequencies: true,
  legs: [],
  metadata: {},
  startTime: '',
  version,
};

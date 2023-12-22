export const storageKey = 'store';
export const version = 1;

export enum FuelUnit {
  GallonUS, // gals
  Liter, // lts
  Pound, // lbs
}

export interface Leg {
  _id: string;
  altitude: string;
  key: string;
  wind: string;
  notes?: string;
}

export interface State {
  center: [lat: number, lng: number];
  cruiseSpeed: number;
  fuel: {
    capacity: number;
    flow: number;
    reserve: number;
    unit: FuelUnit;
  };
  includeFrequencies: boolean;
  legs: Leg[];
  metadata: {
    [key: string]: string | undefined;
  };
  showReminderOnMap: boolean;
  startTime: string;
  version: number;
  zoom: number;
}

export const initialState: State = {
  center: [0, 0],
  cruiseSpeed: -1,
  fuel: {
    capacity: -1,
    flow: -1,
    reserve: -1,
    unit: FuelUnit.GallonUS,
  },
  includeFrequencies: true,
  legs: [],
  metadata: {},
  showReminderOnMap: true,
  startTime: '',
  version,
  zoom: 3,
};

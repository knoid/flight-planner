export const storageKey = 'store';
export const version = 1;

export enum FuelUnit {
  GallonUS, // gals
  Liter, // lts
  Pound, // lbs
}

export interface Leg {
  _id: string;
  key: string;
  wind: string;
  notes?: string;
}

export interface State {
  altitude: number;
  center: [lat: number, lng: number];
  cruiseSpeed: number;
  fuel: {
    capacity: number;
    flow: number;
    reserve: number;
    unit: FuelUnit;
  };
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
  altitude: 0,
  center: [0, 0],
  cruiseSpeed: 0,
  fuel: {
    capacity: -1,
    flow: -1,
    reserve: -1,
    unit: FuelUnit.GallonUS,
  },
  legs: [],
  metadata: {},
  showReminderOnMap: true,
  startTime: '',
  version,
  zoom: 3,
};

import { LatLng } from 'leaflet';

import normalize from './normalize';

interface PagingResult<Item> {
  limit: number;
  totalCount: number;
  totalPages: number;
  page: number;
  items: Item[];
}

interface POIProps {
  _id: string;
  name: string;
  country: string;
  geometry: { type: 'Point'; coordinates: [number, number] };
}

export abstract class POI implements POIProps {
  _id!: string;
  name!: string;
  country!: string;
  geometry!: { type: 'Point'; coordinates: [number, number] };

  getIdentifier() {
    return this.name;
  }

  getLabel() {
    return this.name;
  }

  latLng() {
    const [longitude, latitude] = this.geometry.coordinates;
    return new LatLng(latitude, longitude);
  }

  matches(search: string) {
    return normalize(this.getLabel()).includes(normalize(search));
  }
}

export enum FrequencyUnit {
  MHz = 2,
}

export enum FrequencyType {
  Approach,
  APRON,
  Arrival,
  Center,
  CTAF,
  Delivery,
  Departure,
  FIS,
  Gliding,
  Ground,
  Information,
  Multicom,
  Unicom,
  Radar,
  Tower,
  ATIS,
  Radio,
  Other,
  AIRMET,
  AWOS,
  Lights,
  VOLMET,
  AFIS,
}

interface Frequency {
  _id: string;
  name?: string;
  remarks?: string;
  type: FrequencyType;
  unit: FrequencyUnit;
  value: string;
}

export enum Composite {
  Asphalt,
  Concrete,
  Grass,
  Sand,
  Water,
  /** Bituminous tar or asphalt ("earth cement") */
  BituminousTar,
  Brick,
  /** Macadam or tarmac surface consisting of water-bound crushed rock */
  Macadam,
  Stone,
  Coral,
  Clay,
  /** a high iron clay formed in tropical areas */
  Laterite,
  Gravel,
  Earth,
  Ice,
  Snow,
  /** usually made of rubber */
  ProtectiveLaminate,
  Metal,
  /** portable system usually made of aluminium */
  LandingMat,
  PiercedSteelPlanking,
  Wood,
  NonBituminousMix,
  Unknown,
}

export enum Condition {
  Good,
  Fair,
  Poor,
  Unsafe,
  Deformed,
  Unknown,
}

interface Runway {
  _id: string;
  designator: string;
  surface: { composition: Composite[]; condition: Condition; mainComposite: Composite };
}

export enum AirportType {
  /**  civil / military */
  Airport,
  GliderSite,
  AirfieldCivil,
  InternationalAirport,
  HeliportMilitary,
  MilitaryAerodrome,
  UltraLightFlyingSite,
  HeliportCivil,
  AerodromeClosed,
  /** Airport resp. Airfield IFR */
  AirportIFR,
  AirfieldWater,
  LandingStrip,
  AgriculturalLandingStrip,
  Altiport,
}

interface AirportProps extends POIProps {
  icaoCode?: string;
  iataCode?: string;
  altIdentifier?: string;
  type: AirportType;
  frequencies?: Frequency[];
  runways?: Runway[];
}

export class Airport extends POI implements AirportProps {
  icaoCode?: string;
  iataCode?: string;
  altIdentifier?: string;
  type!: AirportType;
  frequencies?: Frequency[];
  runways?: Runway[];

  static fromJSON(json: AirportProps) {
    return Object.assign(new Airport(), json);
  }

  getIdentifier() {
    return this.icaoCode || this.iataCode || this.altIdentifier || super.getIdentifier();
  }

  getLabel() {
    const identifiers = [this.icaoCode, this.iataCode, this.altIdentifier]
      .filter((str) => str)
      .join('/');
    if (identifiers.length > 0) {
      return `(${identifiers}) ${this.name}`;
    }
    return super.getLabel();
  }
}

export class ReportingPoint extends POI {
  airports!: string[];

  static fromJSON(json: ReportingPoint) {
    return Object.assign(new ReportingPoint(), json);
  }
}

const baseURL = 'https://api.core.openaip.net/api/';

export default async function openAIP<T>(path: string, params?: Record<string, string>) {
  const searchParams = new URLSearchParams({
    apiKey: '72a6755bd7f6b13109de4c0f4ed2b694',
    ...params,
  });
  const response = await fetch(baseURL + path + '?' + searchParams.toString());
  if (!response.ok) {
    throw new Error();
  }
  return (await response.json()) as PagingResult<T>;
}

function fetchObjects<T>(path: string, iterator: (item: T) => T) {
  return async function (params?: Record<string, string>) {
    const result = await openAIP<T>(path, params);
    return result.items.map(iterator);
  };
}

export const fetchAirports = fetchObjects('airports', Airport.fromJSON);
export const fetchReportingPoints = fetchObjects('reporting-points', ReportingPoint.fromJSON);

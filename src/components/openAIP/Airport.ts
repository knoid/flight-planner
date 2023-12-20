import { LatLng } from 'leaflet';

import POI, { POIProps } from './POI';

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

interface Frequency {
  _id: string;
  name?: string;
  remarks?: string;
  type: FrequencyType;
  unit: FrequencyUnit;
  value: string;
}

interface Runway {
  _id: string;
  designator: string;
  surface: { composition: Composite[]; condition: Condition; mainComposite: Composite };
}

interface Point {
  type: 'Point';
  coordinates: [number, number];
}

export interface AirportProps extends POIProps {
  icaoCode?: string;
  iataCode?: string;
  altIdentifier?: string;
  type: AirportType;
  frequencies?: Frequency[];
  geometry: Point;
  runways?: Runway[];
}

export default class Airport extends POI implements AirportProps {
  icaoCode?: string;
  iataCode?: string;
  altIdentifier?: string;
  type!: AirportType;
  frequencies?: Frequency[];
  geometry!: Point;
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

  latLng() {
    const [longitude, latitude] = this.geometry.coordinates;
    return new LatLng(latitude, longitude);
  }
}

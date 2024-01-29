import { Frequency } from './Frequency';
import PointPOI, { PointPOIProps } from './PointPOI';

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
  /** civil / military */
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

export enum Operations {
  Active,
  TemporarilyClosed,
  Closed,
}

export interface Runway {
  _id: string;
  designator: string;
  landingOnly: boolean;
  mainRunway: boolean;
  operations: Operations;
  pilotCtrlLighting: boolean;
  surface: { composition: Composite[]; condition: Condition; mainComposite: Composite };
  takeOffOnly: boolean;
  trueHeading: number;
  turnDirection: number;
}

export interface AirportProps extends PointPOIProps {
  icaoCode?: string;
  iataCode?: string;
  altIdentifier?: string;
  type: AirportType;
  frequencies?: Frequency[];
  runways?: Runway[];
}

export default class Airport extends PointPOI implements AirportProps {
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

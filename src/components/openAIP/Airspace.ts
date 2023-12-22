import { LatLngBounds } from 'leaflet';

import POI, { POIProps } from './POI';

export enum AirspaceType {
  Other,
  Restricted,
  Danger,
  Prohibited,
  /** Controlled Tower Region */
  CTR,
  /** Transponder Mandatory Zone */
  TMZ,
  /** Radio Mandatory Zone */
  RMZ,
  /** Terminal Maneuvering Area */
  TMA,
  /** Temporary Reserved Area */
  TRA,
  /** Temporary Segregated Area */
  TSA,
  /** Flight Information Region */
  FIR,
  /** Upper Flight Information Region */
  UIR,
  /** Air Defense Identification Zone */
  ADIZ,
  /** Airport Traffic Zone */
  ATZ,
  /** Military Airport Traffic Zone */
  MATZ,
  Airway,
  /** Military Training Route */
  MTR,
  Alert,
  Warning,
  Protected,
  /** Helicopter Traffic Zone */
  HTZ,
  Gliding,
  /** Transponder Setting */
  TRP,
  /** Traffic Information Zone */
  TIZ,
  /** Traffic Information Area */
  TIA,
  /** Military Training Area */
  MTA,
  /** Control Area */
  CTA,
  /** ACC Sector */
  ACC,
  /** Aerial Sporting Or Recreational Activity */
  Recreational,
  /** Low Altitude Overflight Restriction */
  LowAltitudeRestriction,
  /** Military Route */
  MRT,
  /** TSA/TRA Feeding Route */
  TFR,
  VFR,
}

interface Polygon {
  type: 'Polygon';
  coordinates: [[[number, number]]];
}

export enum LimitUnit {
  Meter,
  Feet,
  FlightLevel = 6,
}

enum ReferenceDatum {
  GND,
  MSL,
  STD,
}

export interface Limit {
  value: number;
  unit: LimitUnit;
  referenceDatum: ReferenceDatum;
}

export interface AirspaceProps extends POIProps {
  geometry: Polygon;
  lowerLimit: Limit;
  type: AirspaceType;
  upperLimit: Limit;
}

export default class Airspace extends POI {
  geometry!: Polygon;
  lowerLimit!: Limit;
  type!: AirspaceType;
  upperLimit!: Limit;

  static fromJSON(json: AirspaceProps) {
    return Object.assign(new Airspace(), json);
  }

  bounds() {
    const coords = this.geometry.coordinates.flatMap((coords) => coords);
    const south = coords.map(([lng]) => lng).reduce((a, b) => Math.min(a, b));
    const west = coords.map(([, lat]) => lat).reduce((a, b) => Math.min(a, b));
    const north = coords.map(([lng]) => lng).reduce((a, b) => Math.max(a, b));
    const east = coords.map(([, lat]) => lat).reduce((a, b) => Math.max(a, b));
    return new LatLngBounds([west, south], [east, north]);
  }
}

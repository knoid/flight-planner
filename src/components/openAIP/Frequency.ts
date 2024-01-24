export interface Frequency {
  _id: string;
  name?: string;
  remarks?: string;
  type: FrequencyType;
  unit: FrequencyUnit;
  value: string;
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

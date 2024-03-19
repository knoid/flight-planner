import { LatLngBounds } from 'leaflet';

import Airport, { AirportType, Composite, Condition, Operations, Runway } from './Airport';
import Airspace, { AirspaceType, Limit, LimitUnit } from './Airspace';
import { FrequencyType, FrequencyUnit } from './Frequency';
import Navaid from './Navaid';
import POI from './POI';
import PointPOI from './PointPOI';
import ReportingPoint from './ReportingPoint';

interface PagingResult<Item> {
  limit: number;
  totalCount: number;
  totalPages: number;
  page: number;
  items: Item[];
}

const baseURL = 'https://api.core.openaip.net/api/';
const { VITE_OPENAIP_KEY } = import.meta.env;

export default async function openAIP<T>(path: string, params: Record<string, string>) {
  const searchParams = new URLSearchParams({
    apiKey: VITE_OPENAIP_KEY,
    ...params,
  });
  const response = await fetch(baseURL + path + '?' + searchParams.toString());
  if (!response.ok) {
    throw new Error();
  }
  return (await response.json()) as PagingResult<T>;
}

export interface POIFetchParams {
  id?: string;
  latLngBounds?: LatLngBounds;
  search?: string;
  type?: string;
}

function fetchObjects<T>(path: string, iterator: (item: T) => T) {
  return async function ({ latLngBounds, ...params }: POIFetchParams) {
    const result = await openAIP<T>(path, {
      ...(latLngBounds ? { bbox: latLngBounds.toBBoxString() } : {}),
      ...params,
    });
    return result.items.map(iterator);
  };
}

export const fetchAirports = fetchObjects('airports', Airport.fromJSON);
export const fetchAirspaces = fetchObjects('airspaces', Airspace.fromJSON);
export const fetchNavaids = fetchObjects('navaids', Navaid.fromJSON);
export const fetchReportingPoints = fetchObjects('reporting-points', ReportingPoint.fromJSON);

export {
  Airport,
  AirportType,
  Airspace,
  AirspaceType,
  Composite,
  Condition,
  FrequencyType,
  FrequencyUnit,
  type Limit,
  LimitUnit,
  Navaid,
  Operations,
  POI,
  PointPOI,
  ReportingPoint,
  type Runway,
};

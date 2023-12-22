import Airport, {
  AirportType,
  Composite,
  Condition,
  FrequencyType,
  FrequencyUnit,
} from './Airport';
import Airspace, { AirspaceType, Limit, LimitUnit } from './Airspace';
import POI from './POI';
import ReportingPoint from './ReportingPoint';

interface PagingResult<Item> {
  limit: number;
  totalCount: number;
  totalPages: number;
  page: number;
  items: Item[];
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
export const fetchAirspaces = fetchObjects('airspaces', Airspace.fromJSON);
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
  POI,
  ReportingPoint,
};

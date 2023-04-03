import { createContext, ReactNode, useEffect, useState } from 'react';

import { Coords } from '../types';
import cachedFetch from './cachedFetch';

interface BasePOI {
  identifiers: { iata?: string; icao?: string; local: string };
  coordinates: Coords;
}

interface Airport extends BasePOI {
  type: 'airport' | 'helipad';
  name: string;
}

interface Waypoint extends BasePOI {
  type: 'waypoint';
}

export type POI = Airport | Waypoint;

interface ContextProps {
  loading: boolean;
  options: readonly POI[];
}

const POIsContext = createContext<ContextProps>({ loading: false, options: [] });
export default POIsContext;

interface ProviderProps {
  children: ReactNode;
}

async function fetchAirports(): Promise<Airport[]> {
  const request = await cachedFetch('filterBy/type/airport.json');
  if (request.ok) {
    return await request.json();
  }
  return [];
}

interface WaypointsResponse {
  [identifier: string]: [latitude: number, longitude: number];
}

async function fetchWaypoints(): Promise<Waypoint[]> {
  const request = await cachedFetch('local/AR/waypoints.json');
  if (request.ok) {
    const results: WaypointsResponse = await request.json();
    return Object.entries(results).map(([local, coordinates]) => ({
      type: 'waypoint',
      coordinates,
      identifiers: { local },
    }));
  }
  return [];
}

function isFulfilled<T>(promise: PromiseSettledResult<T>): promise is PromiseFulfilledResult<T> {
  return promise.status === 'fulfilled';
}

export function POIsProvider({ children }: ProviderProps) {
  const [options, setOptions] = useState<readonly POI[]>([]);
  const loading = options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const [res1, res2] = await Promise.allSettled([fetchAirports(), fetchWaypoints()]);

      if (active) {
        const newOptions = [];
        if (isFulfilled(res1)) {
          newOptions.push(...res1.value);
        }
        if (isFulfilled(res2)) {
          newOptions.push(...res2.value);
        }
        setOptions(newOptions);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  return <POIsContext.Provider value={{ loading, options }}>{children}</POIsContext.Provider>;
}

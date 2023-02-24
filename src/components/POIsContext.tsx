import { createContext, ReactNode, useEffect, useState } from 'react';
import { capitalize } from '../utils/capitalize';
import extractName from '../utils/extractName';
import cachedFetch from './cachedFetch';
import * as math from './math';

interface BasePOI {
  code: string;
  lat: number;
  lon: number;
}

interface Airport extends BasePOI {
  type: 'airport';
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

interface MadhelAirport {
  data: {
    helpers_system: {
      radio: string[];
    };
  };
  human_readable_identifier: string;
  local_identifier: string;
  the_geom: {
    type: 'Feature';
    properties: {
      gg_point_coordinates: [lat: number, lon: number];
    };
  };
  uri: string;
}

interface MadhelResponse {
  count: number;
  results: MadhelAirport[];
}

interface ProviderProps {
  children: ReactNode;
}

async function fetchFromMADHEL(): Promise<Airport[]> {
  const request = await cachedFetch('https://datos.anac.gob.ar/madhel/api/v2/airports/');
  if (request.ok) {
    const { results }: MadhelResponse = await request.json();
    return results.map((airport) => {
      const [lat, lon] = airport.the_geom.properties.gg_point_coordinates;
      return {
        code: airport.local_identifier,
        lat: math.toRadians(lat),
        lon: math.toRadians(lon),
        name: capitalize(extractName(airport.human_readable_identifier)),
        type: 'airport',
      };
    });
  }
  return [];
}

interface WaypointsResponse {
  [identifier: string]: [latitude: number, longitude: number];
}

async function fetchWaypoints(): Promise<Waypoint[]> {
  const request = await fetch('data/AR/waypoints.json');
  if (request.ok) {
    const results: WaypointsResponse = await request.json();
    return Object.entries(results).map(([identifier, [lat, lon]]) => ({
      code: identifier,
      lat: math.toRadians(lat),
      lon: math.toRadians(lon),
      type: 'waypoint',
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
      const [res1, res2] = await Promise.allSettled([fetchFromMADHEL(), fetchWaypoints()]);

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

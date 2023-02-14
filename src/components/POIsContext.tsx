import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { capitalize } from '../utils/capitalize';
import cachedFetch from './cachedFetch';

export interface POI {
  name: string;
  code: string;
  lat: number;
  lon: number;
}

interface ContextProps {
  loading: boolean;
  options: readonly POI[];
}

const POIsContext = createContext<ContextProps>({ loading: false, options: [] });
export default POIsContext;

interface Point {
  type: 'Point';
  coordinates: [lat: number, lon: number];
}

interface Airport {
  human_readable_identifier: string;
  local_identifier: string;
  the_geom: {
    type: 'Feature';
    geometry: Point;
  };
  uri: string;
}

interface MadhelResponse {
  count: number;
  results: Airport[];
}

interface ProviderProps {
  children: ReactNode;
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
      const request = await cachedFetch('https://datos.anac.gob.ar/madhel/api/v2/airports/');
      if (request.ok) {
        const { results }: MadhelResponse = await request.json();
        const pois = results.map((airport) => {
          const [lat, lon] = airport.the_geom.geometry.coordinates;
          return {
            code: airport.local_identifier,
            lat,
            lon,
            name: capitalize(airport.human_readable_identifier.split(' - ')[0]),
          };
        });

        if (active) {
          setOptions(pois);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  return <POIsContext.Provider value={{ loading, options }}>{children}</POIsContext.Provider>;
}

import React, { createContext, ReactNode, useEffect, useState } from 'react';

export interface POI {
  name: string;
  code: string;
  aero?: string;
  TWR?: number;
  GND?: number;
  VOR?: number;
  lat: number;
  lon: number;
}

interface ContextProps {
  loading: boolean;
  options: readonly POI[];
}

const POIsContext = createContext<ContextProps>({ loading: false, options: [] });
export default POIsContext;

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
      const request = await fetch('/data/pois.json');
      if (request.ok) {
        const pois = await request.json();

        if (active) {
          setOptions(pois);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  return (
    <POIsContext.Provider value={{ loading, options }}>{children}</POIsContext.Provider>
  );
}

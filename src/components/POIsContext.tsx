import { LatLngBounds } from 'leaflet';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  Airport,
  Airspace,
  fetchAirports as fetchOpenAIPAirports,
  fetchAirspaces,
  fetchNavaids,
  fetchReportingPoints,
  Navaid,
  POI,
  POIFetchParams,
  ReportingPoint,
} from './openAIP';
import useDebounce from './useDebounce';
import usePOIMap, { POIMap } from './usePOIMap';

interface ContextProps {
  airports: UsePOI<Airport>;
  airspaces: UsePOI<Airspace>;
  loading: boolean;
  navaids: UsePOI<Navaid>;
  reportingPoints: UsePOI<ReportingPoint>;
  setLatLngBounds: Dispatch<SetStateAction<LatLngBounds | undefined>>;
  setSearch: Dispatch<SetStateAction<string>>;
}

const noop = () => {};
const POIsContext = createContext<ContextProps>({
  airports: [new Map(), noop, false],
  airspaces: [new Map(), noop, false],
  loading: false,
  navaids: [new Map(), noop, false],
  reportingPoints: [new Map(), noop, false],
  setLatLngBounds: noop,
  setSearch: noop,
});
export default POIsContext;

interface ProviderProps {
  children: ReactNode;
}

async function fetchAirports(params: POIFetchParams) {
  return await fetchOpenAIPAirports({
    /**
     * The type of the airport. Possible values:
     *  0: Airport (civil/military)
     *  1: Glider Site
     *  2: Airfield Civil
     *  3: International Airport
     *  4: Heliport Military
     *  5: Military Aerodrome
     *  6: Ultra Light Flying Site
     *  7: Heliport Civil
     *  8: Aerodrome Closed
     *  9: Airport resp. Airfield IFR
     *  10: Airfield Water
     *  11: Landing Strip
     *  12: Agricultural Landing Strip
     *  13: Altiport
     */
    type: [0, 2, 3].join(','),
    ...params,
  });
}

type UsePOI<T> = [POIMap<T>, Dispatch<SetStateAction<string[]>>, boolean];

function usePOI<T extends POI>(
  fetchPOIs: (params: POIFetchParams) => Promise<T[]>,
  latLngBounds?: LatLngBounds,
  search?: string,
): UsePOI<T> {
  const [loading, setLoading] = useState(false);
  const [pois, setPOIs, setPOI] = usePOIMap<T>();
  const [newPOIs, setNewPOIs] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    if (latLngBounds) {
      setLoading(true);
      (async () => {
        const fetchedPOIs = await fetchPOIs({ latLngBounds });
        if (active) {
          setPOIs(fetchedPOIs);
          setLoading(false);
        }
      })();
    }

    return () => {
      active = false;
    };
  }, [latLngBounds]);

  const debouncedSearch = useDebounce(search?.trim());
  useEffect(() => {
    if (debouncedSearch && debouncedSearch.length > 2) {
      fetchPOIs({ search: debouncedSearch }).then((result) => {
        setPOIs(result);
      });
    }
  }, [debouncedSearch]);

  const debouncedPOIs = useDebounce(newPOIs, 100);
  useEffect(() => {
    debouncedPOIs
      .filter((id) => !pois.has(id))
      .forEach((id) => {
        fetchPOIs({ id }).then((fetchedPOIs) => {
          if (fetchedPOIs.length > 0) {
            setPOIs(fetchedPOIs);
          } else {
            setPOI(id);
          }
        });
      });
  }, [debouncedPOIs]);

  return [pois, setNewPOIs, loading];
}

export function POIsProvider({ children }: ProviderProps) {
  const [latLngBounds, setLatLngBounds] = useState<LatLngBounds | undefined>();
  const [search, setSearch] = useState<string>('');

  const airports = usePOI(fetchAirports, latLngBounds, search);
  const airspaces = usePOI(fetchAirspaces, latLngBounds);
  const navaids = usePOI(fetchNavaids, latLngBounds);
  const reportingPoints = usePOI(fetchReportingPoints, latLngBounds, search);

  return (
    <POIsContext.Provider
      value={{
        airports,
        airspaces,
        loading: airports[2] || airspaces[2] || navaids[2] || reportingPoints[2],
        navaids,
        reportingPoints,
        setLatLngBounds,
        setSearch,
      }}
    >
      {children}
    </POIsContext.Provider>
  );
}

type POIProp = {
  [key in keyof ContextProps as ContextProps[key] extends UsePOI<unknown>
    ? key
    : never]: ContextProps[key] extends UsePOI<infer T> ? T : never;
};

function createUsePOI<Key extends keyof POIProp>(name: Key) {
  return function useFetchPOI(_id: string | false) {
    const [pois, setNewPOIs] = useContext(POIsContext)[name] as UsePOI<POIProp[Key]>;
    useEffect(() => {
      if (_id) {
        setNewPOIs((prev) => [...prev, _id]);
        return () => setNewPOIs((prev) => prev.filter((id) => id !== _id));
      }
    }, []);
    return _id ? pois.get(_id) : undefined;
  };
}

export const useAirport = createUsePOI('airports');
export const useAirspace = createUsePOI('airspaces');
export const useNavaids = createUsePOI('navaids');
export const useReportingPoint = createUsePOI('reportingPoints');

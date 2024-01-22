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
import { useDebounce } from 'usehooks-ts';

import {
  Airport,
  Airspace,
  fetchAirports as fetchOpenAIPAirports,
  fetchAirspaces,
  fetchReportingPoints,
  POI,
  POIFetchParams,
  ReportingPoint,
} from './openAIP';
import usePOIMap, { POIMap } from './usePOIMap';

interface ContextProps {
  airports: POIMap<Airport>;
  airspaces: POIMap<Airspace>;
  loading: boolean;
  reportingPoints: POIMap<ReportingPoint>;
  setLatLngBounds: Dispatch<SetStateAction<LatLngBounds | undefined>>;
  setNewAirports: Dispatch<SetStateAction<string[]>>;
  setNewAirspaces: Dispatch<SetStateAction<string[]>>;
  setNewReportingPoints: Dispatch<SetStateAction<string[]>>;
  setSearch: Dispatch<SetStateAction<string>>;
}

const POIsContext = createContext<ContextProps>({
  airports: new Map(),
  airspaces: new Map(),
  loading: false,
  reportingPoints: new Map(),
  setLatLngBounds: () => {},
  setNewAirports: () => {},
  setNewAirspaces: () => {},
  setNewReportingPoints: () => {},
  setSearch: () => {},
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

function usePOI<T extends POI>(
  fetchPOIs: (params: POIFetchParams) => Promise<T[]>,
  latLngBounds?: LatLngBounds,
  search?: string,
): [POIMap<T>, Dispatch<SetStateAction<string[]>>, boolean] {
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

  const [airports, setNewAirports, loadingAirports] = usePOI(fetchAirports, latLngBounds, search);
  const [airspaces, setNewAirspaces, loadingAirspaces] = usePOI(fetchAirspaces, latLngBounds);
  const [reportingPoints, setNewReportingPoints, loadingReportingPoints] = usePOI(
    fetchReportingPoints,
    latLngBounds,
    search,
  );

  return (
    <POIsContext.Provider
      value={{
        airports,
        airspaces,
        loading: loadingAirports || loadingAirspaces || loadingReportingPoints,
        reportingPoints,
        setLatLngBounds,
        setNewAirports,
        setNewAirspaces,
        setNewReportingPoints,
        setSearch,
      }}
    >
      {children}
    </POIsContext.Provider>
  );
}

export function useAirport(_id: string) {
  const { airports, setNewAirports } = useContext(POIsContext);
  useEffect(() => {
    setNewAirports((prev) => [...prev, _id]);
    return () => setNewAirports((prev) => prev.filter((id) => id !== _id));
  }, []);
  return airports.get(_id);
}

export function useAirspace(_id: string) {
  const { airspaces, setNewAirspaces } = useContext(POIsContext);
  useEffect(() => {
    setNewAirspaces((prev) => [...prev, _id]);
    return () => setNewAirspaces((prev) => prev.filter((id) => id !== _id));
  }, []);
  return airspaces.get(_id);
}

export function useReportingPoint(_id: string) {
  const { reportingPoints, setNewReportingPoints } = useContext(POIsContext);
  useEffect(() => {
    setNewReportingPoints((prev) => [...prev, _id]);
    return () => setNewReportingPoints((prev) => prev.filter((id) => id !== _id));
  }, []);
  return reportingPoints.get(_id);
}

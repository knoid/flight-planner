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
  fetchAirports as fetchOpenAIPAirports,
  fetchReportingPoints as fetchOpenAIPReportingPoints,
  ReportingPoint,
} from './openAIP';
import usePOIMap, { POIMap } from './usePOIMap';

interface ContextProps {
  airports: POIMap<Airport>;
  loading: boolean;
  reportingPoints: POIMap<ReportingPoint>;
  setLatLngBounds: Dispatch<SetStateAction<LatLngBounds | undefined>>;
  setNewAirports: Dispatch<SetStateAction<string[]>>;
  setNewReportingPoints: Dispatch<SetStateAction<string[]>>;
  setSearch: Dispatch<SetStateAction<string>>;
}

const POIsContext = createContext<ContextProps>({
  airports: new Map(),
  loading: false,
  reportingPoints: new Map(),
  setLatLngBounds: () => {},
  setNewAirports: () => {},
  setNewReportingPoints: () => {},
  setSearch: () => {},
});
export default POIsContext;

interface ProviderProps {
  children: ReactNode;
}

interface POIFetchParams {
  id?: string;
  latLngBounds?: LatLngBounds;
  search?: string;
}

async function fetchAirports({ id, latLngBounds, search }: POIFetchParams) {
  return await fetchOpenAIPAirports({
    limit: '50',

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
    ...(id ? { id } : {}),
    ...(latLngBounds ? { bbox: latLngBounds.toBBoxString() } : {}),
    ...(search ? { search } : {}),
  });
}

async function fetchReportingPoints({ id, latLngBounds, search }: POIFetchParams) {
  return await fetchOpenAIPReportingPoints({
    limit: '50',
    ...(id ? { id } : {}),
    ...(latLngBounds ? { bbox: latLngBounds.toBBoxString() } : {}),
    ...(search ? { search } : {}),
  });
}

function isFulfilled<T>(promise: PromiseSettledResult<T>): promise is PromiseFulfilledResult<T> {
  return promise.status === 'fulfilled';
}

export function POIsProvider({ children }: ProviderProps) {
  const [airports, setAirports, setAirport] = usePOIMap<Airport>();
  const [reportingPoints, setReportingPoints, setReportingPoint] = usePOIMap<ReportingPoint>();
  const [loading, setLoading] = useState(false);
  const [latLngBounds, setLatLngBounds] = useState<LatLngBounds | undefined>();
  const [newAirports, setNewAirports] = useState<string[]>([]);
  const [newReportingPoints, setNewReportingPoints] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    let active = true;

    if (latLngBounds) {
      setLoading(true);
      (async () => {
        const [airports, reportingPoints] = await Promise.allSettled([
          fetchAirports({ latLngBounds }),
          fetchReportingPoints({ latLngBounds }),
        ]);

        if (active) {
          if (isFulfilled(airports)) {
            setAirports(airports.value);
          }
          if (isFulfilled(reportingPoints)) {
            setReportingPoints(reportingPoints.value);
          }
          setLoading(false);
        }
      })();
    }

    return () => {
      active = false;
    };
  }, [latLngBounds]);

  const debouncedAirports = useDebounce(newAirports, 100);
  useEffect(() => {
    debouncedAirports
      .filter((id) => !airports.has(id))
      .forEach((id) => {
        fetchAirports({ id }).then((airports) => {
          if (airports.length > 0) {
            setAirports(airports);
          } else {
            setAirport(id);
          }
        });
      });
  }, [debouncedAirports]);

  const debouncedReportingPoints = useDebounce(newReportingPoints, 100);
  useEffect(() => {
    debouncedReportingPoints
      .filter((id) => !reportingPoints.has(id))
      .forEach((id) => {
        fetchReportingPoints({ id }).then((reportingPoints) => {
          if (reportingPoints.length > 0) {
            setReportingPoints(reportingPoints);
          } else {
            setReportingPoint(id);
          }
        });
      });
  }, [debouncedReportingPoints]);

  const debouncedSearch = useDebounce(search);
  useEffect(() => {
    if (debouncedSearch.length > 2) {
      fetchAirports({ search: debouncedSearch }).then((result) => {
        setAirports(result);
      });
      fetchReportingPoints({ search: debouncedSearch }).then((result) => {
        setReportingPoints(result);
      });
    }
  }, [debouncedSearch]);

  return (
    <POIsContext.Provider
      value={{
        airports,
        loading,
        reportingPoints,
        setLatLngBounds,
        setNewAirports,
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

export function useReportingPoint(_id: string) {
  const { reportingPoints, setNewReportingPoints } = useContext(POIsContext);
  useEffect(() => {
    setNewReportingPoints((prev) => [...prev, _id]);
    return () => setNewReportingPoints((prev) => prev.filter((id) => id !== _id));
  }, []);
  return reportingPoints.get(_id);
}

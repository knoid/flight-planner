import { DomEvent } from 'leaflet';
import { createContext, ReactNode, RefObject, useEffect, useState } from 'react';

import { Airport, Airspace, ReportingPoint } from '../../../components/openAIP';

interface SelectedPOIsContext {
  airports: Airport[];
  airspaces: Airspace[];
  clear: () => void;
  clickedAirport: (airport: Airport) => void;
  clickedAirspace: (airspace: Airspace) => void;
  clickedReportingPoint: (reportingPoint: ReportingPoint) => void;
  reportingPoints: ReportingPoint[];
}

const SelectedPOIs = createContext<SelectedPOIsContext>({
  airports: [],
  airspaces: [],
  clear() {},
  clickedAirport() {},
  clickedAirspace() {},
  clickedReportingPoint() {},
  reportingPoints: [],
});

interface SelectedPOIsProviderProps {
  children: ReactNode;
  pane: RefObject<HTMLElement>;
}

function usePOIs<T>(): [T[], (poi: T) => void, () => void] {
  const [pois, setPOIs] = useState<T[]>([]);

  function clickedPOI(poi: T) {
    setPOIs((pois) => [...pois.filter((p) => p !== poi), poi]);
  }

  function clearPOIs() {
    setPOIs([]);
  }

  return [pois, clickedPOI, clearPOIs];
}

export function SelectedPOIsProvider({ children, pane }: SelectedPOIsProviderProps) {
  const [airports, clickedAirport, clearAirports] = usePOIs<Airport>();
  const [airspaces, clickedAirspace, clearAirspaces] = usePOIs<Airspace>();
  const [reportingPoints, clickedReportingPoint, clearReportingPoints] = usePOIs<ReportingPoint>();

  useEffect(() => {
    function clickThrough(event: Event) {
      const target = event.target as HTMLElement | null;
      if (target) {
        const display = target.style.display;
        target.style.display = 'none';
        const { clientX, clientY } = event as MouseEvent;
        const targetBelow = document.elementFromPoint(clientX, clientY);
        if (targetBelow && pane.current?.contains(targetBelow)) {
          const stopped = !targetBelow.dispatchEvent(new MouseEvent(event.type, event));
          if (stopped) {
            event.stopPropagation();
          }
        }
        target.style.display = display;
      }
    }
    if (pane.current) {
      DomEvent.on(pane.current, 'click', clickThrough);
    }
    return () => {
      if (pane.current) {
        DomEvent.off(pane.current, 'click', clickThrough);
      }
    };
  });

  function clear() {
    clearAirports();
    clearAirspaces();
    clearReportingPoints();
  }

  return (
    <SelectedPOIs.Provider
      value={{
        airports,
        airspaces,
        clear,
        clickedAirport,
        clickedAirspace,
        clickedReportingPoint,
        reportingPoints,
      }}
    >
      {children}
    </SelectedPOIs.Provider>
  );
}

export default SelectedPOIs;

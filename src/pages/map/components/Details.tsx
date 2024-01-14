import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useContext } from 'react';
import { useDebounce } from 'usehooks-ts';

import SelectedPOIs from './SelectedPOIs';

function max<A, B>(a: A[], b: B[]) {
  return a.length > b.length ? a : b;
}

function useValue<T>(selectedPOIs: T[]): [T[], number] {
  const debouncedPOIs = useDebounce(selectedPOIs);
  return [max(debouncedPOIs, selectedPOIs), selectedPOIs.length];
}

export default function Details() {
  const {
    airports: selectedAirports,
    airspaces: selectedAirspaces,
    clear,
    reportingPoints: selectedReportingPoints,
  } = useContext(SelectedPOIs);

  const [airports, airportsLength] = useValue(selectedAirports);
  const [airspaces, airspacesLength] = useValue(selectedAirspaces);
  const [reportingPoints, reportingPointsLength] = useValue(selectedReportingPoints);
  const count = useDebounce(airportsLength + airspacesLength + reportingPointsLength, 5);

  return (
    <Dialog open={count > 0} onClose={clear}>
      <DialogTitle>POIs</DialogTitle>
      <DialogContent>
        {airports.map((poi) => (
          <div key={poi._id}>{poi.getIdentifier()}</div>
        ))}
        {airspaces.map((poi) => (
          <div key={poi._id}>{poi.getIdentifier()}</div>
        ))}
        {reportingPoints.map((poi) => (
          <div key={poi._id}>{poi.getIdentifier()}</div>
        ))}
      </DialogContent>
    </Dialog>
  );
}

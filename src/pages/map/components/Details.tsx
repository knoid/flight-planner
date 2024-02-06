import { Button, Dialog, DialogContent } from '@mui/material';
import { useContext } from 'react';

import { AirportIcon, WaypointIcon } from '../../../components/map';
import useDebounce from '../../../components/useDebounce';
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
      <DialogContent>
        {airports.map((poi) => (
          <Button
            href={`/airport/${poi._id}`}
            key={poi._id}
            size="small"
            startIcon={<AirportIcon />}
            variant="contained"
            sx={{ margin: 0.5 }}
          >
            {poi.getIdentifier()}
          </Button>
        ))}
        {airspaces.map((poi) => (
          <Button
            href={`/airspace/${poi._id}`}
            key={poi._id}
            size="small"
            variant="contained"
            sx={{ margin: 0.5 }}
          >
            {poi.getIdentifier()}
          </Button>
        ))}
        {reportingPoints.map((poi) => (
          <Button
            href={`/reporting-point/${poi._id}`}
            key={poi._id}
            size="small"
            startIcon={<WaypointIcon />}
            variant="contained"
            sx={{ margin: 0.5 }}
          >
            {poi.getIdentifier()}
          </Button>
        ))}
      </DialogContent>
    </Dialog>
  );
}

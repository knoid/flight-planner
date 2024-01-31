import { Box, Typography } from '@mui/material';
import { useMatch } from 'react-router-dom';

import { useAirport, useAirspace, useReportingPoint } from '../../components/POIsContext';
import WaypointDetails from '../../components/WaypointDetails';

export const Component = function DetailsPage() {
  const match = useMatch('/:type/:id');
  if (!match || !match.params.id) {
    throw new Error();
  }
  const { type, id } = match.params;
  const airport = useAirport(type === 'airport' && id);
  const airspace = useAirspace(type === 'airspace' && id);
  const reportingPoint = useReportingPoint(type === 'reportingPoint' && id);
  const poi = airport || airspace || reportingPoint;

  return (
    <>
      <Typography variant="h1">{poi?.getIdentifier()}</Typography>
      <Box sx={{ display: 'flex' }}>
        <WaypointDetails airport={airport} airspace={airspace} reportingPoint={reportingPoint} />
      </Box>
    </>
  );
};

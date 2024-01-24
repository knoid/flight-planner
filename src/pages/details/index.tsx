import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import { useAirport, useAirspace, useReportingPoint } from '../../components/POIsContext';
import WaypointDetails from '../../components/WaypointDetails';

export const Component = function DetailsPage() {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    throw new Error();
  }

  const airport = useAirport(id);
  const airspace = useAirspace(id);
  const reportingPoint = useReportingPoint(id);
  const poi = airport || airspace || reportingPoint;

  return (
    <>
      <Typography variant="h1">{poi?.getIdentifier()}</Typography>
      <Box sx={{ display: 'flex' }}>
        <WaypointDetails id={id} />
      </Box>
    </>
  );
};

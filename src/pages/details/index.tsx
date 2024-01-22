import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';

import WaypointDetails from '../../components/WaypointDetails';

export const Component = function DetailsPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    throw new Error();
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <WaypointDetails id={id} />
    </Box>
  );
};

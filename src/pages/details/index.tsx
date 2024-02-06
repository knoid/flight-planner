import { Box, Button, Typography } from '@mui/material';
import { nanoid } from 'nanoid';
import { useMatch } from 'react-router-dom';

import { useAirport, useAirspace, useReportingPoint } from '../../components/POIsContext';
import { useStore } from '../../components/store';
import WaypointDetails from '../../components/WaypointDetails';
import { useI18nContext } from '../../i18n/i18n-react';

const defaultMatch = { params: { id: '', type: '' } };

export const Component = function DetailsPage() {
  const { params } = useMatch('/:type/:id') || defaultMatch;
  const { type, id = '' } = params;
  const { legs, setLegs } = useStore();

  const airport = useAirport(type === 'airport' && id);
  const airspace = useAirspace(type === 'airspace' && id);
  const reportingPoint = useReportingPoint(type === 'reporting-point' && id);
  const poi = airport || airspace || reportingPoint;

  const toggleFromPlan = () => {
    setLegs((legs) => {
      const results = legs.filter((l) => l._id !== id);

      if (results.length !== legs.length) {
        return results; // _this_ leg was removed
      }

      return [...legs, { _id: id, altitude: '', key: nanoid(), wind: '' }];
    });
  };

  const isInPlan = legs.find((leg) => leg._id === id);
  const { LL } = useI18nContext();
  return (
    <>
      <Typography variant="h1">{poi?.getIdentifier()}</Typography>
      <Box sx={{ display: 'flex' }}>
        <WaypointDetails airport={airport} airspace={airspace} reportingPoint={reportingPoint} />
      </Box>
      {(airport || reportingPoint) && (
        <Button
          color={isInPlan ? 'secondary' : 'primary'}
          variant="contained"
          onClick={toggleFromPlan}
        >
          {isInPlan ? LL.removeFromPlan() : LL.addToPlan()}
        </Button>
      )}
    </>
  );
};

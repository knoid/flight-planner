import { LocalAirport as LocalAirportIcon } from '@mui/icons-material';
import { Paper, styled } from '@mui/material';

const PointOnMap = styled('div')({
  aspectRatio: '1',
  position: 'absolute',
  textAlign: 'center',
  transform: 'translate(-50%, -50%)',
  width: 19,
});

export const AirportIcon = PointOnMap.withComponent(LocalAirportIcon);
export const WaypointIcon = styled(PointOnMap)({
  borderBottom: '10px solid black',
  borderLeft: '5px solid transparent',
  borderRight: '5px solid transparent',
  height: 0,
  width: 0,
});
export const WaypointNumber = PointOnMap.withComponent(Paper);

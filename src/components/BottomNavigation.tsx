import {
  ChecklistRtl as ChecklistRtlIcon,
  Flight as FlightIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import {
  BottomNavigation as MuiBottomNavigation,
  BottomNavigationAction,
  BottomNavigationActionOwnProps,
} from '@mui/material';
import { useMatch } from 'react-router-dom';

import { useI18nContext } from '../i18n/i18n-react';

function Action(props: BottomNavigationActionOwnProps) {
  return <BottomNavigationAction {...props} href={`/${props.value}`} />;
}

export default function BottomNavigation() {
  const { LL } = useI18nContext();
  const match = useMatch('/:page/*');
  return (
    <MuiBottomNavigation value={match?.params.page}>
      <Action icon={<MapIcon />} label={LL.map()} value="map" />
      <Action icon={<ChecklistRtlIcon />} label={LL.flightPlan()} value="plan" />
      <Action icon={<FlightIcon />} label={LL.plane()} value="plane" />
    </MuiBottomNavigation>
  );
}

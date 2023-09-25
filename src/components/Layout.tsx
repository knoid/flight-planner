import { Box, Paper } from '@mui/material';
import { Outlet } from 'react-router-dom';

import BottomNavigation from './BottomNavigation';

export default function Layout() {
  return (
    <Box sx={{ pb: 7, height: '100%' }}>
      <Box sx={{ height: '100%', overflow: 'auto' }}>
        <Outlet />
      </Box>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation />
      </Paper>
    </Box>
  );
}

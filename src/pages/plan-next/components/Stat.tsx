import { Grid, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface StatProps {
  children?: ReactNode;
  total?: boolean;
}

export default function Stat({ children, total }: StatProps) {
  return (
    <Grid item xs={2}>
      <Typography
        variant="body2"
        textAlign="center"
        flexGrow={1}
        fontWeight={total ? 'bold' : 'normal'}
      >
        {children}
      </Typography>
    </Grid>
  );
}

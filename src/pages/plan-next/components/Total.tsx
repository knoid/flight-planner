import { Typography } from '@mui/material';
import { ReactNode } from 'react';

interface TotalProps {
  children: ReactNode;
}

export default function Total({ children }: TotalProps) {
  return (
    <Typography variant="body2" textAlign="center" flexGrow={1}>
      {children}
    </Typography>
  );
}

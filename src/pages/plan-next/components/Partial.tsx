import { Typography } from '@mui/material';
import { ReactNode } from 'react';

interface PartialProps {
  children: ReactNode;
  total?: boolean;
}

export default function Partial({ children, total }: PartialProps) {
  return (
    <Typography
      variant="body2"
      textAlign="center"
      flexGrow={1}
      fontWeight={total ? 'bold' : 'normal'}
    >
      {children}
    </Typography>
  );
}

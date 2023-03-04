import { TableCell, styled } from '@mui/material';

export interface TableCellProps {
  color?: 'error';
  hideInPrint?: boolean;
}

export default styled(TableCell, {
  shouldForwardProp: (propName) => propName !== 'hideInPrint',
})<TableCellProps>(({ color, hideInPrint, padding, theme }) => ({
  ...(color && {
    color: theme.palette.error.main,
    fontWeight: 'bold',
  }),
  ...(hideInPrint && {
    '@media print': {
      display: 'none',
    },
  }),
  padding: 6,
  ...(padding === 'none' && {
    padding: 0,
  }),
}));

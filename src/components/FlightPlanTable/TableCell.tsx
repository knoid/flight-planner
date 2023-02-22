import { TableCell, styled } from '@mui/material';

export interface TableCellProps {
  color?: 'error';
}

export default styled(TableCell)<TableCellProps>(({ color, padding, theme }) => ({
  ...(color && {
    color: theme.palette.error.main,
    fontWeight: 'bold',
  }),
  padding: 6,
  ...(padding === 'none' && {
    padding: 0,
  }),
}));

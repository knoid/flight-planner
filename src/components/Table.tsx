import {
  lighten,
  Paper as MuiPaper,
  styled,
  Table as MuiTable,
  TableCell as MuiTableCell,
  TableContainer as MuiTableContainer,
  TableHead as MuiTableHead,
} from '@mui/material';
import { ReactNode } from 'react';

const InlineTable = styled(MuiTable)({
  '@media print': {
    '& td:first-of-type, & th:first-of-type, & td:last-of-type, & th:last-of-type': {
      display: 'none',
    },
  },
  '& th': {
    fontWeight: 'bold',
  },
});

const Paper = styled(MuiPaper)({
  '&&': {
    // https://github.com/styled-components/styled-components/issues/1816#issuecomment-398454088
    display: 'inline-block',
    width: 'auto',
  },
});

interface TableProps {
  children: ReactNode;
}

export default function Table({ children }: TableProps) {
  return (
    <MuiTableContainer component={Paper}>
      <InlineTable size="small">{children}</InlineTable>
    </MuiTableContainer>
  );
}

export interface TableCellProps {
  color?: 'error' | 'warning';
  hideInPrint?: boolean;
}

export const TableCell = styled(MuiTableCell, {
  shouldForwardProp: (propName) => propName !== 'hideInPrint',
})<TableCellProps>(({ color, hideInPrint, padding, theme }) => ({
  ...(color && {
    color: theme.palette[color].main,
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

export const TableHead = styled(MuiTableHead)(({ theme }) => ({
  '@media screen': {
    backgroundColor: lighten(theme.palette.primary.main, 0.8),
  },
}));

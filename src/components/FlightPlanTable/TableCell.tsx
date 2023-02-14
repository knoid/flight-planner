import { TableCell, styled } from '@mui/material';

export default styled(TableCell)(({ theme, padding }) => ({
  padding: 6,
  ...(padding === 'none' && {
    padding: 0,
  }),
}));

import { styled } from '@mui/material';

export default styled('div')(({ theme }) => ({
  margin: '0.5em 0',
  textAlign: 'center',
  [theme.breakpoints.up('sm')]: {
    margin: '1.5em 0',
  },
}));

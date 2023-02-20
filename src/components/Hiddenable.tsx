import { styled } from '@mui/material';

interface HiddenableProps {
  printHidden: boolean;
}

export default styled('div')<HiddenableProps>(({ printHidden }) => ({
  ...(printHidden && {
    '@media print': {
      display: 'none',
    },
  }),
}));

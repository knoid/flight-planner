import { styled, TextField } from '@mui/material';

export default styled(TextField)({
  '@media print': {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'transparent',
    },
  },
});

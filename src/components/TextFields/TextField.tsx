import { styled, TextField, BaseTextFieldProps } from '@mui/material';

export interface TextFieldProps extends BaseTextFieldProps {
  printAlign?: 'left' | 'center' | 'right';
}

export default styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'printAlign',
})<TextFieldProps>(({ printAlign }) => ({
  margin: '0 0.5em',
  ...(printAlign && {
    input: {
      '@media print': {
        textAlign: printAlign,
      },
    },
  }),
}));

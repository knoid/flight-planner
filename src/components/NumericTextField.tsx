import { lighten, styled, TextField, TextFieldProps } from '@mui/material';

const MarginTextField = styled(TextField)(({ theme }) => ({
  margin: '0 0.5em',
  input: {
    textAlign: 'center',
  },
  // '.MuiInputBase-root': {
  //   backgroundColor: 'white',
  // },
  '.MuiInputLabel-root': {
  //   backgroundColor: lighten(theme.palette.primary.main, .8),
  //   borderRadius: theme.shape.borderRadius,
    color: 'black',
  //   padding: '0 0.6em',
  //   marginLeft: '-0.3em',
  },
}));

export default function NumericTextField({ inputProps, ...props }: TextFieldProps) {
  const isValid = !isNaN(Number(props.value));

  return (
    <MarginTextField
      error={!isValid}
      inputProps={{ inputMode: 'numeric', size: 10, ...inputProps }}
      {...props}
    />
  );
}

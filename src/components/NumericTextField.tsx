import { styled, TextField, TextFieldProps } from '@mui/material';

const MarginTextField = styled(TextField)(({ theme }) => ({
  margin: '0 0.5em',
  input: {
    textAlign: 'center',
  },
  '.MuiInputLabel-root': {
    color: 'black',
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

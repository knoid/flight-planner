import { styled, TextFieldProps } from '@mui/material';

import TextField from './TextField';

const CenteredTextField = styled(TextField)({
  input: { textAlign: 'center' },
  label: { color: 'black' },
  margin: '0.7em',
});

export default function NumericTextField({ inputProps, ...props }: TextFieldProps) {
  const isValid = !isNaN(Number(props.value));

  return (
    <CenteredTextField
      error={!isValid}
      inputProps={{ inputMode: 'numeric', size: 10, ...inputProps }}
      {...props}
    />
  );
}

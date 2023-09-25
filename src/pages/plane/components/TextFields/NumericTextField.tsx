import { TextFieldProps } from '@mui/material';

import TextField from '../../../../components/TextField';

export default function NumericTextField({ inputProps, ...props }: TextFieldProps) {
  const isValid = !isNaN(Number(props.value));

  return (
    <TextField
      error={!isValid}
      inputProps={{ inputMode: 'numeric', size: 10, ...inputProps }}
      {...props}
    />
  );
}

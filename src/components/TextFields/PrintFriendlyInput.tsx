import { Input, InputProps, styled } from '@mui/material';

const CustomInput = styled(Input)({
  fontSize: 'inherit',
  input: {
    minWidth: '3.5em',
  },
  '& + span': {
    display: 'none',
  },

  '@media print': {
    display: 'none',
    '& + span': {
      display: 'inline',
    },
  },
});

interface CustomInputProps extends Omit<InputProps, 'value'> {
  value: string;
}

export default function PrintFriendlyInput(props: CustomInputProps) {
  return (
    <>
      <CustomInput {...props} />
      <span>{props.value}</span>
    </>
  );
}

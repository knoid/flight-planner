import { styled } from '@mui/material';
import { ChangeEvent } from 'react';
import { useStore } from '../../../../components/store';
import TextField, { TextFieldProps } from './TextField';

const StyledMetadataField = styled(TextField)<TextFieldProps>({
  '@media print': {
    '.MuiFormLabel-root': {
      display: 'none',
    },
    '.MuiOutlinedInput-notchedOutline': {
      borderWidth: 0,
    },
  },
});

export default function MetadataField({ name, ...props }: TextFieldProps) {
  const { metadata, setMetadata } = useStore();

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    if (name) {
      setMetadata(name, event.currentTarget.value);
    }
  }

  return (
    <StyledMetadataField
      name={name}
      onChange={onChange}
      {...props}
      value={name && (metadata[name] || '')}
    />
  );
}

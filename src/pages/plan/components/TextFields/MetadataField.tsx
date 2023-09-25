import { BaseTextFieldProps } from '@mui/material';
import { ChangeEvent } from 'react';

import { useStore } from '../../../../components/store';
import TextField from '../../../../components/TextField';

export default function MetadataField({ name, ...props }: BaseTextFieldProps) {
  const { metadata, setMetadata } = useStore();

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    if (name) {
      setMetadata(name, event.currentTarget.value);
    }
  }

  return (
    <TextField name={name} onChange={onChange} {...props} value={name && (metadata[name] || '')} />
  );
}

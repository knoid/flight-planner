import { Input, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';

import { useStore } from '../../../../components/store';
import { useI18nContext } from '../../../../i18n/i18n-react';
import { TableCell } from '../Table';

interface NotesRowProps {
  onChange: (value?: string) => void;
  open: boolean;
  value: string;
}

export default function NotesRow({ onChange, open, value: initialValue }: NotesRowProps) {
  const { LL } = useI18nContext();
  const [value, setValue] = useState(initialValue);
  const { includeFrequencies } = useStore();

  useEffect(() => {
    onChange(value || undefined);
  }, [onChange, value]);

  if (!open) {
    return null;
  }

  return (
    <TableRow>
      <TableCell />
      <TableCell colSpan={14 + (includeFrequencies ? 1 : 0)}>
        <Input
          disableUnderline
          fullWidth
          onChange={(event) => setValue(event.currentTarget.value)}
          placeholder={LL.notes_placeholder()}
          size="small"
          value={value}
        />
      </TableCell>
      <TableCell />
    </TableRow>
  );
}

import { Input, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import TableCell from './TableCell';

interface NotesRowProps {
  onChange: (value?: string) => void;
  open: boolean;
  value: string;
}

export default function NotesRow({ onChange, open, value: initialValue }: NotesRowProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    onChange(value || undefined);
  }, [onChange, value]);

  if (!open) {
    return null;
  }

  return (
    <TableRow>
      <TableCell />
      <TableCell colSpan={17}>
        <Input
          disableUnderline
          fullWidth
          onChange={(event) => setValue(event.currentTarget.value)}
          placeholder="Notes…"
          size="small"
          value={value}
        />
      </TableCell>
      <TableCell />
    </TableRow>
  );
}

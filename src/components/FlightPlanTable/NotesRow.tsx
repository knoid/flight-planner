import { Input, TableRow } from '@mui/material';
import TableCell from './TableCell';

interface NotesRowProps {
  onChange: (value?: string) => void;
  open: boolean;
  value: string;
}

export default function NotesRow({ onChange, open, value }: NotesRowProps) {
  if (!open) {
    return null;
  }

  return (
    <TableRow>
      <TableCell />
      <TableCell colSpan={14}>
        <Input
          disableUnderline
          fullWidth
          onChange={(event) => onChange(event.currentTarget.value || undefined)}
          placeholder="Notes…"
          size="small"
          value={value}
        />
      </TableCell>
      <TableCell />
    </TableRow>
  );
}

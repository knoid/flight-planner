import { CommentsDisabled, InsertComment } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { TableCell } from '../Table';

interface AddNotesCellProps {
  onClick: () => void;
  open: boolean;
}

export default function AddNotesCell({ onClick, open }: AddNotesCellProps) {
  const Icon = open ? CommentsDisabled : InsertComment;
  return (
    <TableCell>
      <IconButton onClick={onClick} size="small" title={open ? 'close notes' : 'open notes'}>
        <Icon />
      </IconButton>
    </TableCell>
  );
}

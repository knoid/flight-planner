import { CommentsDisabled, InsertComment } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { useI18nContext } from '../../../../i18n/i18n-react';
import { TableCell } from '../Table';

interface AddNotesCellProps {
  onClick: () => void;
  open: boolean;
}

export default function AddNotesCell({ onClick, open }: AddNotesCellProps) {
  const { LL } = useI18nContext();
  const Icon = open ? CommentsDisabled : InsertComment;
  return (
    <TableCell>
      <IconButton onClick={onClick} size="small" title={open ? LL.closeNotes() : LL.openNotes()}>
        <Icon />
      </IconButton>
    </TableCell>
  );
}

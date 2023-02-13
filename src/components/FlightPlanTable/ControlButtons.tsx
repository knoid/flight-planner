import { ArrowDropDown, ArrowDropUp, Close } from '@mui/icons-material';
import { Button, ButtonGroup, styled } from '@mui/material';

interface ControlButtonsProps {
  disableUp: boolean;
  disableDown: boolean;
  onMoveDown: () => void;
  onMoveUp: () => void;
  onRemove: () => void;
}

const RootButtonGroup = styled(ButtonGroup)({
  borderRadius: 0,
  borderRight: '1px solid rgba(224, 224, 224, 1)',
  '.MuiButtonGroup-grouped:not(:last-of-type)': {
    borderRightWidth: 0,
  },
});

const CloseButton = styled(Button)({
  borderRight: '1px solid rgba(224, 224, 224, 1)',
  borderRadius: 0,
});

const UpDownButtonGroup = styled(ButtonGroup)({
  '.MuiButtonGroup-grouped:not(:last-of-type)': {
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
  },
  '.MuiButton-root': {
    padding: 0,
  }
});

export default function ControlButtons({
  disableDown,
  disableUp,
  onMoveDown,
  onMoveUp,
  onRemove,
}: ControlButtonsProps) {
  return (
    <RootButtonGroup orientation="horizontal" variant="text">
      <CloseButton aria-label="remove" onClick={onRemove} size="small">
        <Close />
      </CloseButton>
      <UpDownButtonGroup orientation="vertical" variant="text">
        <Button
          aria-label="move up"
          disabled={disableUp}
          onClick={onMoveUp}
          size="small"
        >
          <ArrowDropUp />
        </Button>
        <Button
          aria-label="move down"
          disabled={disableDown}
          onClick={onMoveDown}
          size="small"
        >
          <ArrowDropDown />
        </Button>
      </UpDownButtonGroup>
    </RootButtonGroup>
  );
}

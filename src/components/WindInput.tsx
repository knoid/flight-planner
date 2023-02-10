import { ArrowDropDown } from '@mui/icons-material';
import {
  IconButton,
  Input,
  InputAdornment,
  InputProps,
  styled,
} from '@mui/material';
import { ChangeEvent, MouseEventHandler } from 'react';
import PrintFriendlyInput from './PrintFriendlyInput';

const DenseIconButton = styled(IconButton)({
  padding: 0,
});

interface WindInputProps extends Pick<InputProps, 'aria-describedby'> {
  onChange: (value: string) => void;
  onCopyDown: MouseEventHandler<HTMLButtonElement>;
  value: string;
}

export default function WindInput({
  onChange,
  onCopyDown,
  ...props
}: WindInputProps) {
  function onChangeHandler(event: ChangeEvent<HTMLInputElement>) {
    let newValue = event.currentTarget.value;
    if (newValue.length === 3 && !newValue.includes('/')) {
      newValue += '/';
    }
    if (/^[0-9]{0,3}\/?[0-9]{0,3}$/.test(newValue)) {
      onChange?.(newValue);
    }
  }

  return (
    <PrintFriendlyInput
      fullWidth
      inputProps={{ inputMode: 'numeric', size: 5 }}
      onChange={onChangeHandler}
      endAdornment={
        <InputAdornment position="end">
          <DenseIconButton onClick={onCopyDown} size="small">
            <ArrowDropDown />
          </DenseIconButton>
        </InputAdornment>
      }
      size="small"
      {...props}
    />
  );
}

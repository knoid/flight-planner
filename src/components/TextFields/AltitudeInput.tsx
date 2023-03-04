import { ArrowDropDown } from '@mui/icons-material';
import { IconButton, InputAdornment, InputProps, styled } from '@mui/material';
import { ChangeEvent, MouseEventHandler } from 'react';
import PrintFriendlyInput from './PrintFriendlyInput';

export const validation = /^(FL?)?[0-9]*$/iu;

const DenseIconButton = styled(IconButton)({
  padding: 0,
});

interface WindInputProps extends Pick<InputProps, 'aria-describedby'> {
  onChange: (value: string) => void;
  onCopyDown: MouseEventHandler<HTMLButtonElement>;
  value: string;
}

export default function AltitudeInput({ onChange, onCopyDown, ...props }: WindInputProps) {
  function onChangeHandler(event: ChangeEvent<HTMLInputElement>) {
    let newValue = event.currentTarget.value;
    if (newValue.toUpperCase() === 'F') {
      if (props.value.length > newValue.length) {
        newValue = '';
      } else {
        newValue = 'FL';
      }
    }
    if (validation.test(newValue)) {
      onChange?.(newValue);
    }
  }

  function onBlurHandler() {
    let { value } = props;
    if (value.startsWith('FL')) {
      value = `FL${value.substring(2).padStart(3, '0')}`
    }
    onChange?.(value);
  }

  return (
    <PrintFriendlyInput
      fullWidth
      inputProps={{ inputMode: 'numeric', size: 3 }}
      onChange={onChangeHandler}
      onBlur={onBlurHandler}
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

import { styled } from '@mui/material';
import { PickersToolbar } from '@mui/x-date-pickers/internals';
import { PickersToolbarText } from '@mui/x-date-pickers/internals/components/PickersToolbarText';
import { forwardRef, Ref } from 'react';

import { TValue } from './WindPicker.types';

const TimePickerToolbarSeparator = styled(PickersToolbarText)({
  outline: 0,
  margin: '0 4px 0 2px',
  cursor: 'default',
});

const TimePickerToolbarHourMinuteLabel = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
  ...(theme.direction === 'rtl' && {
    flexDirection: 'row-reverse',
  }),
}));

interface WindPickerToolbarProps {
  isLandscape: boolean;
  value: TValue;
}

export const WindPickerToolbar = forwardRef(function WindPickerToolbar(
  { isLandscape, value }: WindPickerToolbarProps,
  ref: Ref<HTMLDivElement>,
) {
  const direction = `${Math.round(value.direction)}`.padStart(3, '0');
  const speed = `${Math.floor(value.speed)}`.padStart(2, '0');
  return (
    <PickersToolbar
      className="MuiPickersLayout-toolbar"
      isLandscape={isLandscape}
      landscapeDirection="row"
      ref={ref}
      toolbarTitle="Select speed and direction"
    >
      <TimePickerToolbarHourMinuteLabel>
        <PickersToolbarText component="span" selected value={direction} variant="h3" />
        <TimePickerToolbarSeparator component="span" tabIndex={-1} value="/" variant="h3" />
        <PickersToolbarText component="span" selected value={speed} variant="h3" />
      </TimePickerToolbarHourMinuteLabel>
    </PickersToolbar>
  );
});

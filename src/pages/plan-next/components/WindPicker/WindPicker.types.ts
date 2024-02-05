import { DateOrTimeView, PickersLayoutSlotsComponentsProps } from '@mui/x-date-pickers';

import { WindPickerToolbar } from './WindPickerToolbar';

export const SIZE = 220;
export const DIRECTION_SIZE = 36;

export interface TValue {
  direction: number;
  speed: number;
}
export const views: DateOrTimeView[] = ['day'];
export const slots = { toolbar: WindPickerToolbar };
export const slotProps: PickersLayoutSlotsComponentsProps<TValue, TValue, DateOrTimeView> = {
  actionBar: { actions: ['clear', 'cancel', 'accept'] },
};

export const clockCenter = {
  x: SIZE / 2,
  y: SIZE / 2,
};

const baseClockPoint = {
  x: clockCenter.x,
  y: 0,
};

export const cx = baseClockPoint.x - clockCenter.x;
export const cy = baseClockPoint.y - clockCenter.y;

import { TimePicker, TimePickerSlotsComponentsProps } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

import { useStore } from '../../../components/store';
import { useI18nContext } from '../../../i18n/i18n-react';

const slotProps: TimePickerSlotsComponentsProps<Dayjs> = {
  actionBar: { actions: ['clear', 'cancel', 'accept'] },
};

export default function TimeInput() {
  const { startTime, setStartTime } = useStore();
  const { LL } = useI18nContext();
  return (
    <TimePicker
      ampm={false}
      label={LL.departureTime()}
      minutesStep={5}
      onAccept={(time) => setStartTime(time?.format('HH:mm') || '')}
      slotProps={slotProps}
      value={startTime ? dayjs(startTime, 'HH:mm') : null}
    />
  );
}
